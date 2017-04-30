/**
 * Created by bface007 on 30/04/2017.
 */
const express = require('express'),
      logger = require('morgan'),
      bodyParser = require('body-parser'),
      path = require('path'),
      debug = require('debug')('worker'),
      env = process.env;

// Init express server
const app = express();

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());
app.use(logger('dev'));

// set environment. Default : developement
app.set('env', env.NODE_ENV || 'development');
// set port. Default: 3000
app.set('port', env.NODE_PORT || 3000);
// set ip address. Default: localhost
app.set('ip', env.NODE_IP || 'localhost');

/*****************************
 * Routing
 */
let indexRoutes = require('./app/routes')(app, express);

app.use('/', indexRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      success: false,
      code: err.status,
      message: err.message
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

app.listen(app.get('port'), app.get('ip'), () => {
  debug(`Application worker ${process.pid} started...`);
  debug(`application running on port ${app.get('port')}`);
});