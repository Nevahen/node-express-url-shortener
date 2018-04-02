

const sqlite = require('sqlite3')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const randomid = require('./randomid');
const validUrl = require('valid-url');
const path = require('path')

var options = {
    PORT: 80,
    SHORTID_LENGTH: 6
}

db = new sqlite.Database('database.sqlite', () =>{
    db.exec(`
    CREATE TABLE IF NOT EXISTS links (
        id integer PRIMARY KEY,
        key text NOT NULL UNIQUE,
        target text NOT NULL,
        creator text,
        time text
    );
    CREATE UNIQUE INDEX IF NOT EXISTS key ON links('key');
    `,(err)=>{
        if(err){
            console.log(err);
        }
    })
})

app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(express.static('static'))
app.listen(options.PORT, () => console.log('Url-shortener started!'))

app.get('/notfound', (req, res) => {
    res.status(404).sendFile(path.join(__dirname+'/static/notfound.html'));
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

app.post('/', async (req, res) =>{
    
    // Checks

    if(!req.body.key){
        let payload = {
            error: "No URL provided"
        }
        res.status(400).json(payload)
        return;
    }

    if(!validUrl.isWebUri(req.body.key)){
        let payload = {error:"That wasn't a valid URL"}
        res.status(400).json(payload).end()
        return
    }

    id = await createRecord(req.body.key,req.ip)
    
    if(id === undefined){
        res.status(500).json({error:"Unexpected error"})
        return
    }

    // Sending created shortid

    let payload = {
        shortid: id
    }

    res.json(payload);
})

async function createRecord(target,ip){
    key = randomid.randomId(options.SHORTID_LENGTH)
    exists = await checkExists(key)

    if(exists){
        return undefined
    }

       linkObject = {
        $target: target,
        $key: key,
        $time: new Date(),
        $creator: ip || null
    }

    db.run('INSERT into links (target,key,time,creator) VALUES ($target,$key,$time,$creator);', linkObject, (err) => {
        if(err){
            console.log(err)
        }
    })
    return linkObject.$key
}


function checkExists(key){

    return new Promise((resolve, reject) => {
        a = db.get('SELECT * from links where key = ?', key, (err,row) => {
            if(err){
            }

            if(row === undefined){
                resolve(false)
            }
            else {
                resolve(true);
            }
        })
    })
}

app.use((req, res)=>{
    res.redirect('/notfound');
})