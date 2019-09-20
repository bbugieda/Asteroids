$(document).ready(function(e){
  $( "#StartButton" ).click(function() {
    $( "#splashscreen" ).fadeOut(1000);
    $(".spaceShip").show();
    $("body").show();
  });

  var keys = {};
  $(document).keydown(function(event){
    keys[event.which] = true;
  }).keyup(function(event){
    delete keys[event.which];
  });

  var $d = $(".spaceShip");
  var angle = 0;

  

  function areaCheck(){
    var screeny = $(window).height();
    var screenx = $(window).width();
    var xloc = parseFloat($d.css('left'));
    var yloc = parseFloat($d.css('top'));
    
    if(xloc > screenx){
       $d.css("left", 0 + "px");
    }
    if(yloc > screeny){
       $d.css("top", 0 + "px");
    }
    if(xloc < 0){
      $d.css("left", screenx + "px");
   }
   if(yloc < 0){
      $d.css("top", screeny + "px");
   }
  }

  function angleCheck(){ // Check to keep 0 <= angle <= 360
    if (angle >= 360){
      angle = 0
    }
    else if (angle <= 0){
      angle = 359
    }
  }

  var x = 150,
    y = 150,
    velY = 0,
    velX = 0,
    speed = 2,
    friction = 0.98,
    keys = [];

  function update() {

    if (keys[38]) {
      if (velY > -speed) {
        velY--;
      }
      x = parseFloat($d.css('left'));
      y = parseFloat($d.css('top'));
      x += velX*Math.cos(angle * Math.PI/180)
      y += velY*Math.sin(angle * Math.PI/180)
      $d.css("top", y + "px");
      $d.css("left", x + "px");
    }

    if (keys[39]) {
      if (velX < speed) {
        velX++;
      }
        angle+=5
        $d.css("transform", "rotate("+angle+"deg)")
    }
    if (keys[37]) {
      if (velX > -speed) {
        velX--;
      }
        angle-=5
        $d.css("transform", "rotate("+angle+"deg)")
    }
  }
 
  function gameLoop() {
    areaCheck();
    angleCheck();
    update();
    setTimeout(gameLoop, 15);
  }
  gameLoop();
    
  $(document).focus();
})
