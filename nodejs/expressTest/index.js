var express = require('express');
var app = express();

app.get('/lab/startpage', function(req, res) {
  var query = req.query;
  console.log('/lab/statpage ' + JSON.stringify(query));

  var data = {
    CODE: 'ok',
    DATA: {
      qd: {
        code: 1 + parseInt(query.qdCode, 10),
        img: 'http://www.33lc.com/article/UploadPic/2012-9/201292811313286051.jpg'
      },
      gg: {
        code: 1 + parseInt(query.ggCode, 10),
        img: 'http://www.deskcar.com/desktop/fengjing/2012524/8.jpg',
        disable: true,
        duration: 3000,
        showSkipBtn: true,
        skipBtnPosition: 1,
        interval: 0
      },
      yd: {
        code: 1 + parseInt(query.ydCode, 10),
        img: ['http://pic19.nipic.com/20120310/8061225_093309101000_2.jpg', 'http://img.win7china.com/NewsUploadFiles/20090823_121319_375_u.jpg', 'http://p7.qhimg.com/t01308022902bb3cc15.jpg', 'http://www.pp3.cn/uploads/allimg/111118/10562Cb5-13.jpg'],
        startTime: 0,
        times: 5,
        interval: 0
      }
    }
  };
  res.setHeader('Cache-Control', 'no-cache');
  res.json(data);
});

var server = app.listen(3003, function() {
  var port = server.address().port;

  console.log('Server started: http://localhost:' + port + '/');
});