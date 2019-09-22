
$(document).ready(function() {
	$("#StartButton").click(function () {
		$("#splashscreen").fadeOut(1000);
		$(".spaceShip").show();
		$("body").show();
	});
	var keys = {};
	$(document)
		.keydown(function (event) {
			if (event.which == 39 || event.which == 37 || event.which == 32 || event.which == 38) {
				keys[event.which] = true;
			}
		})
		.keyup(function (event) {
			if (event.which == 39 || event.which == 37 || event.which == 32 || event.which == 38) {
				keys[event.which] = false;
			}
		});

	var $ship = $(".spaceShip");
	var angle = 0;
	var accelerationX = 0;
	var accelerationY = 0;
	var velocityX = 0;
	var velocityY = 0;

	$(window).height();
	$(window).width();
	var checkTime = 0;
	var bulletCount = 0;
	var currentTime = new Date();

	function areaCheck() {
		var screeny = $(window).height();
		var screenx = $(window).width();
		var xloc = parseFloat($ship.css("left"));
		var yloc = parseFloat($ship.css("top"));

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
		var t = $("body").append(
			$("<img src='assets/bullet.png'>")
				.addClass("bullet")
				.css({ left: x + 60, top: y + 20 })
		);
		t.attr("id", bulletCount);
		var bull = new Bullet(x, y, ang);
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

	var locked = false;

	function updatePosition() {
		var xloc = parseFloat($ship.css("left"));
		var yloc = parseFloat($ship.css("top"));
		
		// maximum x velocity
		if (velocityX >= 7) {
			velocityX = 7;
		} else {
			velocityX += accelerationX;
		}

		// maximum y velocity
		if (velocityY >= 7) {
			velocityY = 7;
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
		if (keys[39]) {
			//right
			angle = (angle + 5) % 360;
			$ship.css("transform", "rotate(" + angle + "deg)");
		}
		if (keys[37]) {
			//left
			angle = (angle - 5) % 360;
			$ship.css("transform", "rotate(" + angle + "deg)");
		}
		if (keys[32]) {
			//space
			if (!locked) {
				locked = true;

				var xloc = parseFloat($ship.css("left"));
				var yloc = parseFloat($ship.css("top"));

				var bull = fireBullet(xloc, yloc, angle);
				update(bull);

				// var i = setInterval(update(bull), 50);
				// setTimeout(function () {
				// 	clearInterval(i);
				// }, 5000);
				setTimeout(function () {
					locked = false;
				}, 250);
			}
		}
		if (keys[38]) {
			//up
			accelerationX = 0.03 * Math.cos(4.8+(angle * Math.PI) / 180);
			accelerationY = 0.03 * Math.sin(4.8+(angle * Math.PI) / 180);
		}
		if (!keys[38]) {
			// deceleration
			velocityX *= 0.98;
			velocityY *= 0.98;
		}
		updatePosition();

		requestAnimationFrame(gameLoop);
	}

	gameLoop();

	$(document).focus();
});
