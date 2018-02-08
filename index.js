const path    = require('path')
const express = require('express')
// const stylus  = require('stylus')
const mysql   = require('mysql');
const bodyParser = require('body-parser')
const app     = express()
const server = require('http').Server(app);
const io = require('socket.io')(server);
const session = require('express-session');
const sharedSession = require('express-socket.io-session');
const bcrypt = require('bcrypt-nodejs');


const sessionObj = session({
                             secret : 'nadege',
                             cookie : { maxAge: 1000000 }, // 10 min
                             resave : false,
                             saveUninitialized : false
                          })
const sharedSessionObj = sharedSession(sessionObj, { autoSave : true })
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
// app.use(stylus.middleware({
//     src  : path.resolve('static/styles'), // Les fichiers .styl se trouvent dans `static/styles`
//     dest : path.resolve('static/styles') // Les fichiers .styl sont également compilés en CSS dans `static/styles`
// }))
app.use(express.static(path.resolve('static')))
app.use('/nodemod', express.static(__dirname + '/node_modules/'));

var connection  = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'nadege'
});
var projectList = {};
connection.connect();
connection.query('SELECT * FROM projet ORDER BY id ASC', function (error, results, fields) {
  if (error) throw error;
  for (var i = results.length - 1; i >= 0; i--) {
    projectList[i] = results[i];
  }

app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
   res.render('master')
});
  io.on('connection', socket => {

    // Envoi à ce client de ses informations, pour que le JS côté client puisse les exploiter dans le HTML
    socket.emit('onProjectList', projectList);
    socket.on('logAdmin', function(data){
      connection.query('SELECT * FROM admin WHERE username = ?',[data.username],function(error, results, fields){
        if(error){
          socket.emit('failedLog');
        }
        if(results[0] == undefined){
          socket.emit('failedLog');
        }else if(bcrypt.compareSync(data.password, results[0]['password']) && data.username == results[0]['username']){
          socket.emit('successLog');
        }else{
          socket.emit('failedLog');
        }
      })
    })
    socket.on('addProject', function (data) { 
      connection.query('INSERT INTO projet SET title = ?, text = ?, type = ?, tag = ?, customerType = ?, customer = ?, date = ?, thumb = ?, image = ?',[data.title,data.text,data.type,data.tag,data.customerType,data.customer,data.date,data.thumb,data.image], function (error, results, fields) {
        if (error) throw error;
        connection.query('SELECT * FROM projet', function (error, results, fields) {
          if (error) throw error
          var projectList = {};
          for (var i = results.length - 1; i >= 0; i--) {
            projectList[i] = results[i];
          }
          socket.emit('projectAdded', projectList);
        });
      });

    });
    socket.on('deleteProject', function (data) { 
      connection.query('DELETE from projet WHERE id = ?',[data], function (error, results, fields) {
        if (error) throw error;
        console.log(data)
        connection.query('SELECT * FROM projet WHERE id > ? ORDER BY id ASC',[data], function(error, res, fields){
          console.log(res)
          for (var i = 0; i < res.length; i++) {
            console.log(res[i].id-1,res[i].id)
            connection.query('UPDATE projet SET id = ? WHERE id = ?',[res[i].id-1,res[i].id]);

          }
        });
        connection.query('SELECT * FROM projet ORDER BY id ASC', function (error, response, fields) {
            if (error) throw error
            console.log(response)
            var projectList = {};
            for (var i = response.length - 1; i >= 0; i--) {
              projectList[i] = response[i];
            }
            socket.emit('projectDeleted', projectList);
        });
      });

    });
    socket.on('modifProject',function(data){
      connection.query('UPDATE projet SET title = ?, text = ?, type = ?, tag = ?, customerType = ?, customer = ?, date = ?, thumb = ?, image = ? WHERE id = ?',[data.title,data.text,data.type,data.tag,data.customerType,data.customer,data.date,data.thumb,data.image,data.id], function (error, results, fields) {
          if (error) throw error
          console.log('modified !')
      });
      connection.query('SELECT * FROM projet', function (error, results, fields) {
      var projectList = {};
       for (var i = results.length - 1; i >= 0; i--) {
         projectList[i] = results[i];
       }
       socket.emit('projectModified', projectList);
      });
    })
});

});

/**
 * App start
 */
server.listen(app.get('port'), () => console.log(`App listen on port ${app.get('port')}`))