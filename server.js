// RESTAPI adatbázis és kliensoldal

const express = require('express');
const mysql = require('mysql');
const path = require('path');
const app = express();
const port = 8080;

// MySQL adatbázis kapcsolat beállítása
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'mysql',
    database: 'gyakorlas'
  });


  connection.connect(err => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the MySQL server.');
  });
  
  // Statikus fájlok kiszolgálása
  app.use(express.static(path.join(__dirname, 'public')));
  
  // Gyökér útvonal kezelése, hogy az index.html betöltődjön
  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
  
  // Kategóriák lekérése
  app.get('/api/categories', (req, res) => {
    connection.query('SELECT * FROM category', (err, results) => {
      if (err) {
        console.error('Error fetching categories:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.json(results);
    });
  });
  
  // Cikkek lekérése kategória alapján
  app.get('/api/articles/:categoryName', (req, res) => {
    const categoryName = req.params.categoryName;
    connection.query('SELECT * FROM article WHERE name = ?', [categoryName], (err, results) => {
      if (err) {
        console.error('Error fetching articles:', err);
        res.status(500).send('Internal Server Error');
        return;
      }
      res.json(results);
    });
  });
  
  // Szerver indítása
  app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });