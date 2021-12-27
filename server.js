
const express = require('express');
const job = require('./job.js')

var app = express();

app.get('/', async function (req, res) {
    res.sendFile('index.html', { root: __dirname });
});

app.get('/runJob', async function (req, res) {
    await job.run();
    res.send("执行成功")
});


var server = app.listen(8081, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("应用实例，访问地址为 http://%s:%s", host, port)
});

