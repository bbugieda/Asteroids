/**
 * Enums for directions
 */
const direction = {
	LEFT: 37,
	RIGHT: 39,
	UP: 38,
	SPACE: 32,
}

/**
 * Enums for game settings
 */
const game = {
	MAX_SPEED: 7,
	ROTATE_ANGLE: 5,
	DECELERATION: 0.98,
	SMOOTH_ACCELERATION_CONST: 0.03,
  SHIP_RADIUS: 20,
  ASTEROID_RADIUS: 20,
}

$(document).ready(function () {
	$("#StartButton").click(function () {
		$("#splashscreen").fadeOut(1000);
		$(".spaceShip").show();
		$("body").show();
	});

	let keys = {}; //dictionary to keep track of key presses
	$(document)
		.keydown(function (event) {
			if (event.which == direction.RIGHT || event.which == direction.LEFT || event.which == direction.SPACE || event.which == direction.UP) {
				keys[event.which] = true;
			}
		})
		.keyup(function (event) {
			if (event.which == direction.RIGHT || event.which == direction.LEFT || event.which == direction.SPACE || event.which == direction.UP) {
				keys[event.which] = false;
			}
		});

  const $ship = $(".spaceShip");
  const $asteroid = $(".test");
  console.log($asteroid);

	let angle = 0;
	let accelerationX = 0;
	let accelerationY = 0;
	let velocityX = 0;
	let velocityY = 0;

	let bulletCount = 0;
	const screeny = $(window).height();
  const screenx = $(window).width();
  
  let maxAsteroidCount = 1;
  let asteroidCount = 0;
  let asteroidXLoc = 0;
  let asteroidYLoc = 0;
  let asteroidAngle = 0;

  
  function unloadScrollBars() {
    document.documentElement.style.overflow = 'hidden';  // firefox, chrome
    document.body.scroll = "no"; // ie only
}


	/**
	 * check for ship going out of screen 
	 */
	function areaCheck() {
		let xloc = parseFloat($ship.css("left"));
    let yloc = parseFloat($ship.css("top"));
    
		if (xloc > screenx) {
			$ship.css("left", 0 + "px");
		} else if (xloc < 0) {
			$ship.css("left", screenx + "px");
		}
		if (yloc > screeny) {
			$ship.css("top", 0 + "px");
		} else if (yloc < 0) {
			$ship.css("top", screeny + "px");
    }
  }
  
  function asteroidAreaCheck(){
    let asteroidXLoc = parseFloat($asteroid.css("left"));
    let asteroidYLoc = parseFloat($asteroid.css("top"));
    

    if (asteroidXLoc > screenx ) {
			$asteroid.css("left", 0 + "px");
		} else if (asteroidXLoc < 0) {
			$asteroid.css("left", screenx + "px");
		}
		if (asteroidYLoc > screeny) {
			$asteroid.css("top", 0 + "px");
		} else if (asteroidYLoc < 0) {
			$asteroid.css("top", screeny + "px");
		}
  }

	/**
	 * adjust angle accordingly
	 */
	function angleCheck() {
		if (angle > 360) {
			angle = 0;
		} 
		if (angle < 0) {
			angle = 360;
		}
	}

	function fireBullet(x, y, ang) {
		bulletCount++;
		let bull = $("#bulletList").append(
			$("<li " + "id=" + bulletCount + "-" + ang + ">").append(
				$("<img src='assets/bullet.png'>")
					.addClass("bullet")
					.css({ left: x + 60, top: y + 20, "transform": "rotate(" + ang + "deg)" })
			));
  }

    function createAsteroid(x, y, ang) {
    asteroidCount++;
		let asteroid = $("#asteroidList").append(
			$("<li " + "class=test " + "id=" + asteroidCount + "-" + ang + ">").append(
				$("<img src='assets/asteroid.png'>")
					.addClass("asteroid")
					.css({ left: x + 60, top: y + 20, "transform": "rotate(" + ang + "deg)" })
      ));
      console.log({asteroidList});
  }
  
	let locked = false;
	let locked1 = false;

	/**
	 * update position of space ship based on 
	 * acceleration and velocity
	 */
	function updatePosition() {
		let xloc = parseFloat($ship.css("left"));
		let yloc = parseFloat($ship.css("top"));

		// enforce speed limit
		velocityX = (velocityX >= game.MAX_SPEED) ? game.MAX_SPEED : velocityX + accelerationX;
		velocityY = (velocityY >= game.MAX_SPEED) ? game.MAX_SPEED : velocityY + accelerationY;

		xloc += velocityX;
		yloc += velocityY; 
		$ship.css("top", yloc + "px");
		$ship.css("left", xloc + "px");
	}

	/**
	 * update positions of fired bullets
	 */
	function updateBullets() {
		// const sy = $(window).height();
		// const sx = $(window).width();
		$("li").each(function(){
			let bul = $(this);
			const bul_angle = bul.attr("id");
			const angle = bul_angle.split("-")[1];
			let bul_x = parseFloat(bul.children().css("left"));
			let bul_y = parseFloat(bul.children().css("top"));
			bul_x += 10 * Math.cos(((angle - 90) * Math.PI) / 180);
			bul_y += 10 * Math.sin(((angle - 90) * Math.PI) / 180);
			bul.children().css("top", bul_y + "px");
			bul.children().css("left", bul_x + "px");
 
			if (bul_x > screenx || bul_x < 0 || bul_y > screeny || bul_y < 0) {
        ///bul_x = (-(bul_x));
        //bul_y = (-(bul_y));
        bul.remove();
			}
		});
  }

  function updateAsteroids(){
    $("li").each(function(){
      let asteroid = $(this);
      const asteroid_angle = asteroid.attr("id");
      const angle = asteroid_angle.split("-")[1];
      let asteroid_x = parseFloat(asteroid.children().css("left"));
			let asteroid_y = parseFloat(asteroid.children().css("top"));
			asteroid_x += 3 * Math.cos(((angle - 90) * Math.PI) / 180);
			asteroid_y += 3 * Math.sin(((angle - 90) * Math.PI) / 180);
			asteroid.children().css("top", asteroid_y + "px");
      asteroid.children().css("left", asteroid_x + "px");

      /*
      if (asteroid_x > screenx){
        asteroid_x -= screenx;
      }
      
      if(asteroid_x < 0){
        asteroid_x += screenx;
      } 

      if(asteroid_y > screeny) {
        asteroid_y -= screeny;
      }

      if(asteroid_y < 0){
        asteroid_y += screeny;
      }
      */
      
      
    });
  }

	function gameLoop() {
		angleCheck();
    areaCheck();
    
    asteroidAreaCheck();
    unloadScrollBars();
<<<<<<< HEAD
	if(!locked1){
		locked1=true;
	createAsteroid(Math.random()*screenx, Math.random()*screeny,Math.random()*360);
	setTimeout(function () {
		locked1 = false;
	}, 250);
}
=======


    if(asteroidCount<maxAsteroidCount){
      createAsteroid(Math.random()*screenx, Math.random()*screeny,Math.random()*360);
    }
    
>>>>>>> 2003810f41329db147a0de2ff70eb282c6a57b30

    /*
        if (asteroidCount != maxAsteroidCount){
      createAsteroid(Math.random()*screenx, Math.random()*screeny,Math.random()*360);
    }
    */

		if (keys[direction.RIGHT]) {
			angle = angle + game.ROTATE_ANGLE;
			$ship.css("transform", "rotate(" + angle + "deg)");
		}
		if (keys[direction.LEFT]) {
			angle = angle - game.ROTATE_ANGLE;
			$ship.css("transform", "rotate(" + angle + "deg)");
		}
		if (keys[direction.SPACE]) {
			if (!locked) {
				locked = true;
				var snd = new Audio("assets/Blast.mp3");
				snd.play();
				let xloc = parseFloat($ship.css("left"));
				let yloc = parseFloat($ship.css("top"));
        fireBullet(xloc, yloc, angle);
        //moveAsteroid(xloc, yloc, angle);

				setTimeout(function () {
					locked = false;
				}, 250);
			}
		}
		if (keys[direction.UP]) {
			accelerationX = game.SMOOTH_ACCELERATION_CONST * Math.cos(4.8 + (angle * Math.PI) / 180);
			accelerationY = game.SMOOTH_ACCELERATION_CONST * Math.sin(4.8 + (angle * Math.PI) / 180);
		}
		if (!keys[direction.UP]) {
			// deceleration
			velocityX *= game.DECELERATION;
			velocityY *= game.DECELERATION;
		}
		updatePosition();
    updateBullets();
    updateAsteroids();
    requestAnimationFrame(gameLoop);
    

	}

	gameLoop();
	$(document).focus();
});
