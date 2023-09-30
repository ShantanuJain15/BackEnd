const express = require('express');
const path = require('path');
const app = express();
const User = require('./models/User');
const bcrypt = require('bcryptjs');
const mongoose = require("mongoose");

// see what is function of it;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static('./views'));


mongoose
    .connect(
        "mongodb://localhost:27017/local",
        { useNewUrlParser: true, useUnifiedTopology: true , family: 4}
    )
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));

app.set('views', path.join(__dirname, 'views'));
// app.set('views', './views') //this is not working



app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './views/index.html'));
});

app.get('/registration', (req, res) => {

    res.sendFile(path.join(__dirname, './views/registration.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, './views/login.html'));
});


app.post('/registration', async (req, res) => {
    // console.log("ss");
    try {
        let { name, email, password } = req.body;
        console.log(name);
        // email = "ss2@example.com";
        // password = "fgfghf"
        let errors = [];
        User.findOne({ email: email }).then(user => {
            if (user) {
                // errors.push({ msg: 'Email already exists' });
                // res.sendFile(path.join(__dirname, './views/registration.html'));
                    res.send('Email already exists');
                } else {
                const newUser = new User({
                    name : name,
                   email : email,
                    password :password
                });
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                      if (err) throw err;
                      newUser.password = hash;
                      newUser
                        .save() .then(user => {
                           
                            res.redirect('/login');
                          })
                          .catch(err => console.log(err));
                    });
                });


            }
        });

    } catch(err) {
        res.send(err.message);
    }
});


app.post('/login', (req, res) => {
  const email=req.body.email;
  const password=req.body.password;
    User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          res.send("<div align ='center'><h2>Invalid email</h2></div><br><br><div align ='center'><a href='./login.html'>login again</a></div>");
        }

        // Match password   
        bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            res.send(`<div align ='center'><h2>login successful</h2></div><br><br><br><div align ='center'><h3>Hello ${user.name}</h3></div><br><br><div align='center'><a href='./login'>logout</a></div>`);
          } else {
            res.send("<div align ='center'><h2>Invalid password</h2></div><br><br><div align ='center'><a href='./login.html'>login again</a></div>");
          }
        });
      });
    
  

  });
  

app.listen(5000, (req, res) => {
    console.log('listening on port<-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><-><->');
});

// mongodb://localhost:27017