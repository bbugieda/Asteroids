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
  $(document).on({
    keydown: keydown,
    keyup: keyup
  })
  
  var movement = []
  
  function keydown(e) {
    var key = e.which
    var animation = change[key];
    if (!movement[key]) { // watch out for repeating keys!
      movement[key] = setInterval(keepGoing, 1)
    }
    //  console.log("down", key, movement[key])
    function keepGoing() {
      $(".ball").css(animation)
    }
  
  }
  
  function keyup(e) {
    var key = e.which
    movement[key] = clearInterval(movement[key])
      //  console.log("up", key, movement[key])
  }  