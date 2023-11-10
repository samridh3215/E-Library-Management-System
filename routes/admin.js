const express = require('express')
let ejs = require('ejs')
const router = express.Router()
var mysql = require('mysql')
const returnTable = require('../utils/returnTable')
const fs = require('fs')
const path=require('path')

const connection = require('../sql-connection')
const { result } = require('lodash')
const writeFileToLocal = require('../utils/writeFile')

const adminNav = [
    {"/admin/addbook":"Add Book"},
    {"/admin/logs":"View Logs"},
    {"/admin/manageRequest":"Manage Requests"},
    {"/admin/viewBalance":"View Balance"},
    {"/admin/addPaper":"Add Paper"},
]


router.post('/createUser', (req, res)=>{})

router.post('/addBook', (req, res)=>{
    let q = `INSERT INTO book (isbn, title, author, edition, quantity, subject) values ('${req.body.isbn}','${req.body.title}','${req.body.author}','${req.body.edition}','${req.body.quantity}','${req.body.subject}')`
    try{
    connection.query(q, (err, results, fields)=>{
        console.log({q:q, "result":results, "error":err})
        res.status(200).send("SUCCESS")
    })
    }catch{
        res.status(500).send("ERROR")
    }   
})

router.get('/', (req, res)=>{
    res.render('admin/adminMenu', {})
})

router.get('/logs', (req, res)=>{
    let q = 'SELECT * FROM visiting_log;'
    connection.query(q, (err, results, fields)=>{
        res.render('admin/visitingLog',{"data": results, "returnTable":returnTable})
    })
})

router.get('/addBook', (req, res)=>{
    connection.query('select * from book', (err, result, fields)=>{
        if(err)
            res.send(err.sqlMessage)
        else
            res.render('admin/addBook', {data:returnTable(['isbn', 'title', 'author', 'edition' ,'subject'], result, checkBbox=false, extraFields=false, boolHeader=[])})
            
    })
})

router.get('/manageRequest', (req, res)=>{
    let q = 'SELECT * from borrow_request'
    connection.query(q, (err, result1, fields)=>{
        connection.query('select request_id, date_of_approval,ADDDATE(date_of_approval, duration) as deadline, student_srn  from borrow_request where NOW() > ADDDATE(date_of_approval, duration) ;', (err, result2, fields)=>{
            if(err){
                res.send(err.sqlMessage)
            }
            else{
                res.render('admin/manageRequest',{"data": result1, newData: result2, "returnTable":returnTable})
            }
        })
    })
})

router.post('/manageRequest', (req, res)=>{
    let returnValue = req.body.returned
    let approveValue = req.body.approved
    let q = `SELECT * from borrow_request where returned=${returnValue} and approved=${approveValue};`
    connection.query(q, (err, results, fields)=>{
        res.send({"data": returnTable(['request_id', 'date_of_request', 'duration', 'date_of_approval', 'student_srn', 'approved_by', 'book_isbn'], results, checkBbox=true, extraFields=false, boolHeader=['approved', 'returned'])})
    })
})

router.post('/updateRequest', (req, res) => {
    const data = req.body.data;
    const userInfo = JSON.parse(req.body['userInfo']);

    const updateQueries = [];
    const date = new Date(); 

    data.forEach(entry => {
        let updateQuery = `UPDATE borrow_request SET `;
        let updateBookQuantity = false;

        if (entry['approved'] == 1) {
            updateQuery += `approved = ${entry['approved']}, returned = ${entry['returned']}, date_of_approval = NOW(), approved_by = '${userInfo['ID']}' `;
        }
        else{
            updateQuery += `approved = ${entry['approved']}, returned = ${entry['returned']}, date_of_approval = null, approved_by = null `;
        }
        if (entry['returned'] == 1) {
            updateBookQuantity = true; 
        }

        if (updateBookQuantity) {
            connection.query(`UPDATE book SET quantity = quantity + 1 WHERE isbn = '${entry['book_isbn']}'`, (err, result) => {
                console.log(result)
                if (err) {
                    res.send(err.sqlMessage);
                }
            });
        }

        updateQueries.push(updateQuery + `WHERE request_id = ${entry['req_id']}`);
    });

    const allQueries = updateQueries.join(';');
    connection.query(allQueries, (err, results) => {
        console.log(allQueries)
        if (err) {
            res.send(err.sqlMessage);
        } else {
            res.send('SUCCESS');
        }
    });
});

router.get('/viewBalance', (req, res)=>{
    let q = `select  student_srn as srn, sum(amount) as due from balance group by srn;`
    connection.query(q, (err, result, fields)=>{
        console.log(result)
        if(err)
            res.send(err.sqlMessage)
        else
            res.render('admin/viewBalance', {data: returnTable(['srn', 'due'], result, false, [], [])})
    })
})

router.get('/addPaper', (req, res)=>{
    let q = `select * from research_paper;`
    connection.query(q, (err, result, fields)=>{
        if(err)
            res.send(err.sqlMessage)
        else
            res.render('admin/addPaper', {data: returnTable(['paper_id', 'name', 'author', 'upload_date', 'uploaded_by'], result, false, [], [])})
    })
})

router.post('/addPapers', (req, res)=>{
    console.log(req.body)
    let name = req.body.data.name
    let author = req.body.data.author
    let dataURL = req.body.data['dataURL']
    let user = JSON.parse(req.body['userInfo'])
    let q = `INSERT INTO research_paper (name, author, upload_date, uploaded_by) values ('${name}', '${author}', NOW(), '${user['ID']}')`
        connection.query(q, (err, result, fields)=>{
            console.log(err, result)
            if(err){
                res.send(err.sqlMessage)
            }
            else{
                writeFileToLocal('research', result['insertId'], dataURL)
                res.send("SUCCESS")
            }
    
        })

    });



router.get('/addAccount', (req, res)=>{})

module.exports = router