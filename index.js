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
const md5 = require('md5');
// const passport = require('passport');
// var twitterStrategy = require('passport-twitter').Strategy;

const sessionObj = session({
                             secret : 'node meow',
                             cookie : { maxAge: 500000 }, // 5 min
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
connection.query('SELECT * FROM projet', function (error, results, fields) {
  if (error) throw error;
  for (var i = results.length - 1; i >= 0; i--) {
    projectList[i] = results[i];
  }
/*var projectList = {
  "1": {
    "id": 1,
    "thumb": "assets/alice.png",
    "image": "assets/presentation hodeoz.jpg",
    "title": "Boite à gateaux",
    "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus a libero eu libero varius faucibus. In magna metus, iaculis quis felis suscipit, congue fringilla eros. Fusce elit metus, maximus ac ultrices mattis, pellentesque in metus. Duis mi massa, varius et euismod eget, placerat et risus. Mauris mollis nibh eget lorem viverra, sed pellentesque sem vulputate. Curabitur condimentum finibus molestie. Morbi efficitur imperdiet sagittis. Donec vitae risus non tellus rutrum pretium ut at libero.",
    "type": "web,logo",
    "libeller": "Projet scolaire",
    "clientType" : "Client fictif",
    "client" : "Chabrior",
    "date" : "2015"

  },
  "2": {
    "id": 2,
    "thumb": "assets/frozen.jpg",
    "image": "assets/frozen.jpg",
    "title": "Frozen1",
    "text": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus a libero eu libero varius faucibus. In magna metus, iaculis quis felis suscipit, congue fringilla eros.",
    "type": "web,logo",
    "libeller": "Projet d'école",
    "date" : "2015,2016"
  },
  "3": {
    "id": 3,
    "thumb": "assets/insideout.jpg",
    "image": "assets/insideout.jpg",
    "title": "Insideout",
    "text": "film qui parle d'une enfant skizofrene",
    "type": "print",
    "libeller": "Projet d'école"
  },
  "4": {
    "id": 4,
    "thumb": "assets/vaiana.jpg",
    "image": "assets/vaiana.jpg",
    "title": "Vaiana",
    "text": "film qui parle d'une fille qui part sur un bateau",
    "type": "print",
    "libeller": "Projet d'école"
  },
  "5": {
    "id": 5,
    "thumb": "assets/walee.jpg",
    "image": "assets/walee.jpg",
    "title": "Walee",
    "text": "film qui parle d'un robot trop mignon",
    "type": "logo",
    "libeller": "Projet d'école"
  },
  "6": {
    "id": 6,
    "thumb": "assets/zootopia.jpg",
    "image": "assets/zootopia.jpg",
    "title": "Zootopia",
    "text": "film qui parle d'animaux",
    "type": "logo",
    "libeller": "Projet d'école"
  },
  "7": {
    "id": 7,
    "thumb": "assets/alice.png",
    "image": "assets/alice.png",
    "title": "Alice",
    "text": "film qui parle d'une fille sous drogue",
    "type": "web",
    "libeller": "Projet d'école"
  },
  "8": {
    "id": 8,
    "thumb": "assets/frozen.jpg",
    "image": "assets/frozen.jpg",
    "title": "Frozen",
    "text": "film qui parle de la reine des neiges",
    "type": "web",
    "libeller": "Projet d'école"
  },
  "9": {
    "id": 9,
    "thumb": "assets/insideout.jpg",
    "image": "assets/insideout.jpg",
    "title": "Insideout",
    "text": "film qui parle d'une enfant skizofrene",
    "type": "print",
    "libeller": "Projet d'école"
  },
  "10": {
    "id": 10,
    "thumb": "assets/vaiana.jpg",
    "image": "assets/vaiana.jpg",
    "title": "Vaiana",
    "text": "film qui parle d'une fille qui part sur un bateau",
    "type": "print",
    "libeller": "Projet d'école"
  }
}*/

app.all('/*', function(req, res, next) {
    // Just send the index.html for other files to support HTML5Mode
   res.render('master')
});
  io.on('connection', socket => {
    // Envoi à ce client de ses informations, pour que le JS côté client puisse les exploiter dans le HTML
    socket.emit('onProjectList', projectList);
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
        connection.query('SELECT * FROM projet', function (error, results, fields) {
          if (error) throw error
          var projectList = {};
          for (var i = results.length - 1; i >= 0; i--) {
            projectList[i] = results[i];
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