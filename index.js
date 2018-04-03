const express = require('express')
const app = express()
const bodyParser = require('body-parser');
var urlRouter = require('./router.js')

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.listen(80, () => console.log('Url-shortener started!'))

app.use('/', urlRouter)