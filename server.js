// load a module and save its top level export to a const
const express = require('express');

// instantiate the application
const app = express();

// mount a middleware -- .static -- on a directory -- /static
// /static is where the index.html file resides
// treats /static as the root '/' of the web server
app.use(express.static('static'));

app.listen(3000, function() {
    console.log('App started on port 3000!');
});