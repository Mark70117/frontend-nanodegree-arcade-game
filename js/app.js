// *global* comment to avoid jshint warning about use of following variables
/*global
    ctx, document, Resources
*/

// game configuration, constant values, should not change during course of game
var ENV_PLAYER_START = {
    x: 200,
    y: 400,
    xStep: 100,
    yStep: 85
};
var ENV_WALLS = {
    left: 0,
    right: 400,
    top: 0,
    bottom: 400
};
var ENV_ENEMY = {
    startX: -50,
    maxX: 550,
    minVelocity: 65,
    maxVelocity: 135,
    xCaptureDistance: 75,
    yCaptureDistance: 5
};
var ENV_ROAD = [ 60, 145, 230];

// global variable
var player;
var allEnemies = [];


// -- Class definitions

// Base class for Enemy and Player
var MovingPiece = function (initialX, initialY, sprite) {
    'use strict';

    this.x = initialX;
    this.y = initialY;
    this.sprite = sprite;
};

MovingPiece.prototype.render = function () {
    'use strict';
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};

// Enemy class
//      Enemies our player must avoid
var Enemy = function (initialX, initialY) {
    'use strict';

    MovingPiece.call(this, initialX, initialY, 'images/enemy-bug.png');
    this.xVelocity = this.randomVelocity();
};
Enemy.prototype = Object.create(MovingPiece.prototype);
Enemy.prototype.constructor = MovingPiece;

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    'use strict';

    if (this.x > ENV_ENEMY.maxX) {
        this.x = ENV_ENEMY.startX;
        this.y = this.randomRoad();
        this.xVelocity = this.randomVelocity();
    } else {
        this.x += this.xVelocity * dt;
    }
    this.checkWin();
};

// Enemy win when close to player; on same track and within distance specified in game config
//    enemy within capture distance forces player to return to start.
Enemy.prototype.checkWin = function () {
    'use strict';

    if ((Math.abs(this.y - player.y) <= ENV_ENEMY.yCaptureDistance) &&
        (Math.abs(this.x - player.x) <= ENV_ENEMY.xCaptureDistance) ){
        player.returnStart();
    }
};

// generates a random velocity between min and max velocity
Enemy.prototype.randomVelocity = function () {
    'use strict';

    return Math.floor((Math.random() * (ENV_ENEMY.maxVelocity - ENV_ENEMY.minVelocity)) + ENV_ENEMY.minVelocity);
};

// generates a random road for enemy to travel
Enemy.prototype.randomRoad = function () {
    'use strict';

    return ENV_ROAD[Math.floor(Math.random() * ENV_ROAD.length)];
};


// Player class
var Player = function () {
    'use strict';

    MovingPiece.call(this, ENV_PLAYER_START.x, ENV_PLAYER_START.y, 'images/char-boy.png');
    this.deltaX = 0;
    this.deltaY = 0;
};
Player.prototype = Object.create(MovingPiece.prototype);
Player.prototype.constructor = MovingPiece;

// any specified change in player position is actually made
//   Math.min and Math.max are used to keep player within boundaries of game
Player.prototype.update = function () {
    'use strict';

    this.x = Math.max(ENV_WALLS.left, Math.min(ENV_WALLS.right, this.x + ENV_PLAYER_START.xStep * this.deltaX));
    this.y = Math.max(ENV_WALLS.top, Math.min(ENV_WALLS.bottom, this.y + ENV_PLAYER_START.yStep * this.deltaY));
    this.deltaX = 0;
    this.deltaY = 0;
    this.checkWin();
};

Player.prototype.handleInput = function (key) {
    'use strict';

    this.deltaX = 0;
    this.deltaY = 0;
    switch (key) {
    case 'left':
        this.deltaX = -1;
        break;
    case 'right':
        this.deltaX = 1;
        break;
    case 'up':
        this.deltaY = -1;
        break;
    case 'down':
        this.deltaY = 1;
        break;
        // no default action required
    }
};

// player returns to start after player or enemy win
Player.prototype.returnStart = function () {
    'use strict';

    this.x = ENV_PLAYER_START.x;
    this.y = ENV_PLAYER_START.y;
};

// player wins when reached top (river)
Player.prototype.checkWin =  function () {
    'use strict';

    if (this.y === ENV_WALLS.top) {
        this.returnStart();
        // player need more challenge, add enemy on each win.
        //   start off screen to right, so randomized and restarted on left
        allEnemies.push (new Enemy(ENV_ENEMY.maxX, 0));
    }
};


// -- initial configuration
//
//   one enemy per path
allEnemies.push (new Enemy(ENV_ENEMY.startX, ENV_ROAD[0]));
allEnemies.push (new Enemy(ENV_ENEMY.startX, ENV_ROAD[1]));
allEnemies.push (new Enemy(ENV_ENEMY.startX, ENV_ROAD[2]));

// on player
player = new Player();


// Event Listeners

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    'use strict';

    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
