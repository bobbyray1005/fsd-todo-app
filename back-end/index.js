import express from 'express'
import http from 'http'
import bodyParser from 'body-parser';
import sqlite3 from 'sqlite3';

const router = express();
const sqlite = sqlite3.verbose();
const db = new sqlite.Database(":memory:");

router.use(bodyParser.json());

router.get("/get",(req, res, next)=> {
    console.log("get request")
    db.all("SELECT * FROM todo",(err,rows)=>{
        res.json({todoItems : rows});
    })
})

router.post("/add", (req, res, next) => {
    console.log("post request");
    const item = req.body.item;
    db.get("SELECT max(id) mn FROM todo", (err,row)=>{
        let id = 1;
        if(row.mn) {
            id = (parseInt(row.mn)||0)+1;
        }
        db.run("INSERT INTO todo VALUES (" + id + ",'" + item + "')")
        db.all("SELECT * FROM todo",(err,rows)=>{
            res.json({todoItems : rows});
        })
    })
});

router.delete("/delete/:id", (req,res, next)=>{
    console.log("delete request");
    const id = req.params.id;
    db.run("DELETE FROM todo WHERE id = " + id);
    db.all("SELECT * FROM todo",(err,rows)=>{
        res.json({todoItems : rows});
    })
})

router.post("/update", (req, res, next)=> {
    const id = req.body.id;
    const item = req.body.item;
    db.run("UPDATE todo SET item = '"+item+"' WHERE id = "+id);
    db.all("SELECT * FROM todo",(err,rows)=>{
        res.json({todoItems : rows});
    })
})

router.use(express.static(process.cwd() + "/public"));

http.createServer(router).listen(3000, ()=> {
    db.run("CREATE TABLE todo ( id number primary key, item varchar(40) )")
    console.log("server running")
})