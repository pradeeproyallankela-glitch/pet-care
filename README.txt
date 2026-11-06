PAWCARE - PET CARE MANAGEMENT SYSTEM
Express.js + MySQL | Mini Project

FEATURES
- Dashboard with owner, pet and appointment summary
- Three relational tables: owners, pets and appointments
- Create, view, search, edit and delete records
- Foreign-key relationships: pets belong to owners; appointments belong to pets
- Responsive interface and sample records

REQUIREMENTS
- Node.js and npm
- MySQL Server (Workbench optional)

SETUP
1. Extract the ZIP and open the pawcare-pet-care folder in VS Code.
2. Open MySQL Workbench or terminal and execute schema.sql.
   Terminal: mysql -u root -p < schema.sql
3. In app.js, set the MySQL password in the connection configuration,
   OR set DB_PASSWORD as an environment variable.
4. Open terminal in the project folder and run: npm install
5. Make sure the terminal is opened inside the extracted pawcare-pet-care folder.
6. Run: npm start (do not use VS Code Live Server for this project).
7. Open: http://localhost:3000

DEFAULT DATABASE SETTINGS
Host: localhost | User: root | Database: pawcare
Set DB_USER / DB_PASSWORD / DB_HOST / DB_NAME if your setup differs.

NOTE
Owners and pets with linked records cannot be deleted until related records
are removed. This protects the database relationships.

CSS TROUBLESHOOTING
- Keep the public folder structure unchanged: public/css/style.css and public/js/app.js.
- Start the Express server with npm start from this project folder.
- Do not open index.html with Live Server; the application needs Express and MySQL.
- If styles still look unformatted, press Ctrl+F5 to hard-refresh the browser.
