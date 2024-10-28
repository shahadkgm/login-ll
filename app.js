const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();

const PORT = 3000;

// Define predefined credentials
const USERNAME = 'user123';
const PASSWORD = 'pass123';

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

// Session configuration
app.use(
  session({
    secret: 'secret-key',       // Replace with a secure key
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 }   // Session lasts for 1 minute
  })
);

// Route for login page
app.get('/', (req, res) => {
  if (req.session.isAuthenticated) {
    res.redirect('/home');
  } else {
    res.render('login', { message: null });
  }
});

// Route to handle login submission
app.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (username === USERNAME && password === PASSWORD) {
    req.session.isAuthenticated = true;
    res.redirect('/home');
  } else {
    res.render('login', { message: 'Incorrect username or password' });
  }
});

// Home page route (protected)
app.get('/home', (req, res) => {
  if (req.session.isAuthenticated) {
    res.render('home');
  } else {
    res.redirect('/');
  }
});

// Signout route
app.post('/signout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.redirect('/home');
    }
    res.clearCookie('connect.sid');
    res.redirect('/');
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
