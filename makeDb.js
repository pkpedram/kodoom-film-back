const express = require('express')

const app = express();

const PORT = 4200;

const mysql=require("mysql");
const con=mysql.createConnection({
 host: 'localhost',
  user: 'root',
  password: '',
});

var genresTable = 'CREATE TABLE geners (id int(15) NOT NULL AUTO_INCREMENT,' +
    'title varchar(50) DEFAULT NULL, PRIMARY KEY (id)) ENGINE=InnoDB DEFAULT CHARSET=latin1'

let castTable = 'CREATE TABLE cast (id int(15) NOT NULL AUTO_INCREMENT,' +
'full_name varchar(90) DEFAULT NULL, image LONGBLOB DEFAULT NULL, PRIMARY KEY (id)) ENGINE=InnoDB DEFAULT CHARSET=latin1'

let directorsTable = 'CREATE TABLE directors (id int(15) NOT NULL AUTO_INCREMENT,' +
'full_name varchar(90) DEFAULT NULL, image LONGBLOB DEFAULT NULL, PRIMARY KEY (id)) ENGINE=InnoDB DEFAULT CHARSET=latin1'




app.listen(PORT, () => {
    console.log(`APP RUNNING ON PORT ${PORT}`)
    con.connect(async (err) => {
        if(err) throw err;
       try {
        con.query("CREATE DATABASE kodoomfilm", function (err, result) {
            if (err) throw err;
            console.log("Database created");
          });
        

        con.query(genresTable, (err,rows) => {
            if(err) throw err;
            console.log('Geners Table Made.');
            
          })

        con.query(castTable, (err, rows) => {
            if (err) throw err;
            console.log('cast Table Made.')
        })  

        con.query(directorsTable, (err, rows) => {
            console.log('directors Table Made.')
        })
       } catch (error) {
        console.log(error)
       }
    })

})