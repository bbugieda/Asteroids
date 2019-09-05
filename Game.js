var change = {
    37: {
      left: "-=1",
      transform: "rotate(270deg)"
    },
  
    38: {
      top: "-=1",
      transform: "rotate(0deg)"
    },
  
    39: {
      left: "+=1",
      transform: "rotate(90deg)"
    },
  
    40: {
      top: "+=1",
      transform: "rotate(180deg)"
    },
  }
  $(document).one("keydown", keyDown)
  
  var going;
  
  function keyDown(e) {
    console.log("down")
    $(document).one("keyup", keyup)
    var animation = change[e.which];
    going = setInterval(keepGoing, 1);
  
    function keepGoing() {
      $(".ball").css(animation)
    }
  
  }
  
  function keyup(e) {
    console.log("up")
    clearInterval(going)
    $(document).one("keydown", keyDown)
  }
  