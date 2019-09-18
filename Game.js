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
      for (i = 0; i < 1; i++) {
        $(".ball").css(animation)
      }
      
    }
  
  }
  
  function keyup(e) {
    var key = e.which
    movement[key] = clearInterval(movement[key])
      //  console.log("up", key, movement[key])
  }  

  var v = $('<div class="asteroid"></div>').appendto('#screen')
  

class Asteroid {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.velX = (Math.random() * (1 - (-1) + 1) + 1);
    this.velY = (Math.random() * (1 - (-1) + 1) + 1);
    this.radius = 0;
    this.create = function (x, y, radius) {
      this.x = x;
      this.y = y;
      this.radius = (Math.random() * (50 - 25 + 1) + 1);
    };
  }

  addAsteroid(x, y, radius) {
    var asteroid = new asteroid();
    asteroid.create(x, y, radius);
  }
}

  