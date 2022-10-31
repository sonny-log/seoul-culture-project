
var mysql = require('mysql');


var conn = mysql.createConnection({
    host : "localhost",
    user: "root",
    password: "123456",
    database: "loc" // 선택사항이라고한다
})

conn.connect(function(err) {
    if (err) throw err;  // throw err = console.log(error) 과 같은의미
    console.log('data base connect 100%'); // db연동이 된경우에 출력
});

module.exports = conn;

conn.query('SELECT * FROM user', (err, results) => {
    if(err) throw err;
    console.log('DATA RECEIVE:');
    console.log(results);
})