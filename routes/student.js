const express = require('express')
let ejs = require('ejs')
const router = express.Router()
var mysql = require('mysql')
const returnTable = require('../utils/returnTable')
const connection = require('../sql-connection')
const { rest, result } = require('lodash')

const pricePerWeek = 30;

router.get('/', (req, res)=>{
    res.render('student/studentMenu')
})

router.get('/dueAmount', (req, res)=>{
    let q = `SELECT * FROM borrow_request where  student_srn='${user['ID']}';`
    connection.query(q, (err1, result1, field)=>{
        if(!err1){
            connection.query(`select sum(amount) as due from balance where student_srn = '${user['ID']}'`, (err2, result2, field)=>{
                if(!err2){
                    console.log(result2)
                    res.render('student/dueAmount', {amount:result2, history:returnTable(['request_id', 'date_of_request', 'duration', 'book_isbn'], result1, true, [], ['approved', 'returned'])})
                }
                else{
                    res.send(err2.sqlMessage)
                }
            })
        }
        else{
            res.send(err1.sqlMessage)
        }
    })
})

router.get('/borrowBook', (req, res)=>{
    q = 'SELECT * FROM book where quantity>0;'
    connection.query(q, (err, result, field)=>{
        res.render('student/borrowBook',{data:result, "returnTable":returnTable})
    })
})

router.get('/resourcePage', (req, res)=>{
    q = 'SELECT * from resource;'
    connection.query(q, (err, result, field)=>{
        res.render('student/resourcePage',{data:result})
    })
})

router.post('/updateBorrow', (req, res) => {
    const data = req.body.data;
    const user = JSON.parse(req.body['userInfo'])
    const keys = Object.keys(data);
    keys.forEach(key => {
        if (data[key] >= 1) {
            const values = `(NOW(), ${data[key]}, '${key}', '${user['ID']}')`;
            const q = `INSERT INTO borrow_request (date_of_request, duration, book_isbn, student_srn) values ${values}`;
            const updateBook = `UPDATE book set quantity = quantity-1 where isbn = '${key}'`;
            const balanceAmount = Math.ceil(data[key] / 7) * pricePerWeek;
            const balanceQuery = `INSERT INTO balance (amount, student_srn) VALUES (${balanceAmount}, '${user['ID']}') ON DUPLICATE KEY UPDATE amount = ${balanceAmount}`;
            connection.query(updateBook, (bookErr, bookResult) => {
                if (!bookErr) {
                    connection.query(q, (borrowErr, borrowResult) => {
                        if (!borrowErr) {
                            connection.query(balanceQuery, (balanceErr, balanceResult) => {
                                if (balanceErr) {
                                    res.send(balanceErr.sqlMessage);
                                } else {
                                    res.send('SUCCESS');
                                }
                            });
                        } else {
                            res.send(borrowErr.sqlMessage);
                        }
                    });
                } else {
                    res.send(bookErr.sqlMessage);
                }
            });
        }
    });
});






module.exports = router