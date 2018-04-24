const mysql = require('mysql');
const bcrypt = require('bcrypt-nodejs');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nadege'
});
connection.connect();
exports.logAdmin = function (data, socket) {
    connection.query('SELECT * FROM admin WHERE username = ?', [data.username], function (error, results, fields) {
        if (error) {
            socket.emit('failedLog');
        }
        if (results[0] == undefined) {
            socket.emit('failedLog');
        } else if (bcrypt.compareSync(data.password, results[0]['password']) && data.username == results[0]['username']) {
            socket.emit('successLog');
        } else {
            socket.emit('failedLog');
        }
    })
}
exports.addProject = function (data, socket) {
    connection.query('INSERT INTO projet SET title = ?, text = ?, type = ?, tag = ?, customerType = ?, customer = ?, date = ?, thumb = ?, image = ?', [data.title, data.text, data.type, data.tag, data.customerType, data.customer, data.date, data.thumb, data.image], function (error, results, fields) {
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
}
exports.deleteProject = function (data, socket) {
    return new Promise(function (resolve, reject) {
        connection.query('DELETE from projet WHERE id = ?', [data], function (error, results, fields) {
                if (error) {
                    reject(error);
                } else {
                    resolve('project deleted !');
                }
        })
    });
}
exports.selectAll = function () {
    return new Promise(function (resolve, reject) {
        connection.query('SELECT * FROM projet ORDER BY id ASC', function (error, results, fields) {
            if (error) {
                reject(error);
            } else {
                var projectList = {};
                for (var i = results.length - 1; i >= 0; i--) {
                    projectList[i] = results[i];
                }
                resolve(projectList);
            }
        })

    });
}
exports.updateAllUpperFromId = function (data) {
    
    return new Promise(function (resolve, reject) {
        connection.query('SELECT * FROM projet WHERE id > ? ORDER BY id ASC', [data], function (error, results, fields) {
                if (error) {
                    reject(error);
                } else {
                    for (var i = 0; i < results.length; i++) {
                        connection.query('UPDATE projet SET id = ? WHERE id = ?', [results[i].id - 1, results[i].id]);
                    }
                    resolve("database updated !");
                }
        })
    });
}
exports.modifProject = function (data) {
    return new Promise(function (resolve, reject) {
        connection.query('UPDATE projet SET title = ?, text = ?, type = ?, tag = ?, customerType = ?, customer = ?, date = ?, thumb = ?, image = ? WHERE id = ?', [data.title, data.text, data.type, data.tag, data.customerType, data.customer, data.date, data.thumb, data.image, data.id], function (error, results, fields) {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    })

}