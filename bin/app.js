/* eslint-disable */
const express = require('express');
const path = require('path');
const http = require('http');
const app = express();
const debug = require('debug')('event:server');
const fs = require('fs');
const bodyParser = require('body-parser');

const server = http.createServer(app);

const port = '5700';

app.set('port', port);

app.get('/start', function response(req, res) {
  // res.sendFile(path.join(__dirname, 'release/index.html'));
  // 触发shell脚本，开始打包
  // shell_run('./android-build.sh')  不要直接运行脚本 npm run build:android sit
  console.log('send start...', req.query);
  res.send('send start');
  execute(
    `yarn build:android ${req.query.env} ${req.query.version} ${req.query.versionName} ${req.query.preVersion} ${req.query.preVersionName}`,
  );
  execute(
    `npm run build:ios ${req.query.env} ${req.query.version} ${req.query.versionName} ${req.query.preVersion} ${req.query.preVersionName}`,
  );
});
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

app.post('/feedback', function response(req, res) {
  // 触发shell脚本，反馈进度
  console.log(req.body);
  res.send('接收feedback\n');
});

app.get('/feedbackEnd', function response(req, res) {
  // 日志已结束，停止node服务
  console.log('log print finish, stop node server now...');
  res.send('node服务结束');
  server.close();
});

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function execute(cmd) {
  require('child_process').exec(cmd, function (error, stdout, stderr) {
    if (error) {
      console.error(error, stderr);
    } else {
      console.log('success', stdout);
    }
  });
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  console.log('NodeServer is listening on ' + bind);
  debug('Listening on ' + bind);
}
