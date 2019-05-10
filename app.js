var createError = require('http-errors');
var express = require('express');
var session = require('express-session');
var path = require('path');

/*//express multi stuff
var expressHandlebarsMulti = require('express-handlebars-multi')
var engine = expressHandlebarsMulti({
  defaultLayout: 'layout',
  ext: '.hbs',
  helpers: {},
  layoutDirs: [path.join(__dirname, 'hbs/layouts')],
  partialDirs: [path.join(__dirname, 'hbs/partials')],
});

*/

var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require("body-parser");


var app = express();

//use session to keep user trace

app.use(session({
  secret: 'my little secret',
  saveUninitialized: false,
  resave: false
}));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


//complicated hbs stuff
/*
var hbs = require('express-handlebars');
app.engine( 'hbs', hbs( {
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/hbs/layouts/',
  partialsDir: __dirname + '/hbs/partials/'
} ) );

app.set('views', path.join(__dirname, '/hbs/views'));
app.set( 'view engine', 'hbs' );
*/

// all the routers we need to manage use trafic
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var projectRouter = require('./routes/project');
var taskRouter = require('./routes/task');
var exportRouteur = require('./routes/export');


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/project', projectRouter);
app.use('/task', taskRouter);
app.use('/export',exportRouteur);




// connecting to our db served by mongoDB
var mongoDB = 'mongodb://localhost/calendme';
mongoose.connect(mongoDB, { useNewUrlParser: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


// view engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


/*
app.engine('.hbs', engine);
app.set('view engine', '.hbs');
app.set('views', [path.join(__dirname, 'hbs/views')]);

// enable caching -- enabled by default when NODE_ENV === 'production'
app.enable('view cache');
*/

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


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
