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
	resetShipPosition();

	function resetShipPosition() {
		$ship.css("top", screen.height * 0.5 + "px");
		$ship.css("left", screen.width * 0.5 + "px");
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

	let asteroidCount = 0;
	function createAsteroid() {
		let randomAngle = 0;
		let randomX = 0;
		let randomY = 0;

		randomAngle = Math.floor(Math.random() * 361);
		randomX = Math.floor(Math.random() * (screen.width + 1));
		randomY = Math.floor(Math.random() * (screen.height + 1));

		$("#asteroidListDiv").append(
			$("<img " + "id=" + randomAngle + " src='assets/asteroid.png'>")
				.addClass("asteroid")
				.css({ left: randomX, top: randomY })
		);

		asteroidCount++;
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
		let xloc = parseFloat($ship.css("left"));
		let yloc = parseFloat($ship.css("top"));

		if (xloc > screen.width) {
			$ship.css("left", -game.SHIP_WIDTH + "px");
		} else if (xloc < -game.SHIP_WIDTH) {
			$ship.css("left", screen.width + "px");
		}
		if (yloc > screen.height - 50) {
			$ship.css("top", -game.SHIP_HEIGHT + "px");
		} else if (yloc < -game.SHIP_HEIGHT) {
			$ship.css("top", screen.height + -game.SHIP_HEIGHT + "px");
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
		$("#bulletListDiv").append(
			$("<img " + "id=" + ang + " src='assets/bullet.png'>")
				.addClass("bullet")
				.css({ left: x + 60, top: y + 20, "transform": "rotate(" + ang + "deg)" })
		);
	}

	let locked = false;

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
		$("img.bullet").each(function () {
			let bul = $(this);
			const angle = bul.attr("id");
			let bul_x = parseFloat(bul.css("left"));
			let bul_y = parseFloat(bul.css("top"));
			bul_x += 10 * Math.cos(((angle - 90) * Math.PI) / 180);
			bul_y += 10 * Math.sin(((angle - 90) * Math.PI) / 180);
			bul.css("top", bul_y + "px");
			bul.css("left", bul_x + "px");

			if (bul_x > screen.width || bul_y < 0 || bul_y > screen.height || bul_y < 0) {
				bul.remove();
			}
		});
	}

	/**
	 * update positions of moving asteroids
	 */
	function updateAsteroids() {
		$("img.asteroid").each(function () {
			let asteroid = $(this);
			const angle = asteroid.attr("id");
			let asteroid_x = parseFloat(asteroid.css("left"));
			let asteroid_y = parseFloat(asteroid.css("top"));
			asteroid_x += 3 * Math.cos(((angle - 90) * Math.PI) / 180);
			asteroid_y += 3 * Math.sin(((angle - 90) * Math.PI) / 180);
			asteroid.css("top", asteroid_y + "px");
			asteroid.css("left", asteroid_x + "px");

			if (asteroid_x > screen.width) {
				asteroid.css("left", 0 + "px");
			} else if (asteroid_x < 0) {
				asteroid.css("left", screen.width + "px");
			}
			if (asteroid_y > screen.height) {
				asteroid.css("top", 0 + "px");
			} else if (asteroid_y < 0) {
				asteroid.css("top", screen.height + "px");
			}
		});
	}

	/**
	 * check if ship or bullets collides with asteroids
	 */
	function collisionDetect() {
		// TODO
	}

	// let score = 0;
	// function incrementScore() {
	// 	score++;
	// }

	// let $score = $("#score");
	// function updateScore(score) {
	// 	$score.text(score);
	// }


	function gameLoop() {
		angleCheck();
		areaCheck();

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
