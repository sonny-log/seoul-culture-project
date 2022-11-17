const dbinit=()=>{
    const mysql = require('mysql')
    const fs = require('fs');
    const sql = fs.readFileSync("./dbinit.sql").toString();
  
    let con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "123456",
      multipleStatements: true
    });
    
    con.connect(function(err) {
      if (err) throw err;
      console.log("not yet");
      
      con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Database created");
      });
    });
  }
  
  module.exports={
    dbinit,
}