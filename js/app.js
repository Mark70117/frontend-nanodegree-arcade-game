/*global
    ctx, document, Resources
*/
/*property
    addEventListener, checkWin, drawImage, get, hStep, handleInput, keyCode,
    max, min, prototype, push, render, sprite, update, vStep, x, y
*/

var ENVPLAYERSTART = {x: 200, y:400, hStep: 100, vStep: 85};
var ENVWALLS = {left: 0, right: 400, top: 0, bottom: 400};
var ENVENEMY = {
    startX: -50,
    maxX: 500,
    minXVelocity: 38,
    maxXVelocity: 102,
    xCaptureDistance: 75,
    yCaptureDistance: 5,
    minN: 3
};
var ENVROAD = [ 60, 145, 230];

var player;
var allEnemies = [];

var randomVelocity = function () {
    'use strict';
    return Math.floor((Math.random() * (ENVENEMY.maxXVelocity - ENVENEMY.minXVelocity)) + ENVENEMY.minXVelocity);
};

var randomRoad = function () {
    'use strict';
    return ENVROAD[Math.floor(Math.random() * ENVROAD.length)];
};

// Enemies our player must avoid
var Enemy = function (initialX, initialY, xVelocity) {
    'use strict';

    this.x = initialX;
    this.y = initialY;
    this.xVelocity = xVelocity;
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    'use strict';

    if (this.x > ENVENEMY.maxX) {
        this.x = ENVENEMY.startX;
        this.xVelocity = randomVelocity();
    } else {
        this.x += this.xVelocity * dt;
    }
    this.checkWin();
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    'use strict';

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Enemy.prototype.checkWin = function () {
    'use strict';
    if ((Math.abs(this.y - player.y) <= ENVENEMY.yCaptureDistance) &&
        (Math.abs(this.x - player.x) <= ENVENEMY.xCaptureDistance) ){
        player.returnStart();
    }
};

var Player = function () {
    'use strict';
    this.x = ENVPLAYERSTART.x;
    this.y = ENVPLAYERSTART.y;
    this.hStep = ENVPLAYERSTART.hStep; //horizontal step
    this.vStep = ENVPLAYERSTART.vStep; //vertical step
    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function (dt) {
    'use strict';
    /* jshint unused: vars */ // dt
};

Player.prototype.render = function (dt) {
    'use strict';
    /* jshint unused: vars */ // dt

    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// TODO yike, lots of hardcoded number need to be gone
Player.prototype.handleInput = function (key) {
    'use strict';
    var deltaX = 0;
    var deltaY = 0;
    switch (key) {
    case 'left':
        deltaX = -1;
        break;
    case 'right':
        deltaX = 1;
        break;
    case 'up':
        deltaY = -1;
        break;
    case 'down':
        deltaY = 1;
        break;
        // no default action required
    }
    this.x = Math.max(ENVWALLS.left, Math.min(ENVWALLS.right, this.x + this.hStep * deltaX));
    this.y = Math.max(ENVWALLS.top, Math.min(ENVWALLS.bottom, this.y + this.vStep * deltaY));
    this.checkWin();
};

Player.prototype.returnStart = function () {
    'use strict';
    this.x = ENVPLAYERSTART.x;
    this.y = ENVPLAYERSTART.y;
};

Player.prototype.checkWin =  function () {
    'use strict';
    if (this.y === 0) {
        this.returnStart();
        allEnemies.push (new Enemy(ENVENEMY.startX, randomRoad(), randomVelocity()));
    }
};

allEnemies.push (new Enemy(ENVENEMY.startX, ENVROAD[0], randomVelocity()));
allEnemies.push (new Enemy(ENVENEMY.startX, ENVROAD[1], randomVelocity()));
allEnemies.push (new Enemy(ENVENEMY.startX, ENVROAD[2], randomVelocity()));

player = new Player();

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

