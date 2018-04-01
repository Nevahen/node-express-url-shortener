

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
    CREATE UNIQUE INDEX IF NOT EXISTS key ON links('key');
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
    console.log(id)
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

    console.log(req.body.key)

    if(req.body.key === "1"){
        let payload = {error:"That wasn't a valid URL"}
        res.status(400).json(payload).end()
        return
    }

    id = await createRecord(req.body.key,req.ip)
    


    let payload = {
        shortid: id
    }
    res.json(payload);
})

async function createRecord(target,ip){
    key = randomid.randomId(7)
    exists = await checkExists(key)
    if(exists){
        throw Error("Key already exists!");
    }

       linkObject = {
        $target: target,
        $key: key,
        $time: new Date(),
        $creator: ip || null
    }

    console.log(linkObject)

    db.run('INSERT into links (target,key,time,creator) VALUES ($target,$key,$time,$creator);', linkObject, (err)=>{
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