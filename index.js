var express = require("express");
const http = require('http');
const path = require('path');
const url = require('url');
const db = require("./db");
var bodyParser = require('body-parser');

var app = express();


// app.use(express.static("webapp"));
app.use(express.static(__dirname+"/webapp/"));
app.use(bodyParser.json({ type: 'application/*+json' }));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + "/webapp/view/index.html"));
});

app.post("/students", function(req, res) {
    db.addStudent(req.query.name,req.query.birthday)
        .then((student) => {
            var response={state:"ok", student:student[0].dataValues};
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(response));
        })
        .catch(() => {
            var response={state:"fail"};
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(response));
        });
});

app.get("/students", function(req, res) {
    db.getStudents()
        .then(students => {
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(students));
        })
        .catch(() => {
            res.send(JSON.stringify([]));
        });
});

app.post("/students/del/:id", function(req, res) {
    db.deleteStudent(req.param("id"))
        .then(() => {
            var response={state:"ok"};
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(response));
        })
        .catch(() => {
            var response={state:"fail"};
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(response));
        });
});

app.post("/students/:id", function(req, res) {
    db.changeStudent(req.param("id"),req.query.name,req.query.birthday)
        .then(() => {
            var response={state:"ok"};
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(response));
        })
        .catch(() => {
            var response={state:"fail"};
            res.setHeader("Content-Type", "application/json");
            res.send(JSON.stringify(response));
        });

});

const server = http.createServer(app);

server.listen(3000, function listening() {
    console.log('Listening on %d', server.address().port);
});