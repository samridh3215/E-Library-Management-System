const express = require('express')
const router = express.Router()
var mysql = require('mysql')

const connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'SixShooter241@2003',
    database : 'library_management_system'
})

router.post('/', (req, res)=>{
    let email = req.body.email
    let password = req.body.password
    connection.query(`SELECT * FROM auth where email = '${email}'`, (err, result, field)=>{
        if (result[0].type == 1){
            q = `SELECT staff.satff_id as ID, staff.email, auth.password, auth.type from staff inner join auth on staff.email = auth.email`;
        }
        else{
            q = `SELECT student.srn as ID, student.email, auth.password, auth.type from student inner join auth on student.email = auth.email`;
        }
        console.log(q)
    })
    
})

module.exports = router