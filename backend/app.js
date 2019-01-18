const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// convention is capital
const Post = require('./models/post');

// marks the beggining
const app = express();

mongoose.connect(
  'mongodb://localhost:27017/mean-app',
  { useNewUrlParser: true }
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');

  // call next because you want to continue to next method
  next();
});

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  console.log(post);
  res.status(201).json({
    message: 'Post added successfully'
  });
});

app.get('/api/posts', (req, res, next) => {
  const posts = [
    { id: '1', title: 'First server-side post', content: 'This is coming from the server' },
    { id: '2', title: 'Second server-side post', content: 'This is coming from the server!' }
  ];
  res.status(200).json({
    message: 'Posts fetched succesfully!',
    posts: posts
  });
});

module.exports = app;
