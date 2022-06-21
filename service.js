const url = require('url');
const db = require('./database.json');

exports.sampleRequest = function (req, res) {
    const reqUrl = url.parse(req.url, true);
    var name = 'World';
    if (reqUrl.query.name) {
        name = reqUrl.query.name
    }

    var response = {
        "text": "Hello " + name
    };

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
};

exports.testRequest = function (req, res) {
    body = '';

    req.on('data', function (chunk) {
        body += chunk;
    });

    req.on('end', function () {

        postBody = JSON.parse(body);

        var response = {
            "text": "Post Request Value is  " + postBody.value
        };

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(response));
    });
};

exports.invalidRequest = function (req, res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Invalid Request');
};

exports.getUsers = function(req, res) {
    const reqUrl = url.parse(req.url, true);

    var users = db.users;

    if (reqUrl.query.id) {
        users = users.filter(u => u.id == reqUrl.query.id);
    }

    if (reqUrl.query.name) {
        const keyword = reqUrl.query.name.toLocaleLowerCase();
        users = users.filter(u => 
            u.firstName.toLocaleLowerCase().includes(keyword) ||
            u.lastName.toLocaleLowerCase().includes(keyword) ||
            `${u.firstName} ${u.lastName}`.toLocaleLowerCase().includes(keyword)
        );
    }
    
    var response = {
        users: users.map(u => {
            return {
                id: u.id,
                name: u.firstName + ' ' + u.lastName,
                email: u.email,
                avatar: u.avatar,
                created_at: u.createdAt
            }
        })
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(response));
}