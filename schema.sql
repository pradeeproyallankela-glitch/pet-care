CREATE DATABASE IF NOT EXISTS pawcare CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE pawcare;

CREATE TABLE IF NOT EXISTS owners (
  owner_id INT AUTO_INCREMENT PRIMARY KEY,
  full_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(120) UNIQUE,
  address VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pets (
  pet_id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  pet_name VARCHAR(80) NOT NULL,
  species VARCHAR(40) NOT NULL,
  breed VARCHAR(80),
  age DECIMAL(4,1),
  gender ENUM('Male','Female','Unknown') DEFAULT 'Unknown',
  weight DECIMAL(6,2),
  notes VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_pet_owner FOREIGN KEY (owner_id) REFERENCES owners(owner_id) ON UPDATE CASCADE ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS appointments (
  appointment_id INT AUTO_INCREMENT PRIMARY KEY,
  pet_id INT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  service VARCHAR(100) NOT NULL,
  veterinarian VARCHAR(100),
  status ENUM('Scheduled','Completed','Cancelled') DEFAULT 'Scheduled',
  notes VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_appointment_pet FOREIGN KEY (pet_id) REFERENCES pets(pet_id) ON UPDATE CASCADE ON DELETE RESTRICT
);

INSERT IGNORE INTO owners (owner_id,full_name,phone,email,address) VALUES
(1,'Aarav Sharma','9876543210','aarav@example.com','Kurnool, Andhra Pradesh'),
(2,'Ananya Reddy','9123456780','ananya@example.com','Hyderabad, Telangana'),
(3,'Rahul Varma','9988776655','rahul@example.com','Vijayawada, Andhra Pradesh');
INSERT IGNORE INTO pets (pet_id,owner_id,pet_name,species,breed,age,gender,weight,notes) VALUES
(1,1,'Bruno','Dog','Golden Retriever',3,'Male',28.5,'Friendly, active and vaccinated'),
(2,2,'Luna','Cat','Persian',2,'Female',4.2,'Indoor pet; sensitive skin'),
(3,3,'Milo','Dog','Beagle',1.5,'Male',9.8,'Puppy wellness plan');
INSERT IGNORE INTO appointments (appointment_id,pet_id,appointment_date,appointment_time,service,veterinarian,status,notes) VALUES
(1,1,DATE_ADD(CURDATE(),INTERVAL 1 DAY),'10:30:00','General check-up','Dr. Meera','Scheduled','Annual wellness check'),
(2,2,DATE_ADD(CURDATE(),INTERVAL 2 DAY),'12:00:00','Vaccination','Dr. Kiran','Scheduled','Booster dose'),
(3,3,DATE_SUB(CURDATE(),INTERVAL 1 DAY),'16:00:00','Dental cleaning','Dr. Meera','Completed','Routine dental care');
