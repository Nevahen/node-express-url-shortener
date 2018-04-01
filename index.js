

const sqlite = require('sqlite3')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const randomid = require('./randomid');


db = new sqlite.Database('database.sqlite', () =>{
    db.exec(`
    CREATE TABLE IF NOT EXISTS links (
        id integer PRIMARY KEY,
        key text NOT NULL UNIQUE,
        target text NOT NULL,
        creator text,
        time text
    );
    CREATE UNIQUE INDEX IF NOT EXISTS key ON links(key);
    `,(err)=>{
        if(err){
            console.log(err);
        }
    })
})

// Settings //

const GUID_LENGTH = 8;
const APP_PORT    = 3000;

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static('static'))
app.listen(3000, () => console.log('Url-shortener started at port 3000!'))

app.get('/notfound', (req, res) => {
    res.status(404).send("Not found");
})

app.get('/:id', (req, res)=> {
    const id = req.params.id;
    db.get("SELECT * from links WHERE key = ?", id,function(err,row){
        if(err){
            console.log(err)
        }

        if(row === undefined){
            res.redirect('/notfound');
        }
        else{
            res.redirect(row.target)
        }
    })

})

app.post('/', (req, res) =>{

    if(req.body.key === "1"){
        let payload = {error:"That wasn't a valid URL"}
        res.status(400).json(payload).end()
        return
    }

    let payload = {
        shortid: randomid.randomId(7)
    }
    res.json(payload);
})


app.use((req, res)=>{
    res.redirect('/notfound');
})