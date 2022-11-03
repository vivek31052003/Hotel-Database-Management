const express=require("express");
const mysql=require("mysql2");
const bodyparser=require("body-parser"); 
var connection = require('./database');

const app=express();

app.set('view engine','ejs');
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:true}));

app.get("/",(req,res) => {
    res.render('index');
});

app.get("/about",(req,res) => {
    res.render('about');
});

app.get("/register",(req,res) => {
    res.render("register");
});

app.get("/contact",(req,res) => {
    res.render("contact");
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
        console.log("inserted!!!!")
    )
    res.redirect('/');
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

app.listen(3000,() => {
    console.log('Server on board');
    connection.connect((err) => {
        if(err) throw err;
        console.log('Database connected');
    });
})