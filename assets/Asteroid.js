class Asteroid {
    constructor(x, y, heading, velocity, size) {
        this.x = x;
        this.y = y;
        this.heading = heading;
        this.velocity = velocity;
        this.size = size;
    }
}

class AsteroidField {
    constructor() {
        this.asteroidSizes = [8, 16, 32];
        this.nAsteroids = 10;
        this.asteroids = [];
        this.asteroidsPerSplit = 3;
        this.minVelocity = 5;
        this.maxVelocity = 30;
        
        for (let i = 0; i < this.nAsteroids; i++) {
            this.asteroids.push(this.createRandomAsteroid());
        }
    }

    
    createRandomAsteroid() {
        let xPos = Math.random() * game.width;
        let yPos = Math.random() * game.height;
        let size = this.asteroidSizes[Math.floor(Math.random() * this.asteroidSizes.length)];
        let velocity = this.minVelocity + (Math.random() * (this.maxVelocity - this.minVelocity));
        let heading = Math.random() * 360;
        return new Asteroid(xPos, yPos, heading, velocity, size);
    }
}