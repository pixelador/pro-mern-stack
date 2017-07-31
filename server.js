// load a module and save its top level export to a const
const express = require('express');
const bodyParser = require('body-parser');


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
        title: 'Missing bottom border on panel',
    },
];

app.get('/api/issues', (req, res) => {
    const metadata = {total_count: issues.length};
    console.log('Log statement before the response!');
    res.json({_metadata: metadata, records: issues});
});

// Defines application setting
// (<setting name>, <setting value>)
// sets JSON.stringify space property to 2 spaces
app.set('json spaces', 2);

app.post('/api/issues', (req, res) => {
    const newIssue = req.body;
    newIssue.id = issues.length + 1;
    newIssue.created = new Date();
    if (!newIssue.status)
        newIssue.status = 'New';
    issues.push(newIssue);
    res.json(newIssue);
});

app.listen(3000, function() {
    console.log('App started on port 3000!');
});