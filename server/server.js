'use strict'

// load a module and save its top level export to a const
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const Issue = require('./issue.js');

// instantiate the application
const app = express();

// mount a middleware -- .static -- on a directory -- /static
// /static is where the index.html file resides
// treats /static as the root '/' of the web server
app.use(express.static('static'));

// mount json parser middleware from bodyParser
app.use(bodyParser.json());

// List API
app.get('/api/issues', (req, res) => {
    db.collection('issues').find().toArray().then(issues => {
        const metadata = { total_count: issues.length };
        res.json( { _metadata: metadata, records: issues });
    }).catch(error => {
        console.log(error);
        res.status(500).json({ metadata: `Internal Server Error: ${error}` });
    });
});

const validIssueStatus = {
    New: true,
    Open: true,
    Assigned: true,
    Fixed: true,
    Verified: true,
    Closed: true,
};

const issueFieldType = {
    status: 'required',
    owner: 'required',
    effort: 'optional',
    created: 'required',
    completionDate: 'optional',
    title: 'required',
};

function validateIssue(issue) {
    for(const field in issueFieldType) {
        const type = issueFieldType[field];
        if (!type) {
            delete issue[field];
        } else if (type === 'required' && !issue[field]) {
            return `${field} is required.`;
        }
    }
    if (!validIssueStatus[issue.status])
        return `${issue.status} is not a valid status.`;

    return null;
}

// Defines application setting
// (<setting name>, <setting value>)
// sets JSON.stringify space property to 2 spaces
app.set('json spaces', 2);

// Create API
app.post('/api/issues', (req, res) => {
    const newIssue = req.body;
    newIssue.created = new Date();
    if (!newIssue.status)
        newIssue.status = 'New';

    const err = Issue.validateIssue(newIssue);
    if (err) {
        res.status(422).json({message: `Invalid Request: ${err}`});
        return;
    }
    db.collection('issues').insertOne(newIssue).then(result => 
        db.collection('issues').find({ _id: result.insertedId }).limit(1).next()
    ).then(newIssue => {
        res.json(newIssue);
    }).catch(error => {
        console.log(error);
        res.status(500).json({ message: `Internal Server Error: ${error}`});
    });
});


let db;
MongoClient.connect('mongodb://localhost/issuetracker').then(connection => {
    db = connection;
    app.listen(3000, () => {
        console.log('App started on port 3000!');
    });    
}).catch(error => {
    console.log('ERROR:', error);
});

