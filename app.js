const express = require('express');
const app = express();
const configRoutes = require('./routes');
const exphbs = require('express-handlebars');
const session = require('express-session');
const path = require('path'); // Import the path module

app.use(
  session({
    name: 'AuthSession',
    secret: 'This is a secret',
    saveUninitialized: false,
    resave: false,
    maxAge: 86400000 
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine('handlebars', exphbs.engine({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});
