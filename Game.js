/**
 * Enums for directions
 */
const direction = {
  LEFT: 37,
  RIGHT: 39,
  UP: 38,
  SPACE: 32,
  RESTART: 82
};

let SMALL_ASTEROID_SIZE = 50;
let LARGE_ASTEROID_SIZE = 100;
let TOTAL_ASTEROID_CNT = 0;
let ASTEROID_CNT_LIMIT = 7;

/**
 * Enums for game settings
 */
const game = {
  MAX_SPEED: 7,
  ROTATE_ANGLE: 5,
  DECELERATION: 0.97,
  SMOOTH_ACCELERATION_CONST: 0.05,
  SHIP_HEIGHT: 100,
  SHIP_WIDTH: 100,
  MAX_ASTEROID_CNT: 4,
  SCREEN_WIDTH: screen.width,
  SCREEN_HEIGHT: screen.height
};

let gameStart = false;

$(document).ready(function() {
  unloadScrollBars();
  $("#StartButton").click(function() {
    $("#splashscreen").fadeOut(1000);
    gameStart = true;
    $(".spaceShip").show();
    $("body").show();
    createAsteroidList();
    gameLifes();
    $("#gameLifesDiv").show();
    //gameScore();
    $("#gameScore").show();
  });

  let keys = {}; //dictionary to keep track of key presses
  document.addEventListener("keydown", function(event) {
    if (
      event.keyCode == direction.RIGHT ||
      event.keyCode == direction.LEFT ||
      event.keyCode == direction.SPACE ||
      event.keyCode == direction.UP ||
      event.keyCode == direction.RESTART
    ) {
      keys[event.keyCode] = true;
    }
  });

  document.addEventListener("keyup", function(event) {
    if (
      event.keyCode == direction.RIGHT ||
      event.keyCode == direction.LEFT ||
      event.keyCode == direction.SPACE ||
      event.keyCode == direction.UP ||
      event.keyCode == direction.RESTART
    ) {
      keys[event.keyCode] = false;
    }
  });

  const ship = document.getElementById("spaceShip");
  resetShipPosition();

  function resetShipPosition() {
    ship.style.left = game.SCREEN_WIDTH * 0.5 + "px";
    ship.style.top = game.SCREEN_HEIGHT * 0.5 + "px";
    ship.style.width = 100 + "px";
    ship.style.height = 100 + "px";
  }

  /**
   * populate the screen with asteroids
   * WHEN LAUNCH
   */
  var gameRestart = false;
  function gameOver() {
    gameStart = false;
    gameRestart = true;
    $("#gameOver").show();
    $("#gameOver2").show();
    $(".spaceShip").hide();
    $("#gameLifesDiv").hide();
    $("gameScore").hide();
    $("#asteroidListDiv").hide();
  }

  let lifecount = 4;

  function gameLifes() {
    let lives_img1 = `<img id=${1} class='lifes' src='assets/life_full.png' style='left: ${50}px; top: ${50}px; width: ${30}px; height: ${30}px; padding: ${4}px'>`;
    document.getElementById("gameLifesDiv").innerHTML += lives_img1;
    let lives_img2 = `<img id=${2} class='lifes' src='assets/life_full.png' style='left: ${50}px; top: ${50}px; width: ${30}px; height: ${30}px; padding: ${4}px'>`;
    document.getElementById("gameLifesDiv").innerHTML += lives_img2;
    let lives_img3 = `<img id=${3} class='lifes' src='assets/life_full.png' style='left: ${50}px; top: ${50}px; width: ${30}px; height: ${30}px; padding: ${4}px'>`;
    document.getElementById("gameLifesDiv").innerHTML += lives_img3;
    let lives_img4 = `<img id=${4} class='lifes' src='assets/life_full.png' style='left: ${50}px; top: ${50}px; width: ${30}px; height: ${30}px; padding: ${4}px'>`;
    document.getElementById("gameLifesDiv").innerHTML += lives_img4;
  }

  function updateGameLifes() {
    let lifeList = document.getElementsByClassName("lifes");
    for (let life of lifeList) {
      if (lifecount == 3 && life.id == 4) {
        life.src = "assets/life_empty.png";
      }
      if (lifecount == 2 && life.id == 3) {
        life.src = "assets/life_empty.png";
      }
      if (lifecount == 1 && life.id == 2) {
        life.src = "assets/life_empty.png";
      }
      if (lifecount == 0 && life.id == 1) {
        life.src = "assets/life_empty.png";
      }
    }
  }

  function createAsteroidList() {
    for (let i = 0; i < game.MAX_ASTEROID_CNT; i++) {
      if (TOTAL_ASTEROID_CNT < ASTEROID_CNT_LIMIT) {
        createLargeAsteroid();
      }
    }
  }

  /**
   * createLargeAsteroid()
   * Creates a large asteroid at a random x and y position
   * Create a random angle for the asteroid to move
   */
  function createLargeAsteroid() {
    let randomX = Math.floor(Math.random() * -(game.SCREEN_WIDTH + 1));
    let randomY = Math.floor(Math.random() * -(game.SCREEN_HEIGHT + 1));

    createAsteroid(randomX, randomY, LARGE_ASTEROID_SIZE);
  }

  /**
   * createAsteroid(x, y, SIZE)
   * Creates an asteroid at the specified x and y location and provides a random angle
   * @param {number} x
   * @param {number} y
   * @param {number} SIZE
   */
  function createAsteroid(x, y, SIZE) {
    let randomAngle = Math.floor(Math.random() * 361);
    let divList = "";

    if (SIZE == LARGE_ASTEROID_SIZE) {
      divList = "asteroidListDiv";
    } else {
      divList = "smallAsteroidListDiv";
    }

    let asteroid_img = `<img id=${randomAngle} class='asteroid' src='assets/asteroid.png' style='left: ${x}px; top: ${y}px; width: ${SIZE}px; height: ${SIZE}px'>`;
    document.getElementById(divList).innerHTML += asteroid_img;
    TOTAL_ASTEROID_CNT++;
  }

  /**
   * createSmallAsteroid(x, y)
   * Creates a small asteroid at the provided x and y location and creates a random angle
   * @param {number} x
   * @param {number} y
   */
  function createSmallAsteroid(x, y) {
    createAsteroid(x, y, SMALL_ASTEROID_SIZE);
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
    document.documentElement.style.overflow = "hidden"; // firefox, chrome
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
    let bul_img = `<img id=${ang} class='bullet' src='assets/bullet.png' style='left: ${x +
      60}px; top: ${y +
      20}px; width: ${16}px; height: ${40}px; transform: rotate(${ang}deg)'>`;
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
    velocityX =
      velocityX >= game.MAX_SPEED ? game.MAX_SPEED : velocityX + accelerationX;
    velocityY =
      velocityY >= game.MAX_SPEED ? game.MAX_SPEED : velocityY + accelerationY;

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
      if (
        bullet_x > game.SCREEN_WIDTH ||
        bullet_y < 0 ||
        bullet_y > game.SCREEN_HEIGHT ||
        bullet_y < 0
      ) {
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

  let GAME_SCORE = 0;
  function updateScore() {
    GAME_SCORE++;
    //let lives_img1 = `<img id=${1} class='lifes' src='assets/life_full.png' style='left: ${50}px; top: ${50}px; width: ${30}px; height: ${30}px; padding: ${4}px'>`
    document.getElementById("gameScore").innerHTML = "Score: " + GAME_SCORE;
  }

  /**
   * check if ship or bullets collides with asteroids.
   * If larger asteroid is hit, it will break into three smaller ones.
   */

  function bulletCollisionDetect() {
    let count = 0;
    let asteroidList = document.getElementsByClassName("asteroid");
    for (let asteroid of asteroidList) {
      count++;
      let bList = document.getElementsByClassName("bullet");
      for (let bullet of bList) {
        if (bulletCollide(asteroid, bullet)) {
          // checks the pixel size for the asteroid image (either SMALL or LARGE size)
          let xPos = asteroid.width;
          let yPos = asteroid.height;
          var snd = new Audio("assets/Explosion.m4a");
          if (gameStart) {
            snd.play();
          }
          asteroid.remove();
          TOTAL_ASTEROID_CNT--;
          bullet.remove();
          updateScore();

          if (count < 5) {
            createLargeAsteroid(); //is being called too many times, causes game to lag
          }
          asteroid.remove();
          TOTAL_ASTEROID_CNT--;

          // if the bullet hits a large asteroid, create three smaller ones in its place
          if (
            xPos == LARGE_ASTEROID_SIZE &&
            yPos == LARGE_ASTEROID_SIZE &&
            TOTAL_ASTEROID_CNT <= ASTEROID_CNT_LIMIT
          ) {
            // grabs the x and y location of the large asteroid
            let asteroid_x = parseFloat(asteroid.style.left);
            let asteroid_y = parseFloat(asteroid.style.top);

            splitInto3Asteroids(asteroid_x, asteroid_y);
          }
          // if(bulletCollide(asteroid, bullet)){
          // 	var snd = new Audio("assets/Explosion.m4a");
          // 	snd.play();
          // 	asteroid.remove();
          // 	bullet.remove();
          // 	updateScore();

          // 	createAsteroid();
          // }
        }
      }
    }
  }

  /**
   * splitInto3Asteroids()
   * Creates 3 smaller asteroids at the current x and y position of the larger
   * asteroid that was hit with a bullet
   */
  function splitInto3Asteroids(x, y) {
    createSmallAsteroid(x, y);
    createSmallAsteroid(x, y);
    createSmallAsteroid(x, y);
    TOTAL_ASTEROID_CNT += 3;
  }

  function bulletCollide(asteroid, bullet) {
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
    // console.log(`asteroid_x: ${asteroid_x} asteroid_y: ${asteroid_y} bullet_x: ${bullet_x} bullet_y: ${bullet_y}`);
    // console.log(`asteroid_w: ${asteroid_w} asteroid_h: ${asteroid_h} bullet_w: ${bullet_w} bullet_h: ${bullet_h}`);
    return !(
      asteroid_y + asteroid_h < bullet_y ||
      asteroid_y > bullet_y + bullet_h ||
      asteroid_x + asteroid_w < bullet_x ||
      asteroid_x > bullet_x + bullet_w
    );
  }

  var exp = new Audio("assets/Explosion.m4a");
  var redAlert = new Audio("assets/ShortRedAlert.m4a");
  function shipCollisionDetect() {
    let asteroidList = document.getElementsByClassName("asteroid");
    for (let asteroid of asteroidList) {
      if (shipCollide(asteroid)) {
        // var exp = new Audio("assets/Explosion.m4a");
        if (gameStart) {
          exp.play();
        }
        let asteroid_x = parseFloat(asteroid.style.left);
        let asteroid_y = parseFloat(asteroid.style.top);
        asteroid.remove();
        TOTAL_ASTEROID_CNT--;
        // if (asteroid.SIZE = LARGE_ASTEROID_SIZE) {
        // 	splitInto3Asteroids(asteroid_x, asteroid_y);
        // }
        lifecount--;
        // var redAlert = new Audio("assets/Red-Alert.m4a");
        if (gameStart) {
          redAlert.play();
        }
        // createAsteroid();
      }
    }
  }

  function shipCollide(asteroid) {
    let asteroid_x = parseFloat(asteroid.style.left);
    let asteroid_y = parseFloat(asteroid.style.top);
    let asteroid_w = parseFloat(asteroid.style.width);
    asteroid_w -= 20;
    let asteroid_h = parseFloat(asteroid.style.height);
    asteroid_h -= 20;
    let ship_x = parseFloat(ship.style.left);
    let ship_y = parseFloat(ship.style.top);
    let ship_w = parseFloat(ship.style.width);
    let ship_h = parseFloat(ship.style.height);
    // console.log(`asteroid_x: ${asteroid_x} asteroid_y: ${asteroid_y} bullet_x: ${bullet_x} bullet_y: ${bullet_y}`);
    // console.log(`asteroid_w: ${asteroid_w} asteroid_h: ${asteroid_h} bullet_w: ${bullet_w} bullet_h: ${bullet_h}`);
    return !(
      asteroid_y + asteroid_h < ship_y ||
      asteroid_y > ship_y + ship_h ||
      asteroid_x + asteroid_w < ship_x ||
      asteroid_x > ship_x + ship_w
    );
  }

  function gameLoop() {
    angleCheck();
    areaCheck();

    if (keys[direction.RIGHT] && !gameRestart) {
      angle = angle + game.ROTATE_ANGLE;
      ship.style.transform = "rotate(" + angle + "deg)";
    }
    if (keys[direction.LEFT] && !gameRestart) {
      angle = angle - game.ROTATE_ANGLE;
      ship.style.transform = "rotate(" + angle + "deg)";
    }
    if (keys[direction.SPACE] && gameStart && !gameRestart) {
      if (!locked) {
        locked = true;
        var snd = new Audio("assets/Blast.mp3");
        snd.play();
        let xloc = parseFloat(ship.style.left);
        let yloc = parseFloat(ship.style.top);
        fireBullet(xloc, yloc, angle);
        setTimeout(function() {
          locked = false;
        }, 250);
      }
    }
    if (keys[direction.UP] && !gameRestart) {
      accelerationX =
        game.SMOOTH_ACCELERATION_CONST *
        Math.cos(4.8 + (angle * Math.PI) / 180);
      accelerationY =
        game.SMOOTH_ACCELERATION_CONST *
        Math.sin(4.8 + (angle * Math.PI) / 180);
    }
    if (!keys[direction.UP] && !gameRestart) {
      // deceleration
      velocityX *= game.DECELERATION;
      velocityY *= game.DECELERATION;
    }
    if (keys[direction.RESTART] && gameRestart) {
      location.reload();
    }

    updateGameLifes();
    shipCollisionDetect();
    bulletCollisionDetect();
    //updateGameScore();
    updatePosition();
    updateBullets();
    updateAsteroids();

    if (lifecount == 0) {
      gameOver();
    }
    requestAnimationFrame(gameLoop);
  }
  gameLoop();
});
