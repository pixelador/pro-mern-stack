db = new Mongo().getDB('issuetracker');

db.issues.remove({});

db.issues.insert([
    {
        status: 'Open',
        owner: 'Ravan',
        created: new Date('2017-08-15'),
        effort: 5,
        completionDate: undefined,
        title: 'Error in console when clickingAdd',
    },
    {
        status: 'Assigned',
        owner: 'Eddie',
        created: new Date('2017-08-16'),
        errort: 14,
        completionDate: new Date('2017-08-30'),
        title: 'Missing bottom border on panel',
    },
]);

db.issues.createIndex({status: 1});
db.issues.createIndex({owner: 1});
db.issues.createIndex({created: 1});