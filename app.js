const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const blogRoutes = require('./routes/blogRoutes');
require('dotenv').config({ path: __dirname + '/.env' });
const dataBase = process.env['DATABASE_STRING'];
const port = process.env['PORT_NUMBER'];

const dbURI = dataBase;
mongoose
  .connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => app.listen(port))
  .catch((err) => console.log(err));

// register view engine
app.set('view engine', 'ejs');
// app.set('views', 'myViews');

// middleware & static files
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(req.hostname);
  console.log(req.method);
  next();
});

app.get('/add-blog', (req, res) => {
  const blog = new Blog({
    title: 'TypeScript',
    snippet: 'mongo db and mongooose',
    body:
      'Node js was launched less than a decade ago but it is built on top of JavaScript and NPM libraries. Node js is also object-oriented programming language that offers blazingly fast performance but quite fewer security features as compared to java. ',
  });

  blog
    .save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.use('/blogs', blogRoutes);

app.get('/create', (req, res) => {
  res.render('create', { title: 'Create Blog' });
});

app.get('/about', (req, res) => {
  // res.sendFile('./viewss/about.html', { root: __dirname });
  res.render('about', { title: 'About' });
});

app.get('/about-us', (req, res) => {
  res.status(302).redirect('/about');
});

app.use((req, res) => {
  // res.status(404).sendFile('./viewss/404.html', { root: __dirname });
  res.render('404', { title: 'Not Found' });
});
