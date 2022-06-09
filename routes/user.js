const express = require('express');
const router = express.Router();
const md5 = require('md5');
const jwt = require('jsonwebtoken');

const mysql = require('mysql');

const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "saad"
});


/* GET users listing. */
router.post('/register', async function (req, res, next) {
  try {
    let { Nombre, email, contrasena } = req.body; 
   
    const hashed_password = md5(contrasena.toString())

    const checkemail = `Select email FROM usuarios WHERE email = ?`;
    con.query(checkemail, [email], (err, result, fields) => {
      if(!result.length){
        const sql = `Insert Into usuarios (Nombre, email, contrasena) VALUES ( ?, ?, ? )`
        con.query(
          sql, [Nombre, email, hashed_password],
        (err, result, fields) =>{
          if(err){
            res.send({ status: 0, data: err });
          }else{
            let token = jwt.sign({ data: result }, 'secret')
            res.send({ status: 1, data: result, token : token });
          }
         
        })
      }
    });

    

   
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});

router.post('/login', async function (req, res, next) {
  try {
    let { email, contrasena } = req.body; 
   
    const hashed_password = md5(contrasena.toString())
    const sql = `SELECT * FROM usuarios WHERE email = ? AND contrasena = ?`
    con.query(
      sql, [email, hashed_password],
    function(err, result, fields){
      if(err){
        res.send({ status: 0, data: err });
      }else{
        let token = jwt.sign({ data: result }, 'secret')
        res.send({ status: 1, data: result, token: token });
      }
     
    })
  } catch (error) {
    res.send({ status: 0, error: error });
  }
});



module.exports = router;