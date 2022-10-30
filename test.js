const mysql = require('mysql')
var request = require('request');

// mySQL 연동
const con = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'loc'
  })


con.connect(function(err){
    if(err) throw err;
    console.log('connected OK');
})

// API 연동
const key='41526d765768757937354478464174'
const startnum = 1;
const endnum = 10;
var options = {
  'method': 'GET',
  'url': 'http://openapi.seoul.go.kr:8088/41526d765768757937354478464174/json/culturalSpaceInfo/1/817/',
  'headers': {
  }
};


request(options, function (error, response,body) {
  if (error) {
    throw new Error(error)
  }
  const info = JSON.parse(body);

  var sql = 'INSERT INTO cul_loc(CODE, NAME, adress, homeurl , loc_log, loc_lat, contact ) VALUES(?,?,?,?,?,?,?)';
   for (i in info['culturalSpaceInfo']['row']) 
   { var params = 
        [
            [info['culturalSpaceInfo']['row'][i]['SUBJCODE']],
            [info['culturalSpaceInfo']['row'][i]['FAC_NAME']],
            [info['culturalSpaceInfo']['row'][i]['ADDR']],
            [info['culturalSpaceInfo']['row'][i]['HOMEPAGE']],
            [info['culturalSpaceInfo']['row'][i]['X_COORD']],
            [info['culturalSpaceInfo']['row'][i]['Y_COORD']],
            [info['culturalSpaceInfo']['row'][i]['PHNE']]
        ]
        
        con.query(sql,params,function(err,rows,fields){
        if(err){
            console.log(err);
        } else{
            console.log('ok');
        } });
    }
    con.end();
}); 

/* console.log('분류 : ' + info['culturalSpaceInfo']['row'][i]['SUBJCODE']);
    console.log('장소명 : ' + info['culturalSpaceInfo']['row'][i]['FAC_NAME']);
    console.log('주소 : ' + info['culturalSpaceInfo']['row'][i]['ADDR']);
    console.log('전화번호 : ' + info['culturalSpaceInfo']['row'][i]['PHNE']);
    console.log('url : ' + info['culturalSpaceInfo']['row'][i]['HOMEPAGE']);
    console.log('경도 : ' + info['culturalSpaceInfo']['row'][i]['X_COORD']);
    console.log('위도 : ' + info['culturalSpaceInfo']['row'][i]['Y_COORD']);
    console.log(" ")   */