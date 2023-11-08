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
    
    
})

module.exports = router