$(document).ready(function(e){
  var keys = {};

  $(document).keydown(function(event){
    keys[event.which] = true;
  }).keyup(function(event){
    delete keys[event.which];
  });

  var $d = $(".ball");
  var angle = 0

  function gameLoop() {
    if (angle >= 360){
      angle = 0
    }
    else if (angle <= 0){
      angle = 359
    }

    if (keys[39]) {     //right
        angle+=5
        $d.css("transform", "rotate("+angle+"deg)")
    }
    else if (keys[37]) { //left
        angle-=5
        $d.css("transform", "rotate("+angle+"deg)")
    }
    if (keys[40]) { //down
        var xloc = parseFloat($d.css('left'));
        var yloc = parseFloat($d.css('top'));
        xloc += Math.cos(angle)
        yloc += Math.sin(angle)
        $d.css("top", yloc + 'px');
        $d.css("left", xloc + 'px');
    }
    else if (keys[38]) { //up
      var xloc = parseFloat($d.css('left'));
      var yloc = parseFloat($d.css('top'));
      xloc += 4*Math.cos(4.8+ angle * Math.PI/180)
      yloc += 4*Math.sin(4.8+ angle * Math.PI/180)
      $d.css("top", yloc + "px");
      $d.css("left", xloc + "px");
    }
 

    setTimeout(gameLoop, 20);
  }
  gameLoop();
    
  $(document).focus();
});