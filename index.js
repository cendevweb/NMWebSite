const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const server = require('http').Server(app);
const io = require('socket.io')(server);
const session = require('express-session');
const sharedSession = require('express-socket.io-session');
const model = require('./model');


const sessionObj = session({
  secret: 'nadege',
  cookie: { maxAge: 1000000 }, // 10 min
  resave: false,
  saveUninitialized: false
})
const sharedSessionObj = sharedSession(sessionObj, { autoSave: true })
/**
 * App configuration
 */

app.set('view engine', 'pug')
app.set('views', path.resolve('views'))
app.set('port', 3000)

/**
 * App middlewares
 */

app.use(sessionObj)
io.use(sharedSessionObj)
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(path.resolve('static')))
app.use('/nodemod', express.static(__dirname + '/node_modules/'));
app.use('/style', express.static(__dirname + '/static/style/'));

model.selectAll().then(function(projectList){
  app.all('/*', function (req, res, next) {
    res.render('master')
  });
  io.on('connection', socket => {

    socket.emit('onProjectList', projectList);
    socket.on('logAdmin', function (data) {
      model.logAdmin(data,socket);
    })
    socket.on('addProject', function (data) {
      model.addProject(data,socket)
    });
    socket.on('deleteProject', function (data) {
      model.deleteProject(data,socket).then(function(result){
        console.log(result)
        return model.updateAllUpperFromId(data)
      }).then(function(result){
        console.log(result)
        return model.selectAll()
      }).then(function(projectList){
        console.log(projectList)
        socket.emit('projectDeleted', projectList);
      })

    });
    socket.on('modifProject', function (data) {
      model.modifProject(data).then(function(result){
        return model.selectAll()
      }).then(function(projectList){
        socket.emit('projectModified', projectList);
      })
    })
  });

});

/**
 * App start
 */
server.listen(app.get('port'), () => console.log(`App listen on port ${app.get('port')}`))