const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

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
    'mongodb+srv://manny:' +
      process.env.MONGO_ATLAS_PW +
      '@cluster0-dfg9e.mongodb.net/node-angular?retryWrites=true',
    { useNewUrlParser: true, useCreateIndex: true }
  )
  .then(() => {
    console.log('Connected to cloud database!');
  })
  .catch(() => {
    console.log('Connection failed');
  });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// allow request to images folder
app.use('/images', express.static(path.join('images')));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');

  // call next because you want to continue to next method
  next();
});

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);

module.exports = app;
