const express=require("express");
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

app.get("/cancel",(req,res) => {
    res.render("cancel");
});

app.get("/avl",(req,res) => {
    res.render("avl");
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

var bid;
function bookingID()  {
    var id;
    connection.query (
        'SELECT * FROM ids',
        (err,results) => {
            if(err) throw err;
            if(results.length) {
                id=results[0].bookid;
                bid=id; 
            }                               
        }
    );    
    return id;
}

var ac=100;
var nac=200;

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
        (err, results) => {
            if (err) {
                console.log(err);
                res.render("bookerr");
            }
            if (type == 'AC') {
                connection.query('SELECT * FROM booking WHERE (NOT((cid<=(?) AND cod<=(?)) OR (cid>=(?) AND cod>=(?)))) AND Type="AC"',
                    [cid, cid, cod, cod],
                    (err, resul) => {
                        if (err) { console.log(err); }
                        if (resul.length <= 2) {
                            if (results.length > 0) {
                                if (results[0].password == password) {
                                    var rn;
                                    if (type == 'AC') {
                                        ac++;
                                        rn = ac;
                                    } else {
                                        nac++;
                                        rn = nac;
                                    }
                                    console.log(bid);
                                    connection.query(
                                        'UPDATE ids SET bookid=(?) WHERE bookid=(?)',
                                        [bid + 1, bid]
                                    );
                                    connection.query(
                                        'INSERT INTO booking VALUES (?,?,?,?,?,?)',
                                        [bid, username, rn, type, cid, cod],
                                        (err, results) => {
                                            if (err) {
                                                res.render("bookerr");
                                            }
                                        }
                                    )
                                    res.render("bookingconf", { Name: name, cid: cid, cod: cod, type: type, rn: rn, bid: bid });
                                    bid++;
                                } else {
                                    res.render("bookerr");
                                }
                            } else {
                                res.render("bookerr");
                            }
                        }
                        else {
                            console.log("");
                            res.render("bookerr1");
                        }
                    })
            } else {
                connection.query('SELECT * FROM booking WHERE (NOT((cid<=(?) AND cod<=(?)) OR (cid>=(?) AND cod>=(?)))) AND Type="non-AC"',
                    [cid, cid, cod, cod], (err, resul) => {
                    if (err) { console.log(err); }
                    if (resul.length <= 2) {
                        if (results.length > 0) {
                            if (results[0].password == password) {
                                var rn;
                                if (type == 'AC') {
                                    ac++;
                                    rn = ac;
                                } else {
                                    nac++;
                                    rn = nac;
                                }
                                console.log(bid);
                                connection.query(
                                    'UPDATE ids SET bookid=(?) WHERE bookid=(?)',
                                    [bid + 1, bid]
                                );
                                connection.query(
                                    'INSERT INTO booking VALUES (?,?,?,?,?,?)',
                                    [bid, username, rn, type, cid, cod],
                                    (err, results) => {
                                        if (err) {
                                            res.render("bookerr");
                                        }
                                    }
                                )
                                res.render("bookingconf", { Name: name, cid: cid, cod: cod, type: type, rn: rn, bid: bid });
                                bid++;
                            } else {
                                res.render("bookerr");
                            }
                        } else {
                            res.render("bookerr");
                        }
                    }
                    else {
                        console.log("done");
                        res.render("bookerr1");
                    }
                })
            }

        }
    )
});

app.post("/cancel",(req,res) => {
    const bookingid=req.body.bookingid; 
    const password=req.body.password;  
    connection.query(
        'SELECT username FROM booking WHERE bookingID=(?)',
        [bookingid],
        (err,results) => {
            if(err) throw err;
            var un=results[0].username;                        
            connection.query(
                'SELECT password FROM users where username=(?)',
                un,
                (err,results) => {
                    if(err) throw err;
                    var pwd=results[0].password;                    
                    if(password==pwd) {
                        connection.query(
                            'DELETE FROM booking WHERE bookingID=(?)',
                            bookingid,
                            res.redirect("/")
                        )
                    }
                }
            )
        }
    ) 
});

app.post("/avl",(req,res) => {
    const type=req.body.room;
    const cid=req.body.cid;
    const cod=req.body.cod;

    if(type=='AC') {
        connection.query(        
            'SELECT * FROM booking WHERE (NOT((cid<=(?) AND cod<=(?)) OR (cid>=(?) AND cod>=(?)))) AND Type="AC"',
            [cid,cid,cod,cod],
            (err,results) => {
                if(err) {
                    console.log(err);
                } else {
                    res.render("avlres",{rooms:3-results.length});
                }
            }
        )
    } else {
        connection.query(        
            'SELECT * FROM booking WHERE (NOT((cid<=(?) AND cod<=(?)) OR (cid>=(?) AND cod>=(?)))) AND Type="non-AC"',
            [cid,cid,cod,cod],
            (err,results) => {
                if(err) {
                    console.log(err);
                } else {
                    res.render("avlres",{rooms:3-results.length});
                }
            }
        )
    }
});

app.listen(3000,() => {
    var lol=bookingID();
    console.log('Server on board');    
    connection.connect((err) => {
        if(err) throw err;
        console.log('Database connected');
    });
});