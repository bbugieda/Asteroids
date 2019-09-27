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
	SMOOTH_ACCELERATION_CONST: 0.05,
	SHIP_HEIGHT: 100,
	SHIP_WIDTH: 100,
	MAX_ASTEROID_CNT: 10,
	SCREEN_WIDTH: screen.width,
	SCREEN_HEIGHT: screen.height,
}

$(document).ready(function () {
	unloadScrollBars();
	$("#StartButton").click(function () {
		$("#splashscreen").fadeOut(1000);
		$(".spaceShip").show();
		$("body").show();
		createAsteroidList();
	});

	let keys = {}; //dictionary to keep track of key presses
	document.addEventListener("keydown", function (event) {
		if (event.keyCode == direction.RIGHT || event.keyCode == direction.LEFT || event.keyCode == direction.SPACE || event.keyCode == direction.UP) {
			keys[event.keyCode] = true;
		}
	});

	document.addEventListener("keyup", function (event) {
		if (event.keyCode == direction.RIGHT || event.keyCode == direction.LEFT || event.keyCode == direction.SPACE || event.keyCode == direction.UP) {
			keys[event.keyCode] = false;
		}
	});

	const ship = document.getElementById("spaceShip");
	resetShipPosition();

	function resetShipPosition() {
		ship.style.left = (game.SCREEN_WIDTH * 0.5) + "px";
		ship.style.top = (game.SCREEN_HEIGHT * 0.5) + "px";
	}

	/**
	 * populate the screen with asteroids
	 * WHEN LAUNCH
	 */

	function createAsteroidList() {
		for (let i = 0; i < game.MAX_ASTEROID_CNT; i++) {
			createAsteroid();
		}
	}

	function createAsteroid() {
		let randomAngle = 0;
		let randomX = 0;
		let randomY = 0;

		randomAngle = Math.floor(Math.random() * 361);
		randomX = -1 * Math.random(); //Math.floor(Math.random() * (game.SCREEN_WIDTH + 1));
		randomY = -1 * Math.random(); //Math.floor(Math.random() * (game.SCREEN_HEIGHT + 1));

		let asteroid_img = `<img id=${randomAngle} class='asteroid' src='assets/asteroid.png' style='left: ${randomX}px; top: ${randomY}px; width: ${100}px; height: ${100}px'>`
		document.getElementById("asteroidListDiv").innerHTML += asteroid_img;
	}

	let angle = 0;
	let accelerationX = 0;
	let accelerationY = 0;
	let velocityX = 0;
	let velocityY = 0;

	let bulletCount = 0;
	/**
	 * check for ship going out of screen 
	 */
	function areaCheck() {
		let xloc = parseFloat(ship.style.left);
		let yloc = parseFloat(ship.style.top);

		if (xloc > game.SCREEN_WIDTH) {
			ship.style.left = -game.SHIP_WIDTH + "px";
		} else if (xloc < -game.SHIP_WIDTH) {
			ship.style.left = game.SCREEN_WIDTH + "px";
		}
		if (yloc > game.SCREEN_HEIGHT - 50) {
			ship.style.top = -game.SHIP_HEIGHT + "px";
		} else if (yloc < -game.SHIP_HEIGHT) {
			ship.style.top = game.SCREEN_HEIGHT + -game.SHIP_HEIGHT + "px";
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

	/**
	 * remove scrollbar
	 */
	function unloadScrollBars() {
		document.documentElement.style.overflow = 'hidden';  // firefox, chrome
		document.body.scroll = "no"; // ie only
	}

	/**
	 * create an instance of bullet
	 * and display it dynamically
	 * @param {number} x coordinate
	 * @param {number} y coordinate
	 * @param {number} ang - angle to be fire
	 */
	function fireBullet(x, y, ang) {
		bulletCount++;
		let bul_img = `<img id=${ang} class='bullet' src='assets/bullet.png' style='left: ${x + 60}px; top: ${y + 20}px; width: ${16}px; height: ${40}px; transform: rotate(${ang}deg)'>`
		document.getElementById("bulletListDiv").innerHTML += bul_img;
	}

	let locked = false;

	/**
	 * update position of space ship based on 
	 * acceleration and velocity
	 */
	function updatePosition() {
		let xloc = parseFloat(ship.style.left);
		let yloc = parseFloat(ship.style.top);

		// enforce speed limit
		velocityX = (velocityX >= game.MAX_SPEED) ? game.MAX_SPEED : velocityX + accelerationX;
		velocityY = (velocityY >= game.MAX_SPEED) ? game.MAX_SPEED : velocityY + accelerationY;

		xloc += velocityX;
		yloc += velocityY;
		ship.style.left = xloc + "px";
		ship.style.top = yloc + "px";
	}

	/**
	 * update positions of fired bullets
	 */
	function updateBullets() {
		let bList = document.getElementsByClassName("bullet");
		for (let bullet of bList) {
			const angle = bullet.id;
			let bullet_x = parseFloat(bullet.style.left);
			let bullet_y = parseFloat(bullet.style.top);
			bullet_x += 10 * Math.cos(((angle - 90) * Math.PI) / 180);
			bullet_y += 10 * Math.sin(((angle - 90) * Math.PI) / 180);
			bullet.style.left = bullet_x + "px";
			bullet.style.top = bullet_y + "px";
			if (bullet_x > game.SCREEN_WIDTH || bullet_y < 0 || bullet_y > game.SCREEN_HEIGHT || bullet_y < 0) {
				bullet.remove();
			}
		}
	}

	/**
	 * update positions of moving asteroids
	 */
	function updateAsteroids() {
		let asteroidList = document.getElementsByClassName("asteroid");
		for (let asteroid of asteroidList) {
			const angle = asteroid.id;
			let asteroid_x = parseFloat(asteroid.style.left);
			let asteroid_y = parseFloat(asteroid.style.top);
			asteroid_x += 3 * Math.cos(((angle - 90) * Math.PI) / 180);
			asteroid_y += 3 * Math.sin(((angle - 90) * Math.PI) / 180);
			asteroid.style.left = asteroid_x + "px";
			asteroid.style.top = asteroid_y + "px";

			if (asteroid_x > game.SCREEN_WIDTH) {
				asteroid.style.left = "0px";
			} else if (asteroid_x < 0) {
				asteroid.style.left = game.SCREEN_WIDTH + "px";
			}
			if (asteroid_y > game.SCREEN_HEIGHT) {
				asteroid.style.top = "0px";
			} else if (asteroid_y < 0) {
				asteroid.style.top = game.SCREEN_HEIGHT + "px";
			}

			// if (asteroid_x > game.SCREEN_WIDTH || asteroid_y < 0 || asteroid_y > game.SCREEN_HEIGHT || asteroid_x < 0) {
			// 	asteroid.remove();
			// 	createAsteroid();
			// }
		}
	}

	/**
	 * check if ship or bullets collides with asteroids
	 */
	function collisionDetect() {
		let asteroidList = document.getElementsByClassName("asteroid");
		for (let asteroid of asteroidList) {
			let bList = document.getElementsByClassName("bullet");
			for (let bullet of bList) {
				if(isCollide(asteroid, bullet)){
					asteroid.remove();
					// createAsteroid();
				}
	}
}
	}

	function isCollide(asteroid, bullet) {
		let asteroid_x = parseFloat(asteroid.style.left);
		let asteroid_y = parseFloat(asteroid.style.top);
		let asteroid_w = parseFloat(asteroid.style.width);
		asteroid_w -= 20;
		let asteroid_h = parseFloat(asteroid.style.height);
		asteroid_h -= 20;
		let bullet_x = parseFloat(bullet.style.left);
		let bullet_y = parseFloat(bullet.style.top);
		let bullet_w = parseFloat(bullet.style.width);
		let bullet_h = parseFloat(bullet.style.height);
		console.log(`asteroid_x: ${asteroid_x} asteroid_y: ${asteroid_y} bullet_x: ${bullet_x} bullet_y: ${bullet_y}`);
		console.log(`asteroid_w: ${asteroid_w} asteroid_h: ${asteroid_h} bullet_w: ${bullet_w} bullet_h: ${bullet_h}`);
		return !(
			((asteroid_y + asteroid_h) < (bullet_y)) ||
			(asteroid_y > (bullet_y + bullet_h)) ||
			((asteroid_x + asteroid_w) < bullet_x) ||
			(asteroid_x > (bullet_x + bullet_w))
		);
	}



	function gameLoop() {
		angleCheck();
		areaCheck();

		if (keys[direction.RIGHT]) {
			angle = angle + game.ROTATE_ANGLE;
			ship.style.transform = "rotate(" + angle + "deg)";
		}
		if (keys[direction.LEFT]) {
			angle = angle - game.ROTATE_ANGLE;
			ship.style.transform = "rotate(" + angle + "deg)";
		}
		if (keys[direction.SPACE]) {
			if (!locked) {
				locked = true;
				var snd = new Audio("assets/Blast.mp3");
				snd.play();
				let xloc = parseFloat(ship.style.left);
				let yloc = parseFloat(ship.style.top);
				fireBullet(xloc, yloc, angle);
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
		collisionDetect();
		updatePosition();
		updateBullets();
		updateAsteroids();
		requestAnimationFrame(gameLoop);
	}
	gameLoop();
});
