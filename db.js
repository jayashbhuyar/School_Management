const mysql = require('mysql');

const db = mysql.createConnection({
  host: 'sql12.freesqldatabase.com',
  user: 'sql12747888',
  password: 'MswFNKpGWI',
  database: 'sql12747888',
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    return;
  }
  console.log('Connected to the database');
});

module.exports = db;
