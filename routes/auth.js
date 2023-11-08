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
    let q = ''
    try{
    connection.query(`SELECT * FROM auth where email = '${email}'`, (err, result, field)=>{
        if (result[0].type == 1){
            q = `SELECT staff.staff_id as ID, staff.email as email, auth.password as password, auth.type as type from staff inner join auth on staff.email = auth.email where auth.email='${email}';`;
        }
        else{
            q = `SELECT student.srn as ID, student.email as email, auth.password as password, auth.type as type from student inner join auth on student.email = auth.email where auth.email='${email}';`;
        }
    console.log(email, q)

        connection.query(q, (err, result, fields)=>{
            if(err)
                res.send(err.sqlMessage)
            else
                try{
                    let data = result[0]
                    console.log(data)
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


    }catch{
        res.send("INVALID EMAIL")
    }
})


module.exports = router