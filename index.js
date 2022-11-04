const express=require("express");
const mysql=require("mysql2");
const bodyparser=require("body-parser"); 
var connection=require('./database');

const app=express();

app.set('view engine','ejs');
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));

app.get("/",(req,res) => {
    res.render("index");
});

app.get("/about",(req,res) => {
    res.render("about");
});

app.get("/register",(req,res) => {
    res.render("register");
});

app.get("/contact",(req,res) => {
    res.render("contact");
});

app.get("/book",(req,res) => {
    res.render("book");
});

app.post("/register",(req,res) => {
    const username=req.body.username;
    const password=req.body.password;
    const Name=req.body.Name;
    const mail=req.body.mail;
    const number=req.body.number;

    connection.query(
        'INSERT INTO users VALUES (?,?,?,?,?)',
        [username,password,Name,mail,number],
        (err,results) => {
            if(err) {
                res.render("regerr");
            } else {
                res.redirect('/');
            }
        }          
    )
});

app.post("/contact",(req,res) => {
    const name=req.body.name;
    const mail=req.body.mail;
    const message=req.body.message;

    connection.query(
        'INSERT INTO contact VALUES (?,?,?)',
        [name,mail,message],
        console.log("inserted!!!!")
    )
    res.redirect('/');
});

var ac=100;
var nac=200;
var bid=59283748384112;

app.post("/book",(req,res) => {
    const username=req.body.username;
    const password=req.body.password; 
    const type=req.body.room;
    const cid=req.body.cid;
    const cod=req.body.cod;
    var name=req.body.Name;

    connection.query(
        'SELECT * FROM users WHERE username=(?)',
        [username],
        (err,results) => {
            if(err) {
                console.log(err);
                res.render("bookerr");             
            }
            if(results.length>0) {
                if(results[0].password==password) {                    
                    var rn;
                    if(type=='AC') {                        
                        ac++;  
                        rn=ac;                      
                    } else {
                        nac++;
                        rn=nac;
                    }
                    bid++;
                    connection.query(
                        'INSERT INTO booking VALUES (?,?,?,?,?,?)',
                        [bid,username,rn,type,cid,cod],
                    )
                    res.render("bookingconf",{Name:name,cid:cid,cod:cod,type:type,rn:rn,bid:bid});
                } else {
                    res.render("bookerr");    
                }
            } else {
                res.render("bookerr");    
            }
        }
    ) 
});

app.listen(3000,() => {
    console.log('Server on board');
    connection.connect((err) => {
        if(err) throw err;
        console.log('Database connected');
    });
});