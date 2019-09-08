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
  var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext("2d");

canvas.width = canvas.height = 300;

var x = 150,
    y = 150,
    velY = 0,
    velX = 0,
    speed = 2,
    friction = 0.98,
    keys = [];

function update() {
    requestAnimationFrame(update);
    
    if (keys[38]) {
        if (velY > -speed) {
            velY--;
        }
    }
    
    if (keys[40]) {
        if (velY < speed) {
            velY++;
        }
    }
    if (keys[39]) {
        if (velX < speed) {
            velX++;
        }
    }
    if (keys[37]) {
        if (velX > -speed) {
            velX--;
        }
    }

    velY *= friction;
    y += velY;
    velX *= friction;
    x += velX;

    if (x >= 295) {
        x = 295;
    } else if (x <= 5) {
        x = 5;
    }

    if (y > 295) {
        y = 295;
    } else if (y <= 5) {
        y = 5;
    }

    ctx.clearRect(0, 0, 300, 300);
    ctx.beginPath();
    ctx.
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
}

update();

document.body.addEventListener("keydown", function (e) {
    keys[e.keyCode] = true;
});
document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});