const express = require('express')
const router = express.Router()
const mysql = require('mysql')
const bcrypt = require('bcrypt')
const connection = require('../sql-connection')
const { render } = require('ejs')

router.post('/signup', (req, res)=>{
    let email = req.body.email
    let password = req.body.password
    let type = 0
    password = bcrypt.hashSync(password, 10);
    let queryResult = connection.query(`INSERT INTO auth values ('${email}', ${type}, '${password}')`, (err, result, fields)=>{
        if(err)
            res.send(err.sqlMessage)
        else
            res.send("Registered successfully")
    })
})

router.get('/login', (req, res)=>{
    res.render('login')
})

router.post('/login', (req, res)=>{
    let email = req.body.email
    let password = req.body.password
    let queryResult = connection.query(`SELECT * FROM auth WHERE email LIKE '${email}'`, (err, result, fields)=>{
        if(err)
            res.send(err.sqlMessage)
        else
            try{
                let data = result[0]
                if(bcrypt.compareSync(password, data.password)){
                    if(parseInt(data.type) == 1)
                        res.send({"redirect":"/admin/", "userData":data})
                    else
                        res.send({"redirect":"/student/", "userData":data})
                }
                else{
                    res.send("Wrong credentials")
                }
            }catch{
                res.send("SOMETHING WENT WRONG")
            }

    })
})


module.exports = router