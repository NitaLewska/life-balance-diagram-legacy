/*массив цветов*/
var colors = ['#01931C', '#27475C', '#5292BC', '#351F78', '#451F78', '#5B0682', '#D3026C', '#e1fb2d', '#CE2110', '#CE6110',
'#E66D01', '#EFCC00'];

var arrSliders = [1,1,1,1,1,1,1,1,1,1,1,1];
var ctx;
var count_sectors;

var arr_txtrow1 = ['Здоровье','Отношения','Окружение','Работа','Обеспеченность','Яркость жизни','Самосовершенствование',
'Духовность'];

 
$(document).ready(function() {
  ctx = document.getElementById("id_cv").getContext("2d");    

  
  //обработка перемещения слайдера
  $('.easyui-slider').slider({
    onSlideEnd:function(){
      createDiagram();      
    }
  })
  /*прослушивание ссылки на загрузку JPG*/
  document.getElementById('download').addEventListener('click', download, false);
})


//загрузка JPG
function download() {
    var canvas = document.getElementById("id_cv");
    var dt = canvas.toDataURL('image/jpeg');
    this.href = dt;
};  


//обновляет массив со значениями слайдеров радиуса (веса)
function reNewSlidersValue () {  
  for (a=1; a<13; a++) {
    arrSliders[a-1] = document.getElementById('es' + a).value;
  }
}


/*возвращает радианы из градусов*/
function Radian (gradus) {
  return (Math.PI / 180) * gradus;
}


//выводит название колеса, набираемое в шапке левой колонки
function writeNameRing() {  
  var name = document.getElementById('inpNameRing').value;
  /*в h1*/
  document.getElementById('lblNameRing').innerHTML = name;    
      /*очистка*/    
  ctx.fillStyle='#fff';
  ctx.fillRect (20, 10, 260, 30);

  ctx.fillStyle = "#000";
  ctx.font = "12pt Arial";
  ctx.fillText(name, 30, 30);
}


//выводит имя, набираемое в шапке левой колонки
function writeName() {  
  var name = document.getElementById('name').value;
  /*очистка*/    
  ctx.fillStyle='#fff';
  ctx.fillRect (40, 340, 240, 30);

  ctx.fillStyle = "#000";
  ctx.font = "12pt Arial";
  ctx.fillText(name, 50, 360);
}


//B-база, R-радиус, A-угол от оси 0 (на 3 часа)
function getXY_byAngle (B, R, A) {
   var x = B/2 + R * Math.cos(A); 
   var y = B/2 + R * -Math.sin(A);
   
   return [x, y];
};



//выводит номер сектороа
function writeNum( count_sectors ) {
    ctx.fillStyle = colors[a];
    ctx.font = "16pt Arial";
    var angleOneSector = 360 / count_sectors;
    
    for (a=0; a<count_sectors; a++) {
        ctx.fillStyle = colors[a];
      //360- т.к. углы по умолчанию считаются против часовой, а мне надо ПО часовой
      var point = getXY_byAngle( 380, 123, Radian( 359 - a * angleOneSector - (angleOneSector/2) ) );              
      
      ctx.fillText(a+1, point[0]-48, point[1]+0);        //коррекция X, Y
    }
}


/*рисование на канвасе*/
function createDiagram() {  
  var start = finish = 0;
  count_sectors = document.getElementById("count-sectors").value;
  count_sectors = count_sectors.substr(3);    
  var cntSectors = parseInt( count_sectors );
  var oneSector = 360 / cntSectors;

  ctx = document.getElementById("id_cv").getContext("2d");    
  ctx.fillStyle='#fff';              /*test #fff */
  ctx.fillRect (0, 0, 300, 680);    //очистка canvas 0,0, ширина, высота 

  var xc = 150, yc = 180, radius = 136;
  var min_radius = radius/12;
  
  reNewSlidersValue ();                      //обновление значений в arrSliders[] с радиусами
  /*рисуем цветные секотра*/
  for(a=0; a<count_sectors; a++) {
    start = finish;
    finish = start + oneSector;  
    ctx.fillStyle = colors[a];
    ctx.beginPath();
    ctx.arc( xc, yc, min_radius*arrSliders[a], Radian(start), Radian(finish) );    
    ctx.lineTo(xc, yc);
    ctx.fill();    
  }      
  
  //рисуем окружности
  for (a=1; a<12; a++) {
    if (a==11) continue;    /*наружнее кольцо состоит из двух, 11 не показываем*/
    ctx.beginPath();
    ctx.arc( xc, yc, min_radius*a, 0, Radian(360) );        
    ctx.strokeStyle  = "rgba(155,155,155,.7)"
    ctx.stroke();        
  } 
 
  
  /*рисуем перегородки между секторами*/
  for(a=0; a<count_sectors; a++) {
    start = finish;
    finish = start + oneSector;  
    ctx.fillStyle = colors[a];
    ctx.beginPath();
    ctx.arc( xc, yc, radius, Radian(start), Radian(finish) );    
    ctx.lineTo(xc, yc);
    ctx.stroke();          
  }   
  
  writeNum( count_sectors );
  createTable();
  writeName(); 
  writeNameRing();
}



//при изменении числа секторов
function changeCount() {
  var ansver = $('#count-sectors').val();
  
  $('.grp4, .grp6, .grp8, .grp10, .grp12').css('display','none');       /*отключаем видимость*/  
  $('.' + ansver).css('display','block');                               /*включаем необходимые*/
  
  $('#inpNameRing')
  
  createDiagram();
}




function fill_txt_rows( name_ring ) {
    if ( name_ring === 'Колесо Жизненного Баланса' ) {
      for (i=0; i<8; i++) {
        $('#txt_row'+(i+1)).val(arr_txtrow1[i]);    
      }        
    }
}



//при изменении предустановленного типа колеса
function changeType() {
  var ansver = $('#type-wheel').val();  
  
  if ( ansver === 'Колесо Жизненного Баланса') {      //устанавливаю кол-во секторов
    $('#count-sectors').val('grp8');        
    changeCount();
  }
  
  fill_txt_rows( ansver );                            //заполняем поля с именами свойств
  
  $('#inpNameRing').val( ansver );                    // отображаю в поле ввода имени колеса
  writeNameRing();                                    // на canvas
  createTable();
}


//создается и обновляется таблица в canvas
function createTable() {  
  ctx.fillStyle = "#000";
  ctx.font = "12pt Arial";
  ctx.fillText( "№              Сектор                 Баллы", 10, 400 );    
  
  
  for (a=0; a<count_sectors; a++) {
    ctx.fillStyle='#666';
    ctx.fillText(a+1+'.', 20, 440 + a*20);                  /*номер строки*/
    ctx.fillText(arrSliders[a], 240, 440 + a*20);           /*величина свойства*/    

    txtOut( a + 1 );                                       /*название свойства*/
  }  
}



//при вводе названий в поля
function txtOut( row ) {  
  /*очищаем таблицу в канвасе*/
  ctx.fillStyle='#fff';
  ctx.fillRect (40, 420 + (row * 20) - 20, 200, 30);

  txtRow = document.getElementById('txt_row' + row).value;
  
  ctx.fillStyle = "#000";
  ctx.font = "12pt Arial";
  ctx.fillText( txtRow, 50, 441 + (row * 20) - 22 );    
}






























