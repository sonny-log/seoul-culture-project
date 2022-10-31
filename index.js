const express    = require('express');
const mysql      = require('mysql');
var ejs = require('ejs');
var bodyparser = require('body-parser');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs'); // 뷰엔진으로 npm 설치한 ejs 사용
app.set('views', './views/') // 아직 이해못함


app.get('/', (req, res) => {
    res.render('index')
});

app.use(bodyparser.json());  // bodyparser json 형태로 뿌려주기
app.use(bodyParser.urlencoded({extended:true}));

var db = mysql.createConnection({  // 데이터베이스 연동폼 , 
    host : "localhost",
    user: "root",
    password: "123456",
    database: "loc"
});
db.connect();

app.listen(3000, function(){ // 3000번포트로 뿌려주면 비동기함수 서버시작한다고 콘솔띄우기
    console.log('서버시작')
});

app.get('/getlist', function(req,res) { // form /getlist 랑 연동한 ejs 연결
    var sql = "SELECT * FROM cul_loc"; // 쿼리문 날려주고 select 문
    
    db.query(sql, function(err, results, fields){
        if (err) throw err;  // 에러 있으면 띄우고
        res.render('getlist', {cul_loc : results});  // getlist.ejs 에 render 해줄건데 , users 에 쿼리문 날리고난 results 를 담을거다 
    });
});
