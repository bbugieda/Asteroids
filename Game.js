

$(document).ready(function(e){
  $( "#StartButton" ).click(function() {
    $( "#splashscreen" ).fadeOut(1000);
    $(".spaceShip").show();
    $("body").show();
  });
  var keys = {};
  var forward;
  $(document).keydown(function(event){
    keys[event.which] = true;
  }).keyup(function(event){
    delete keys[event.which];
  });

  var $d = $(".spaceShip");
  var angle = 0
  $(window).height();
  $(window).width();
  var checkTime = 0;
  var bulletCount = 0;
  var currentTime = new Date()

  function easing(val){
    
  }

  // EasingFunctions = {
  //   // no easing, no acceleration
  //   linear: function (t) { return t },
  //   // accelerating from zero velocity
  //   easeInQuad: function (t) { return t*t },
  //   // decelerating to zero velocity
  //   easeOutQuad: function (t) { return t*(2-t) },
  //   // acceleration until halfway, then deceleration
  //   easeInOutQuad: function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t },
  //   // accelerating from zero velocity 
  //   easeInCubic: function (t) { return t*t*t },
  //   // decelerating to zero velocity 
  //   easeOutCubic: function (t) { return (--t)*t*t+1 },
  //   // acceleration until halfway, then deceleration 
  //   easeInOutCubic: function (t) { return t<.5 ? 4*t*t*t : (t-1)*(2*t-2)*(2*t-2)+1 },
  //   // accelerating from zero velocity 
  //   easeInQuart: function (t) { return t*t*t*t },
  //   // decelerating to zero velocity 
  //   easeOutQuart: function (t) { return 1-(--t)*t*t*t },
  //   // acceleration until halfway, then deceleration
  //   easeInOutQuart: function (t) { return t<.5 ? 8*t*t*t*t : 1-8*(--t)*t*t*t },
  //   // accelerating from zero velocity
  //   easeInQuint: function (t) { return t*t*t*t*t },
  //   // decelerating to zero velocity
  //   easeOutQuint: function (t) { return 1+(--t)*t*t*t*t },
  //   // acceleration until halfway, then deceleration 
  //   easeInOutQuint: function (t) { return t<.5 ? 16*t*t*t*t*t : 1+16*(--t)*t*t*t*t }
  // }

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

  function angleCheck(angle){ // Check to keep 0 <= angle <= 360
    if (angle >= 360){
      angle = 0
    }
    else if (angle <= 0){
      angle = 359
    }
  }

 

  function fireBullet(x,y,ang) {
    bulletCount++;
    var t = $("body").append($("<img src='assets/bullet.png'>").addClass("bullet").css({ "left" : x + 60, 'top' : y + 20 }));
    t.attr('id', bulletCount);
    var bull = new Bullet(x,y,ang);
    return bull;
  }
    
  
  function Bullet(x,y,ang) {
    // `this` is the instance which is currently being created
    
    this.xloc =  x;
    this.yloc = y;
    this.angle = ang;
    return this;
    // No need to return, but you can use `return this;` if you want
  }


  function update(bull) {
    $("[class^='bullet']").each(function() {
        bull.xval += 7*Math.cos((bull.angle-90) * Math.PI/180)
        bull.yval += 7*Math.sin((bull.angle-90) * Math.PI/180)
        $(this).css("left", bull.xval);
        $(this).css("top", bull.yval);
        // $(this).css("transform", "rotate("+angle+"deg)")
        
      
    });
  }

  var locked = false;
 
  function gameLoop() {
    
    areaCheck();
    angleCheck(angle);
    if (keys[39]) {     //right
        angle+=5
        $d.css("transform", "rotate("+angle+"deg)")
    }
    else if (keys[37]) { //left
        angle-=5
        $d.css("transform", "rotate("+angle+"deg)")
    }

    if (keys[32]) { //down
        if(!locked){
          
        locked = true;
        
        var xloc = parseFloat($d.css('left'));
        var yloc = parseFloat($d.css('top'));
        
        var bull = fireBullet(xloc,yloc,angle);
       
        var i = setInterval(update(bull) ,50);
        setTimeout(function( ) { clearInterval( i );}, 5000);
        setTimeout(function( ) { locked = false;}, 250);
        }
  }
    else if (keys[38]) { //up
      forward = true;
      var xloc = parseFloat($d.css('left'));
      var yloc = parseFloat($d.css('top'));
      xloc += 7*Math.cos(4.8+ angle * Math.PI/180)
      yloc += 7*Math.sin(4.8+ angle * Math.PI/180)
      $d.css("top", yloc + "px");
      $d.css("left", xloc + "px");
    }
    
    setTimeout(gameLoop, 15);

  }
  

  gameLoop();
    
  $(document).focus();
});