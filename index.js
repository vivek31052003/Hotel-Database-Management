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
    connection.query(
        'INSERT INTO users VALUES (?,?,?,?,?)',
        [username,],
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