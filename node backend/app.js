var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cors = require('cors'); //included cors for dev
var cookieParser = require('cookie-parser');
var logger = require('morgan');

require('dotenv').config(); 

var indexRouter = require('./routes/index');
var climbsRouter = require('./routes/climbs');
var wallsRouter = require('./routes/walls');
var routesRouter = require('./routes/routes');
var spotsRouter = require('./routes/spots');
var registerRouter = require('./routes/register');
var loginRouter = require('./routes/login');

var app = express();
// Allow all origins (good for dev, not for production)
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app routes
app.use('/', indexRouter);
app.use('/climbs', climbsRouter);
app.use('/walls', wallsRouter);
app.use('/routes', routesRouter);
app.use('/spots', spotsRouter);
app.use('/register', registerRouter);
app.use('/login', loginRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;


