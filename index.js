const express    = require('express');
const mysql      = require('mysql');
const dbconfig   = require('./config/database.js');
const connection = mysql.createConnection(dbconfig);

const app = express();

// configuration =========================
app.set('port', process.env.PORT || 3000);

app.get('/', (req, res) => {
  res.send('Root');
});
app.get('/users', (req, res) => {
  connection.query('SELECT * from cul_loc', (error, rows) => {
    if (error) throw error;
/* https://ganzicoder.tistory.com/64 */
    const html = 
    `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8"/>
            <title>Kakao 지도 시작하기</title>
            <style>
            .over_wrap {position:relative;bottom:70px;right:0px;border-radius:6px;line-height:30px;}
            .over_wrap * {padding: 0;margin: 0;}
            .over_wrap .over_info {width: 170px;height: 120px;border-radius: 5px;border-bottom: 2px solid #ccc;border-right: 1px solid #ccc;overflow: hidden;background: #fff;}
            .over_wrap .over_info:nth-child(1) {border: 0;box-shadow: 0px 1px 2px rgb(240, 238, 238);}
            .over_info .over_title {padding: 5px 0 0 10px;height: 30px;color:#fff; background: #263379 ;border-bottom: 1px solid #ddd;font-size: 18px;font-weight: bold;}
            .over_info .over_close {position: absolute;top: 10px;right: 10px;color: rgb(255, 255, 255);width: 17px;height: 17px;background: url('https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/overlay_close.png');}
            .over_info .over_close:hover {cursor: pointer;}
            .over_info .over_body {position: relative;overflow: hidden;}
            .over_info .over_desc {position: relative;margin: 13px 0 0 90px;height: 75px;}
            .over_info .over_img {position: absolute;top: 6px;left: 5px;width: 73px;height: 71px;border: 1px solid #ddd;color: #888;overflow: hidden;}

            .over_info .link {color: #5085BB;}

            .info-title {
                width:200px;
                text-align:center;
                padding-top:4px;
            }
            </style>
        </head>
        <body>
            
            <div id="map" style="width:500px;height:400px;"></div>
            <script type="text/javascript" src="//dapi.kakao.com/v2/maps/sdk.js?appkey=	980cb5bdc84e332d75c476760f95cb73"></script>
            <script>
                var container = document.getElementById('map');
               for (const i =0; i < 818; i++){
                var options= {
                    center:  new kakao.maps.LatLng(${rows[0].loc_log}, ${rows[0].loc_lat}),
                    level: 3
                };
                <% for (var)%>
                var infowindow = new kakao.maps.InfoWindow({
                    content: '<div class="info-title">rows[i].NAME}</span>' // 인포윈도우에 표시할 내용
                });
                var map = new kakao.maps.Map(container, options);
                // 마커가 표시될 위치입니다 
                var markerPosition  = new kakao.maps.LatLng(rows[i].loc_log}, rows[i].loc_lat}); 

                // 마커를 생성합니다
                var marker = new kakao.maps.Marker({
                    position: markerPosition
                });

                // 마커가 지도 위에 표시되도록 설정합니다
                marker.setMap(map);
                var overlay = new kakao.maps.CustomOverlay({
                    position: marker.getPosition()
                });
        
                var Customcontent = document.createElement('div');
                Customcontent.style.width = '170px';
                Customcontent.style.height = '150px';
                Customcontent.className = "over_wrap";
        
                var info = document.createElement('div');
                info.className = "over_info";
                Customcontent.appendChild(info);
        
                var title = document.createElement('div');
                title.className = "over_title";
                title.appendChild(document.createTextNode("흡연부스"))
                info.appendChild(title);
        
                var closeBtn = document.createElement("div");
                closeBtn.className = "over_close";
                closeBtn.setAttribute("title","닫기");
                closeBtn.onclick = function(){overlay.setMap(null);};
                title.appendChild(closeBtn);
        
                var bodyContent = document.createElement("div");
                bodyContent.className = "over_body";
                info.appendChild(bodyContent);
        
                var imgDiv = document.createElement("div");
                imgDiv.className = "over_img";
                bodyContent.appendChild(imgDiv);
        
                var imgContent = document.createElement("img");
                imgContent.setAttribute("width", "73");
                imgContent.setAttribute("heigth", "70");
                imgDiv.appendChild(imgContent);
        
                var descContent = document.createElement("div");
                descContent.className = "over_desc"
                bodyContent.appendChild(descContent);
        
                var LinkDiv = document.createElement("div");
                descContent.appendChild(LinkDiv);
        
                var url = ""
        
                var LinkContent = document.createElement("a");
                if (url == "")
                {
                url = "javascript:"
                }
                LinkContent.setAttribute("href", "#");
                if (url != "javascript:")
                {
                LinkContent.setAttribute("target", "_blank");
                }
                LinkContent.className = "link";
                LinkContent.appendChild(document.createTextNode("리뷰"));
                LinkDiv.appendChild(LinkContent);
        
                overlay.setContent(Customcontent);

                kakao.maps.event.addListener(marker, 'mouseover', mouseOverListener(map, marker,infowindow ));
                kakao.maps.event.addListener(marker, 'mouseout', mouseOutListener(infowindow));
                kakao.maps.event.addListener(marker, 'click', clickListener(map,marker,overlay));
            
            function mouseOverListener(map, marker,infowindow){
                return function(){
                    infowindow.open(map, marker);
                }
            }
        
            function mouseOutListener(infowindow) {
                return function() {
                    infowindow.close();
                };
            }
            var clickedOverlay = null;
            function clickListener( map,marker,overlay ){
                return function() {
                    if (clickedOverlay) {
                    clickedOverlay.setMap(null);
                    }
                    overlay.setMap(map);
                    clickedOverlay = overlay;
                    
                };
            }
            </script>
        </body>
        </html>
    `;

    res.writeHead(200,{'Content-Type': 'text/html'});
    res.end(html);
    /* console.log('User info is: ', rows[0].NAME);
    res.send(rows[0].NAME); */
  });
  
});

app.listen(app.get('port'), () => {
  console.log('Express server listening on port ' + app.get('port'));
});