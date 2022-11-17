const express    = require('express');
const mysql      = require('mysql');
var ejs = require('ejs');
var bodyparser = require('body-parser');
const bodyParser = require('body-parser');
var path = require('path');
var fs = require('fs');

const app = express();
const router = express.Router();
router.use(bodyParser.urlencoded({ extended: false }))

app.set('view engine', 'ejs'); // 뷰엔진으로 npm 설치한 ejs 사용
app.set('views', './views') // 아직 이해못함

app.use(bodyparser.json());  // bodyparser json 형태로 뿌려주기
app.use(bodyParser.urlencoded({extended:true}));

const dbsetting = require('./dbsetting')
dbsetting.dbinit();
const dbsetting2 = require('./save_DB.js');
const { Router } = require('express');
dbsetting2.dbcreate();

var db = mysql.createConnection({  // 데이터베이스 연동폼 , 
    host : "localhost",
    user: "root",
    password: "123456",
    database: "seoul_culture",
    multipleStatements: true
});
db.connect();
app.use(express.static('public'));

app.listen(3000, function(){ // 3000번포트로 뿌려주면 비동기함수 서버시작한다고 콘솔띄우기
    console.log('서버시작')
});

app.get('/', function(req,res) { 
    var loc_sql = "SELECT * FROM cul_pos ;"
    var event_sql = "SELECT * FROM cul_event where (strtdate between '2022-01-01' and current_date()) and (end_date between current_date() and '2024-12-24') order by IDX desc;"
    var will_sql = "SELECT * FROM cul_event where (strtdate > current_date()) order by IDX desc;"
 
    db.query(loc_sql + event_sql + will_sql, function(err, results){
        if (err) throw err;  
        res.render('main', {cul_pos : results[0] , cul_event: results[1],  will_event : results[2]});

    });
});

app.get('/map', function(req,res) { 
    var loc_sql = "SELECT * FROM cul_pos ;"
    var event_sql = "SELECT * FROM cul_event ;"
     db.query(loc_sql + event_sql, function(err, results){
        if (err) throw err;  
        res.render('cul_map', {cul_pos : results[0] , cul_event : results[1]});
    });
});


app.get('/event_list/:page', function(req,res) {
    var page_size = 10;
    //페이지의 갯수 : 1 ~ 10개 페이지
    var page_list_size = 10;
    //limit 변수
    var no = "";
    //전체 게시물의 숫자
    var totalPageCount = 0;
    
    var loc_sql = "SELECT count(*) as cnt FROM cul_event where(end_date between current_date() and '2024-12-24');";

    db.query(loc_sql, function(err, results){
        if (err) throw err; 

        totalPageCount = results[0].cnt
        var curPage = req.params.page;
        console.log("현재 페이지 : " + curPage, "전체 페이지 : " + totalPageCount);

        if (totalPageCount < 0) {
            totalPageCount = 0
        }
        var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
        var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수         
        var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
        var startPage = ((curSet - 1) * 10) + 1 //현재 세트내 출력될 시작 페이지
        var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지

        if (curPage < 0) {
            no = 0
        } else {
            //0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
            no = (curPage - 1) * 10
        } 
        var result2 = {
            "curPage": curPage,
            "page_list_size": page_list_size,
            "page_size": page_size,
            "totalPage": totalPage,
            "totalSet": totalSet,
            "curSet": curSet,
            "startPage": startPage,
            "endPage": endPage
        };

        fs.readFile('views/event_all_list.ejs', 'utf-8', function (error, data) {

            if (error) {
                console.log("ejs오류" + error);
                return
            }
            //console.log("몇번부터 몇번까지" + no)
            var queryString = "SELECT * FROM cul_event where(end_date between current_date() and '2024-12-24') order by IDX desc limit ?,?";
            db.query(queryString, [no, page_size], function (error, result) {
                if (error) {
                    console.log("페이징 에러" + error);
                    return
                }
                res.send(ejs.render(data, {
                    cul_event: result, pasing: result2
                }));
            });
        }); 
    });
});

app.get('/pos_list/:page', function(req,res) {
    //페이지당 게시물 수 : 한 페이지 당 10개 게시물
    var page_size = 10;
    //페이지의 갯수 : 1 ~ 10개 페이지
    var page_list_size = 10;
    //limit 변수
    var no = "";
    //전체 게시물의 숫자
    var totalPageCount = 0;
    
    var loc_sql = "SELECT count(*) as cnt FROM cul_pos ;"
    db.query(loc_sql, function(err, results){
        if (err) throw err; 

        totalPageCount = results[0].cnt
        var curPage = req.params.page;
        console.log("현재 페이지 : " + curPage, "전체 페이지 : " + totalPageCount);

        if (totalPageCount < 0) {
            totalPageCount = 0
        }
        var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
        var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수         
        var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
        var startPage = ((curSet - 1) * 10) + 1 //현재 세트내 출력될 시작 페이지
        var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지

        if (curPage < 0) {
            no = 0
        } else {
            //0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
            no = (curPage - 1) * 10
        } 
        var result2 = {
            "curPage": curPage,
            "page_list_size": page_list_size,
            "page_size": page_size,
            "totalPage": totalPage,
            "totalSet": totalSet,
            "curSet": curSet,
            "startPage": startPage,
            "endPage": endPage
        };

        fs.readFile('views/space_all_list.ejs', 'utf-8', function (error, data) {

            if (error) {
                console.log("ejs오류" + error);
                return
            }
            //console.log("몇번부터 몇번까지" + no)
            var queryString = 'select * from cul_pos order by IDX asc limit ?,?';
            db.query(queryString, [no, page_size], function (error, result) {
                if (error) {
                    console.log("페이징 에러" + error);
                    return
                }
                res.send(ejs.render(data, {
                    cul_pos: result, pasing: result2
                }));
            });
        }); 
    });
});

app.get('/cur_event_list/:page', function(req,res) {
    //페이지당 게시물 수 : 한 페이지 당 10개 게시물
    var page_size = 10;
    //페이지의 갯수 : 1 ~ 10개 페이지
    var page_list_size = 10;
    //limit 변수
    var no = "";
    //전체 게시물의 숫자
    var totalPageCount = 0;
    
    var loc_sql = "SELECT count(*) as cnt FROM cul_event where (strtdate between '2022-01-01' and current_date()) and (end_date between current_date() and '2024-12-24');"
    db.query(loc_sql, function(err, results){
        if (err) throw err; 

        totalPageCount = results[0].cnt
        var curPage = req.params.page;
        console.log("행사 현재 페이지 : " + curPage, "전체 페이지 : " + totalPageCount);

        if (totalPageCount < 0) {
            totalPageCount = 0
        }
        var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
        var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수         
        var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
        var startPage = ((curSet - 1) * 10) + 1 //현재 세트내 출력될 시작 페이지
        var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지

        if (curPage < 0) {
            no = 0
        } else {
            //0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
            no = (curPage - 1) * 10
        } 
        var result2 = {
            "curPage": curPage,
            "page_list_size": page_list_size,
            "page_size": page_size,
            "totalPage": totalPage,
            "totalSet": totalSet,
            "curSet": curSet,
            "startPage": startPage,
            "endPage": endPage
        };

        fs.readFile('views/cur_event_list.ejs', 'utf-8', function (error, data) {

            if (error) {
                console.log("ejs오류" + error);
                return
            }
            //console.log("몇번부터 몇번까지" + no)
            var queryString = "SELECT * FROM cul_event where (strtdate between '2022-01-01' and current_date()) and (end_date between current_date() and '2024-12-24') order by IDX desc limit ?,?";
            db.query(queryString, [no, page_size], function (error, result) {
                if (error) {
                    console.log("페이징 에러" + error);
                    return
                }
                res.send(ejs.render(data, {
                    cul_event: result, pasing: result2
                }));
            });
        }); 
    });
});

app.get('/will_event_list/:page', function(req,res) {
    //페이지당 게시물 수 : 한 페이지 당 10개 게시물
    var page_size = 10;
    //페이지의 갯수 : 1 ~ 10개 페이지
    var page_list_size = 10;
    //limit 변수
    var no = "";
    //전체 게시물의 숫자
    var totalPageCount = 0;
    
    var loc_sql = "SELECT COUNT(*) as cnt FROM cul_event where (strtdate > current_date());"
    db.query(loc_sql, function(err, results){
        if (err) throw err; 

        totalPageCount = results[0].cnt
        var curPage = req.params.page;
        console.log("행사 현재 페이지 : " + curPage, "전체 페이지 : " + totalPageCount);

        if (totalPageCount < 0) {
            totalPageCount = 0
        }
        var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
        var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수         
        var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
        var startPage = ((curSet - 1) * 10) + 1 //현재 세트내 출력될 시작 페이지
        var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지

        if (curPage < 0) {
            no = 0
        } else {
            //0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
            no = (curPage - 1) * 10
        } 
        //console.log('[0] curPage : ' + curPage + ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage);
        var result2 = {
            "curPage": curPage,
            "page_list_size": page_list_size,
            "page_size": page_size,
            "totalPage": totalPage,
            "totalSet": totalSet,
            "curSet": curSet,
            "startPage": startPage,
            "endPage": endPage
        };

        fs.readFile('views/will_event_list.ejs', 'utf-8', function (error, data) {

            if (error) {
                console.log("ejs오류" + error);
                return
            }
            //console.log("몇번부터 몇번까지" + no)
            var queryString = 'SELECT * FROM cul_event where (strtdate > current_date()) order by IDX desc limit ?,?';
            db.query(queryString, [no, page_size], function (error, result) {
                if (error) {
                    console.log("페이징 에러" + error);
                    return
                }
                res.send(ejs.render(data, {
                    cul_event: result, pasing: result2
                }));
            });
        }); 
    });
});

app.get('/resv_list/:page', function(req,res) {
    //페이지당 게시물 수 : 한 페이지 당 10개 게시물
    var page_size = 10;
    //페이지의 갯수 : 1 ~ 10개 페이지
    var page_list_size = 10;
    //limit 변수
    var no = "";
    //전체 게시물의 숫자
    var totalPageCount = 0;
    
    var loc_sql = "SELECT count(*) as cnt FROM cul_reserv ;"
    db.query(loc_sql, function(err, results){
        if (err) throw err; 

        totalPageCount = results[0].cnt
        var curPage = req.params.page;
        console.log("예약 현재 페이지 : " + curPage, "전체 페이지 : " + totalPageCount);

        if (totalPageCount < 0) {
            totalPageCount = 0
        }
        var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
        var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수         
        var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
        var startPage = ((curSet - 1) * 10) + 1 //현재 세트내 출력될 시작 페이지
        var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지

        if (curPage < 0) {
            no = 0
        } else {
            //0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
            no = (curPage - 1) * 10
        } 
        //console.log('[0] curPage : ' + curPage + ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage);
        var result2 = {
            "curPage": curPage,
            "page_list_size": page_list_size,
            "page_size": page_size,
            "totalPage": totalPage,
            "totalSet": totalSet,
            "curSet": curSet,
            "startPage": startPage,
            "endPage": endPage
        };

        fs.readFile('views/reserv_all_list.ejs', 'utf-8', function (error, data) {

            if (error) {
                console.log("ejs오류" + error);
                return
            }
            //console.log("몇번부터 몇번까지" + no)
            var queryString = 'select * from cul_reserv order by IDX asc limit ?,?';
            db.query(queryString, [no, page_size], function (error, result) {
                if (error) {
                    console.log("페이징 에러" + error);
                    return
                }
                res.send(ejs.render(data, {
                    cul_reserv: result, pasing: result2
                }));
            });
        }); 
    });
});



router.route('/pos_type_list/:hee/:pcount').get(function(req,res){

    var cul_pos_data = path.parse(req.params.hee).base;

    var page_size = 10;
    var page_list_size = 10;
    var no = "";
    var totalPageCount = 0;
    
    var loc_sql = "SELECT count(*) as cnt from cul_pos WHERE CODE='"+ cul_pos_data +"';"
    
    db.query(loc_sql, function(err, results){
        if (err) throw err; 

        totalPageCount = results[0].cnt
        var curPage = req.params.pcount;
        console.log("a예약 현재 페이지 : " + curPage, "전체 페이지 : " + totalPageCount);

        if (totalPageCount < 0) {
            totalPageCount = 0
        }
        var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
        var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수         
        var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
        var startPage = ((curSet - 1) * 10) + 1 //현재 세트내 출력될 시작 페이지
        var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지

        if (curPage < 0) {
            no = 0
        } else {
            //0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
            no = (curPage - 1) * 10
        } 
        var result2 = {
            "curPage": curPage,
            "page_list_size": page_list_size,
            "page_size": page_size,
            "totalPage": totalPage,
            "totalSet": totalSet,
            "curSet": curSet,
            "startPage": startPage,
            "endPage": endPage
        };

        fs.readFile('views/space-list.ejs', 'utf-8', function (error, data) {

            if (error) {
                console.log("ejs오류" + error);
                return
            }
            var queryString = 'SELECT * from cul_pos WHERE CODE=? order by IDX asc limit ?,?;';
            db.query(queryString, [cul_pos_data, no, page_size], function (error, result) {
                if (error) {
                    console.log("페이징 에러" + error);
                    return
                }
                res.send(ejs.render(data, {
                    cul_pos: result, pasing: result2
                }));
            });
        });
    })
});

router.route('/event_type_list/:hee/:pcount').get(function(req,res){

    var cul_event_data = path.parse(req.params.hee).base;

    var page_size = 10;
    var page_list_size = 10;
    var no = "";
    var totalPageCount = 0;
    
    var loc_sql = "SELECT count(*) as cnt from cul_event WHERE CODE='"+ cul_event_data+"';"
    console.log(loc_sql);
    db.query(loc_sql, function(err, results){
        if (err) throw err; 

        totalPageCount = results[0].cnt
        var curPage = req.params.pcount;
        console.log("예약 현재 페이지 : " + curPage, "전체 페이지 : " + totalPageCount);

        if (totalPageCount < 0) {
            totalPageCount = 0
        }
        var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
        var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수         
        var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
        var startPage = ((curSet - 1) * 10) + 1 //현재 세트내 출력될 시작 페이지
        var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지

        if (curPage < 0) {
            no = 0
        } else {
            //0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
            no = (curPage - 1) * 10
        } 
        var result2 = {
            "curPage": curPage,
            "page_list_size": page_list_size,
            "page_size": page_size,
            "totalPage": totalPage,
            "totalSet": totalSet,
            "curSet": curSet,
            "startPage": startPage,
            "endPage": endPage
        };

        fs.readFile('views/event-list.ejs', 'utf-8', function (error, data) {
            if (error) {
                console.log("ejs오류" + error);
                return
            }
            var queryString = 'SELECT * from cul_event WHERE CODE=? order by IDX desc limit ?,?;';
            db.query(queryString, [cul_event_data, no, page_size], function (error, result) {
                if (error) {
                    console.log("pasing error : " + error);
                    return
                }
                res.send(ejs.render(data, {
                    cul_event: result, pasing: result2
                }));
            });
        });
})
})

router.route('/resv_type_list/:hee/:pcount').get(function(req,res){

    var cul_resv_data = path.parse(req.params.hee).base;

    var page_size = 10;
    var page_list_size = 10;
    var no = "";
    var totalPageCount = 0;
    
    var loc_sql = "SELECT count(*) as cnt from cul_reserv WHERE AREANM='"+ cul_resv_data+"';"
    console.log(loc_sql);
    db.query(loc_sql, function(err, results){
        if (err) throw err; 

        totalPageCount = results[0].cnt
        var curPage = req.params.pcount;
        console.log("r예약 현재 페이지 : " + curPage, "전체 페이지 : " + totalPageCount);

        if (totalPageCount < 0) {
            totalPageCount = 0
        }
        var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
        var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수         
        var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
        var startPage = ((curSet - 1) * 10) + 1 //현재 세트내 출력될 시작 페이지
        var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지

        if (curPage < 0) {
            no = 0
        } else {
            //0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
            no = (curPage - 1) * 10
        } 
        var result2 = {
            "curPage": curPage,
            "page_list_size": page_list_size,
            "page_size": page_size,
            "totalPage": totalPage,
            "totalSet": totalSet,
            "curSet": curSet,
            "startPage": startPage,
            "endPage": endPage
        };

        fs.readFile('views/resv-list.ejs', 'utf-8', function (error, data) {

            if (error) {
                console.log("ejs오류" + error);
                return
            }
            var queryString = 'SELECT * from cul_reserv WHERE AREANM=? order by IDX asc limit ?,?;';
            db.query(queryString, [cul_resv_data, no, page_size], function (error, result) {
                if (error) {
                    console.log("페이징 에러" + error);
                    return
                }
                res.send(ejs.render(data, {
                    cul_reserv: result, pasing: result2
                }));
            });
        });
})
})

router.route('/pos_detail/:hee').get(function(req,res){
    var cul_pos_data = path.parse(req.params.hee).base;
    db.query('SELECT * from cul_pos WHERE IDX=?;', cul_pos_data, function(err, result) {
            console.log(result);
            res.render('pos_detail_page',{ cul_pos: result});
        });
})

router.route('/event_detail/:i').get(function(req,res){
    var cul_event_data = path.parse(req.params.i).base;
    db.query('SELECT * from cul_event WHERE IDX=?;', cul_event_data, function(err, result) {
            console.log(result);
            res.render('event_detail_page',{ cul_event: result});
        });
})
router.route('/reserv_detail/:hee').get(function(req,res){
    var cul_reserv_data = path.parse(req.params.hee).base;
    db.query('SELECT * from cul_reserv WHERE IDX=?;', cul_reserv_data, function(err, result) {
            console.log(result);
            res.render('reserv_detail_page',{cul_reserv: result});
        });
})


app.use('/',router);

module.exports = router;


  

