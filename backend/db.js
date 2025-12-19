const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'mysql-16b0476-gudisevabrothers-9df8.k.aivencloud.com',
    user: process.env.DB_USER || 'avnadmin',
    password: process.env.DB_PASSWORD, // Must be set in Environment Variables
    database: process.env.DB_NAME || 'defaultdb',
    port: process.env.DB_PORT || 28294,
    ssl: {
        rejectUnauthorized: false
    }
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL Database');

    // Create Users Table
    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            image TEXT,
            role ENUM('USER', 'ADMIN') DEFAULT 'USER'
        )
    `;

    db.query(createUsersTable, (err, result) => {
        if (err) console.error('Error creating users table:', err);
        else console.log('Users table ready');
    });

    // Create Content Table (For Admin-managed User Content)
    const createContentTable = `
        CREATE TABLE IF NOT EXISTS content (
            id INT AUTO_INCREMENT PRIMARY KEY,
            title VARCHAR(255) NOT NULL,
            description TEXT,
            image TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    `;

    db.query(createContentTable, (err, result) => {
        if (err) console.error('Error creating content table:', err);
        else console.log('Content table ready');
    });

    // Seed Default Admin
    const checkAdmin = "SELECT * FROM users WHERE email = 'admin@gmail.com'";
    db.query(checkAdmin, (err, results) => {
        if (results.length === 0) {
            const seedAdmin = "INSERT INTO users (name, email, password, role) VALUES ('Default Admin', 'admin@gmail.com', 'admin@123', 'ADMIN')";
            db.query(seedAdmin, (err, res) => {
                if (err) console.error("Error seeding admin:", err);
                else console.log("Default Admin created: admin@gmail.com / admin@123");
            });
        }
    });
});

module.exports = db;
