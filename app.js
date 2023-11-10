const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const app = express()
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs');

app.use('/admin', require('./routes/admin'))
app.use('/test', require('./routes/test'))
app.use('/student', require('./routes/student'))
app.use('/auth', require('./routes/auth'))
app.get('/', (req, res)=>{
  res.redirect('/auth/login')
})
app.use('/student', express.static('static'))
app.use('/admin', express.static('static'))
app.use('/auth', express.static('static'))
app.use('/', express.static('static'))
app.use(bodyParser.text({ limit: '200mb' }));
app.use(bodyParser.json({limit: '200mb'}));
app.use(bodyParser.urlencoded({limit: '200mb', extended: true}));

const host = '0.0.0.0'
const port = 3001
app.listen(port, host, function() {
  console.log("Server listening on", port);
});

