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

	let $ship = $(".spaceShip");
	let angle = 0;
	let accelerationX = 0;
	let accelerationY = 0;
	let velocityX = 0;
	let velocityY = 0;

	$(window).height();
	$(window).width();
	let bulletCount = 0;

	/**
	 * check for ship going out of screen 
	 */
	function areaCheck() {
		let screeny = $(window).height();
		let screenx = $(window).width();
		let xloc = parseFloat($ship.css("left"));
		let yloc = parseFloat($ship.css("top"));

		if (xloc > screenx) {
			$ship.css("left", 0 + "px");
		}
		if (yloc > screeny) {
			$ship.css("top", 0 + "px");
		}
		if (xloc < 0) {
			$ship.css("left", screenx + "px");
		}
		if (yloc < 0) {
			$ship.css("top", screeny + "px");
		}
	}

	function fireBullet(x, y, ang) {
		bulletCount++;
		let t = $("body").append(
			$("<img src='assets/bullet.png'>")
				.addClass("bullet")
				.css({ left: x + 60, top: y + 20 })
		);
		t.attr("id", bulletCount);
		let bull = new Bullet(x, y, ang);
		return bull;
	}

	function Bullet(x, y, ang) {
		// `this` is the instance which is currently being created

		this.xloc = x;
		this.yloc = y;
		this.angle = ang;
		return this;
		// No need to return, but you can use `return this;` if you want
	}

	function update(bull) {
		$("[class^='bullet']").each(function () {
			bull.xval += 7 * Math.cos(((bull.angle - 90) * Math.PI) / 180);
			bull.yval += 7 * Math.sin(((bull.angle - 90) * Math.PI) / 180);
			$(this).css("left", bull.xval + "px");
			$(this).css("top", bull.yval + "px");
		});
	}

	let locked = false;

	/**
	 * update position of space ship based on 
	 * acceleration and velocity
	 */
	function updatePosition() {
		let xloc = parseFloat($ship.css("left"));
		let yloc = parseFloat($ship.css("top"));

		// maximum x velocity
		if (velocityX >= game.MAX_SPEED) {
			velocityX = game.MAX_SPEED;
		} else {
			velocityX += accelerationX;
		}

		// maximum y velocity
		if (velocityY >= game.MAX_SPEED) {
			velocityY = game.MAX_SPEED;
		} else {
			velocityY += accelerationY;
		}

		xloc += velocityX;
		yloc += velocityY;
		$ship.css("top", yloc + "px");
		$ship.css("left", xloc + "px");
	}

	function gameLoop() {
		areaCheck();
		if (keys[direction.RIGHT]) {
			angle = (angle + game.ROTATE_ANGLE) % 360;
			$ship.css("transform", "rotate(" + angle + "deg)");
		}
		if (keys[direction.LEFT]) {
			angle = (angle - game.ROTATE_ANGLE) % 360;
			$ship.css("transform", "rotate(" + angle + "deg)");
		}
		if (keys[direction.SPACE]) {
			if (!locked) {
				locked = true;

				let xloc = parseFloat($ship.css("left"));
				let yloc = parseFloat($ship.css("top"));

				let bull = fireBullet(xloc, yloc, angle);
				update(bull);

				// let i = setInterval(update(bull), 50);
				// setTimeout(function () {
				// 	clearInterval(i);
				// }, 5000);
				setTimeout(function () {
					locked = false;
				}, 250);
			}
		}
		if (keys[direction.UP]) {
			accelerationX = 0.03 * Math.cos(4.8 + (angle * Math.PI) / 180);
			accelerationY = 0.03 * Math.sin(4.8 + (angle * Math.PI) / 180);
		}
		if (!keys[direction.UP]) {
			// deceleration
			velocityX *= game.DECELERATION;
			velocityY *= game.DECELERATION;
		}
		updatePosition();

		requestAnimationFrame(gameLoop);
	}

	gameLoop();

	$(document).focus();
});
