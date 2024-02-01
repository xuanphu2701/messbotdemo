var logger = require('morgan');
var http = require('http');
var bodyParser = require('body-parser');
var express = require('express');
var request = require('request');
var dotenv = require('dotenv');
var pg = require('pg');
var router = express();

dotenv.config();

const ACCESS_TOKEN = "EAAZAISQJluyQBO16FalqP7a3FffzU06WFHiheGd2sBwZAZBMyPzThPPbHHRgK3I0yEx9OUk66fNZB4ztkbbZAG2uexYV2udjEDhgn2YRkKTIUjF63iUPHc1vMfPpZAgGquwIcwcPb4ZAJvhzRGGXIVnHd6w9Y6VSAwDRDgNeZBh3qk4sZCEo38DeaECYFignl2ZBYh"

var app = express();
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

//dev
var server = http.createServer(app);
app.listen(process.env.PORT || 3000);

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
  sendMessage(senderId, JSON.stringify(req.body));
//   for (var entry of entries) {
//     var messaging = entry.messaging;
//     for (var message of messaging) {
//       var senderId = message.sender.id;
//       if (message.message) {
//         // Nếu người dùng gửi tin nhắn đến
//         if (message.message.text) {
//           var text = message.message.text;
//           if(text == 'hi' || text == "hello")
//           {
//             sendMessage(senderId, "Xuân Phú's bot: " + 'Xin Chào');
//           }
//           else{sendMessage(senderId, "Xuân Phú's Bot: " + "Xin lỗi, câu hỏi của bạn chưa có trong hệ thống, chúng tôi sẽ cập nhật sớm nhất.");}
//         }
//       }
//     }
//   }

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