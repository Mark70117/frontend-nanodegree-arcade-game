/* jslint
    this
*/
/*global
    ctx, document, Resources
*/
/*property
    addEventListener, checkWin, drawImage, get, hStep, handleInput, keyCode,
    max, min, prototype, push, render, sprite, update, vStep, x, y
*/

// Enemies our player must avoid
var Enemy = function () {
    "use strict";
    var todo = 0;
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function (dt) {
    "use strict";
    var todo = 0;
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function () {
    "use strict";
    var todo = 0;
    //ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function () {
    "use strict";
    this.x = 200;
    this.y = 400;
    this.hStep = 100; //horizontal step
    this.vStep = 85; //vertical step
    this.sprite = 'images/char-boy.png';
};

Player.prototype.update = function (dt) {
    "usestrict";
    var todo = 0;
};

Player.prototype.render = function (dt) {
    "use strict";
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// TODO yike, lots of hardcoded number need to be gone
Player.prototype.handleInput = function (key) {
    "use strict";
    var delta_x = 0;
    var delta_y = 0;
    switch (key) {
    case 'left':
        delta_x = -1;
        break;
    case 'right':
        delta_x = 1;
        break;
    case 'up':
        delta_y = -1;
        break;
    case 'down':
        delta_y = 1;
        break;
        // no default action required
    }
    this.x = Math.max(0, Math.min(400, this.x + this.hStep * delta_x));
    this.y = Math.max(0, Math.min(400, this.y + this.vStep * delta_y));
    this.checkWin();
};

Player.prototype.checkWin = function () {
    "use strict";
    if (this.y === 0) {
        this.y = 400;
        this.x = 200;
    }
};
// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

var allEnemies = [];
allEnemies.push(new Enemy());

var player = new Player();



// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    "use strict";
    var allowedKeys = {
        '37': 'left',
        '38': 'up',
        '39': 'right',
        '40': 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
