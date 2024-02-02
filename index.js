var logger = require('morgan');
var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var request = require('request');
var dotenv = require('dotenv');
var pg = require('pg');
var router = express();
const handleMessage = require('./handleMessage.js');

dotenv.config();

const ACCESS_TOKEN = "EAAZAISQJluyQBO16FalqP7a3FffzU06WFHiheGd2sBwZAZBMyPzThPPbHHRgK3I0yEx9OUk66fNZB4ztkbbZAG2uexYV2udjEDhgn2YRkKTIUjF63iUPHc1vMfPpZAgGquwIcwcPb4ZAJvhzRGGXIVnHd6w9Y6VSAwDRDgNeZBh3qk4sZCEo38DeaECYFignl2ZBYh"

const config = {
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT
};

const client = new pg.Client(config);

// Listen for the 'connect' event
client.on('connect', () => {
  console.log('Connected to PostgreSQL database');
});

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

//dev
var server = http.createServer(app);
app.listen(process.env.PORT || 3000, () => {
    console.log("Server listening on port 2000");
});

app.get('/', (req, res) => {
  res.send("Server chạy ngon lành.");
});

app.get('/webhook', function(req, res) {
  if (req.query['hub.verify_token'] === 'phudeptrai') {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

// Đoạn code xử lý khi có người nhắn tin cho bot
app.post('/webhook', function(req, res) {
  var entries = req.body.entry;
  for (var entry of entries) {
    var messaging = entry.messaging;
    for (var message of messaging) {
      var senderId = message.sender.id;
      if (message.message) {
        // Nếu người dùng gửi tin nhắn đến
        if (message.message.text) {
          var text = message.message.text;
          var resStr = handleMessage(text);
          sendMessage(senderId, resStr);
        }
      }
    }
  }

  res.status(200).send("OK");
});

// Gửi thông tin tới REST API để Bot tự trả lời
function sendMessage(senderId, message) {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: ACCESS_TOKEN,
    },
    method: 'POST',
    json: {
      recipient: {
        id: senderId
      },
      message: {
        text: message
      },
    }
  });
}