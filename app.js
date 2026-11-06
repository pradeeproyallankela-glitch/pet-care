const express = require('express');
const mysql = require('mysql8');
const app = express();
app.use(express.json());
app.use(express.static(require('path').join(__dirname, 'public')));

const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'pawcare',
  dateStrings: true
});

db.connect(err => {
  if (err) { console.error('MySQL connection failed:', err.message); return; }
  console.log('Connected to PawCare database');
});

const tables = {
  owners: { table: 'owners', id: 'owner_id', fields: ['full_name','phone','email','address'] },
  pets: { table: 'pets', id: 'pet_id', fields: ['owner_id','pet_name','species','breed','age','gender','weight','notes'] },
  appointments: { table: 'appointments', id: 'appointment_id', fields: ['pet_id','appointment_date','appointment_time','service','veterinarian','status','notes'] }
};
function sendError(res, err) {
  if (err.code === 'ER_DUP_ENTRY') return res.status(409).send('A record with these details already exists.');
  if (err.code === 'ER_NO_REFERENCED_ROW_2') return res.status(400).send('Please select a valid related owner or pet.');
  if (err.code === 'ER_ROW_IS_REFERENCED_2') return res.status(409).send('This record is linked to other records. Remove its related records first.');
  return res.status(500).send(err.message);
}
function valid(table, body) {
  const required = {
    owners: ['full_name','phone'],
    pets: ['owner_id','pet_name','species'],
    appointments: ['pet_id','appointment_date','appointment_time','service']
  }[table];
  const missing = required.filter(k => body[k] === undefined || String(body[k]).trim() === '');
  return missing.length ? 'Please fill all required fields: ' + missing.join(', ') : null;
}

app.get('/api/dashboard', (req,res) => {
  const sql = `SELECT (SELECT COUNT(*) FROM owners) owners, (SELECT COUNT(*) FROM pets) pets,
    (SELECT COUNT(*) FROM appointments WHERE appointment_date >= CURDATE() AND status <> 'Cancelled') upcoming,
    (SELECT COUNT(*) FROM appointments WHERE appointment_date = CURDATE()) today`;
  db.query(sql, (e,r) => e ? sendError(res,e) : res.json(r[0]));
});
app.get('/api/owners', (req,res) => db.query('SELECT * FROM owners ORDER BY owner_id DESC',(e,r)=>e?sendError(res,e):res.json(r)));
app.get('/api/pets', (req,res) => db.query('SELECT p.*, o.full_name AS owner_name FROM pets p JOIN owners o ON p.owner_id=o.owner_id ORDER BY p.pet_id DESC',(e,r)=>e?sendError(res,e):res.json(r)));
app.get('/api/appointments', (req,res) => db.query(`SELECT a.*, p.pet_name, o.full_name AS owner_name FROM appointments a JOIN pets p ON a.pet_id=p.pet_id JOIN owners o ON p.owner_id=o.owner_id ORDER BY a.appointment_date DESC,a.appointment_time DESC`,(e,r)=>e?sendError(res,e):res.json(r)));

Object.entries(tables).forEach(([key,cfg]) => {
  app.post('/api/'+key,(req,res)=>{
    const problem=valid(key,req.body); if(problem) return res.status(400).send(problem);
    const values=cfg.fields.map(f=>req.body[f] === '' ? null : req.body[f]);
    const sql=`INSERT INTO ${cfg.table} (${cfg.fields.join(',')}) VALUES (${cfg.fields.map(()=>'?').join(',')})`;
    db.query(sql,values,(e,r)=>e?sendError(res,e):res.status(201).json({message:'Record created',id:r.insertId}));
  });
  app.put('/api/'+key+'/:id',(req,res)=>{
    const problem=valid(key,req.body); if(problem) return res.status(400).send(problem);
    const values=cfg.fields.map(f=>req.body[f] === '' ? null : req.body[f]);
    db.query(`UPDATE ${cfg.table} SET ${cfg.fields.map(f=>f+'=?').join(',')} WHERE ${cfg.id}=?`,[...values,req.params.id],(e,r)=>e?sendError(res,e):r.affectedRows?res.json({message:'Record updated'}):res.status(404).send('Record not found'));
  });
  app.delete('/api/'+key+'/:id',(req,res)=>db.query(`DELETE FROM ${cfg.table} WHERE ${cfg.id}=?`,[req.params.id],(e,r)=>e?sendError(res,e):r.affectedRows?res.json({message:'Record deleted'}):res.status(404).send('Record not found')));
});

app.get('*path',(req,res)=>res.sendFile(require('path').join(__dirname,'public','index.html')));
const PORT=process.env.PORT||3000;
app.listen(PORT,()=>console.log(`PawCare running at http://localhost:${PORT}`));
