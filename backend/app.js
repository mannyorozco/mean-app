const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// convention is capital
const Post = require('./models/post');

// marks the beggining
const app = express();

// connect locally
// mongoose
//   .connect(
//     'mongodb://localhost:27017/node-angular',
//     { useNewUrlParser: true }
//   )
//   .then(() => {
//     console.log('Connected to local database');
//   })
//   .catch(() => {
//     console.log('Failed to connect to local database');
//   });

// connect remotely
mongoose
  .connect(
    'mongodb+srv://manny:QbGKBHSa7WWOdXRn@cluster0-dfg9e.mongodb.net/node-angular?retryWrites=true',
    { useNewUrlParser: true }
  )
  .then(() => {
    console.log('Connected to cloud database!');
  })
  .catch(() => {
    console.log('Connection failed');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  // call next because you want to continue to next method
  next();
});

app.post('/api/posts', (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content
  });

  post.save().then(createdPost => {
    res.status(201).json({
      message: 'Post added successfully',
      postId: createdPost._id
    });
  });
});

app.get('/api/posts', (req, res, next) => {
  Post.find().then(documents => {
    console.log(documents);
    res.status(200).json({
      message: 'Posts fetched succesfully!',
      posts: documents
    });
  });
});

app.get('/api/posts/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post);
    } else {
      res.status(404).json({ message: 'Post not found!' });
    }
  });
});

app.put('/api/posts/:id', (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content
  });
  Post.updateOne({ _id: req.params.id }, post).then(result => {
    res.status(200).json({ message: 'Update successful' });
  });
});

app.delete('/api/posts/:id', (req, res, next) => {
  Post.deleteOne({ _id: req.params.id }).then(result => {
    console.log(result);
  });
  res.status(200).json({ message: 'Post deleted' });
});

module.exports = app;
