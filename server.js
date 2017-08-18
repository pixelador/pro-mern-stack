'use strict'

// load a module and save its top level export to a const
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

// instantiate the application
const app = express();

// mount a middleware -- .static -- on a directory -- /static
// /static is where the index.html file resides
// treats /static as the root '/' of the web server
app.use(express.static('static'));

// mount json parser middleware from bodyParser
app.use(bodyParser.json());

const issues = [
    {
        id: 1,
        status: 'Open',
        owner: 'Ravan',
        created: new Date('2016-08-15'),
        effort: 5,
        completionDate: undefined,
        title: 'Error in console when clicking Add',
    },
    {
        id: 2,
        status: 'Assigned',
        owner: 'Eddie Izzard',
        created: new Date('2016-08-16'),
        effort: 14,
        completionDate: new Date('2016-08-30'),
        title: 'Oi, Missing bottom border on panel',
    },
];

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
    id: 'required',
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
    newIssue.id = issues.length + 1;
    newIssue.created = new Date();
    if (!newIssue.status)
        newIssue.status = 'New';

    const err = validateIssue(newIssue);
    if (err) {
        res.status(422).json({message: `Invalid Request: ${err}`});
        return;
    }
    issues.push(newIssue);
    res.json(newIssue);
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

