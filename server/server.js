// load a module and save its top level export to a const

import express from 'express';
import bodyParser from 'body-parser';
import { MongoClient } from 'mongodb';
import 'babel-polyfill';
import SourceMapSupport from 'source-map-support';

SourceMapSupport.install();

import Issue from './issue.js';

// instantiate the application
const app = express();

// mount a middleware -- .static -- on a directory -- /static
// /static is where the index.html file resides
// treats /static as the root '/' of the web server
app.use(express.static('static'));

// mount json parser middleware from bodyParser
app.use(bodyParser.json());

let db;

// Initializes HMR middleware
if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');

  const config = require('../webpack.config');
  config.entry.app.push('webpack-hot-middleware/client', 'webpack/hot/only-dev-server');
  config.plugins.push(new webpack.HotModuleReplacementPlugin());

  const bundler = webpack(config);
  app.use(webpackDevMiddleware(bundler, { noInfo: true }));
  app.use(webpackHotMiddleware(bundler, { log: console.log }));
}

// List API
app.get('/api/issues', (req, res) => {
  db.collection('issues').find().toArray()
  .then(issues => {
    const metadata = { total_count: issues.length };
    res.json({ _metadata: metadata, records: issues });
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ metadata: `Internal Server Error: ${error}` });
  });
});

// Defines application setting
// (<setting name>, <setting value>)
// sets JSON.stringify space property to 2 spaces
app.set('json spaces', 2);

// Create API
app.post('/api/issues', (req, res) => {
  const newIssue = req.body;
  newIssue.created = new Date();
  if (!newIssue.status) {
    newIssue.status = 'New';
  }

  const err = Issue.validateIssue(newIssue);
  if (err) {
    res.status(422).json({ message: `Invalid Request: ${err}` });
    return;
  }

  db.collection('issues').insertOne(Issue.cleanupIssue(newIssue)).then(result =>
    db.collection('issues').find({ _id: result.insertedId }).limit(1)
    .next()
  )
  .then(savedIssue => {
    res.json(savedIssue);
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ message: `Internal Server Error: ${error}` });
  });
});

MongoClient.connect('mongodb://localhost/issuetracker').then(connection => {
  db = connection;
  app.listen(3000, () => {
    console.log('App started on port 3000!');
  });
}).catch(error => {
  console.log('ERROR:', error);
});
