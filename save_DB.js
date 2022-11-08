const dbcreate=()=>{
    const mysql = require('mysql')
    var request = require('request');

    // mySQL 연동
    const con = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '123456',
        database: 'seoul_culture'
      })
    con.connect(function(err){
        if(err) throw err;
        console.log('connected OK');
    })
    // LOC_API 연동
    var loc_options = {
      'method': 'GET',
      'url': 'http://openapi.seoul.go.kr:8088/41526d765768757937354478464174/json/culturalSpaceInfo/1/819/',
      'headers': {
      }
    };
    request(loc_options, function (error, response,body) {
      if (error) {
        throw new Error(error)
      }
      const info = JSON.parse(body);

      var sql = 'INSERT IGNORE INTO cul_pos(CODE, NAME, ADDRESS, HOMEURL , LOC_LOG, LOC_LAT, CONTACT, MAIN_IMG) VALUES(?,?,?,?,?,?,?,?)';
      for (var i in info['culturalSpaceInfo']['row']) 
      { var params = 
            [
                [info['culturalSpaceInfo']['row'][i]['SUBJCODE']],
                [info['culturalSpaceInfo']['row'][i]['FAC_NAME']],
                [info['culturalSpaceInfo']['row'][i]['ADDR']],
                [info['culturalSpaceInfo']['row'][i]['HOMEPAGE']],
                [info['culturalSpaceInfo']['row'][i]['X_COORD']],
                [info['culturalSpaceInfo']['row'][i]['Y_COORD']],
                [info['culturalSpaceInfo']['row'][i]['PHNE']],
                [info['culturalSpaceInfo']['row'][i]['MAIN_IMG']]
            ]
            
            con.query(sql,params,function(err,rows,fields){
            if(err){
                console.log(err);
            } });
        }
        console.log("Database_cul_pos_success");
    });
    
    // EVENT_API 연동
    var event_options = {
      'method': 'GET',
      'url': 'http://openapi.seoul.go.kr:8088/49526f674768757931303464794d4477/json/culturalEventInfo/1/982/',
      'headers': {
      }
    };
    request(event_options, function (error, response,body) {
      if (error) {
        throw new Error(error)
      }
      const info = JSON.parse(body);

      var sql = 'INSERT IGNORE INTO cul_event(CODE, NAME, HOMEURL, DATE, PLACE, USE_WHO, MAIN_IMG) VALUES(?,?,?,?,?,?,?)';
      
      for (var i in info['culturalEventInfo']['row']) 
      { var params = 
            [
                [info['culturalEventInfo']['row'][i]['CODENAME']],
                [info['culturalEventInfo']['row'][i]['TITLE']],
                [info['culturalEventInfo']['row'][i]['ORG_LINK']],
                [info['culturalEventInfo']['row'][i]['DATE']],
                [info['culturalEventInfo']['row'][i]['PLACE']],
                [info['culturalEventInfo']['row'][i]['USE_TRGT']],
                [info['culturalEventInfo']['row'][i]['MAIN_IMG']]
            ]
            con.query(sql,params,function(err,rows,fields){
            if(err){
                console.log(err);
            } });
        }
        var d_sql = 
        "DELETE FROM cul_event where (DATE like '%~2022-08%' or DATE like '%~2022-09%' or DATE like '%~2022-10%' or DATE like '%~2022-11-01%' or DATE like '%~2022-11-02%'or DATE like '%~2022-11-03%' or DATE like '%~2022-11-04%' or DATE like '%~2022-11-05%' or DATE like '%~2022-11-06%'or DATE like '%~2022-11-07%' or DATE like '%~2022-11-08%')";
        con.query(
          d_sql,function(err){
          if(err){
              console.log(err);
          }else{
            console.log("Success delete cul_event expire DATE");
          } });
        console.log("Database_cul_event_success");
    });

}
module.exports={
  dbcreate,
}