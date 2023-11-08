const mysql = require('mysql')

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'SixShooter241@2003',
    database : 'library_management_system'
})


module.exports = connection