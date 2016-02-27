var MAX_COL = 5;
var MAX_ROW = 6;
var IMG_WIDTH = 101;
var IMG_HEIGHT = 83;
var START = false;

// Enemies our player must avoid
var Enemy = function(col, row) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.x = col * IMG_WIDTH;
    this.y = row * IMG_HEIGHT - 20;
    this.speed = Math.round(Math.random() + 1);

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += this.speed;
    if (this.x >= ctx.canvas.width) {
      this.x = 0 - IMG_WIDTH;
    }
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function(col, row) {
    // 指定玩家的显示图片路径
    this.sprite = 'images/char-boy.png';
    this.src = ['images/char-horn-girl.png',
                'images/char-cat-girl.png',
                'images/char-boy.png',
                'images/char-pink-girl.png',
                'images/char-princess-girl.png'];
    this.col = col;
    this.row = row;
    this.score = 0;
    this.gem_num = 0;
};

Player.prototype.handleInput = function(key) {
    if (START) {
      if (key === "left") {
          if (this.col > 0) {
            this.col -= 1;
          }
      } else if (key === "right") {
          if (this.col < (MAX_COL - 1)) {
            this.col += 1;
          }
      } else if (key === "up") {
          if (this.row >= 1) {
            this.row -= 1;
          }
      } else if (key === "down") {
          if (this.row < (MAX_ROW - 1)) {
            this.row += 1;
          }
      }
    } else {
      if (key === '1') {
        START = true;
        this.sprite = this.src[0];
      } else if (key === '2') {
        START = true;
        this.sprite = this.src[1];
      } else if (key === '3') {
        START = true;
        this.sprite = this.src[2];
      } else if (key === '4') {
        START = true;
        this.sprite = this.src[3];
      } else if (key === '5') {
        START = true;
        this.sprite = this.src[4];
      }
    }
};

Player.prototype.update = function() {
    allEnemies.forEach(function(enemy) {
        var row = (enemy.y + 20) / IMG_HEIGHT;
        if (player.row === 0) {
            player.col = (MAX_COL - 1) / 2;
            player.row = MAX_ROW - 1;
            player.score += 1;
            allEnemies = reset_entities(Enemy);
        } else if (player.row === row) {
          var distance = player.col * IMG_WIDTH - enemy.x;
          if ((distance > 0) && (distance < (IMG_WIDTH - 30))) {
            player.col = (MAX_COL - 1) / 2;
            player.row = MAX_ROW - 1;
            player.score = 0;
            player.gem_num = 0;
            allEnemies = reset_entities(Enemy);
            allGems = reset_entities(Gem);
          }
        }
    });

    allGems.forEach(function(gem, index, allgems) {
      if ((player.col === gem.col) && (player.row === gem.row)) {
        player.gem_num += 1;
        delete allgems[index];
      }
    });
    var allGemsLen = allGems.filter(function(gem) {
      return gem;
    }).length;
    if (allGemsLen === 0) {
      allGems = reset_entities(Gem);
    }
};
Player.prototype.updateScore = function() {
    ctx.font = "28px Arial";
    ctx.fillStyle = "blue";
    ctx.clearRect(0, 0, MAX_COL * 101, 50);
    ctx.fillText("SCORE: " + this.score.toString(), 10, 40);
    ctx.fillText("GEM: " + this.gem_num.toString(), 380, 40);
};

Player.prototype.select = function() {
    function darkScreen(imgData) {
        var pixelNums = imgData.data.length / 4;
        for (var i = 0; i < pixelNums; i++) {
          var avg = 0.2 * (imgData.data[i * 4] +
                    imgData.data[i * 4 + 1] +
                    imgData.data[i * 4 + 2]) / 3;
          imgData.data[i * 4] = avg;
          imgData.data[i * 4 + 1] = avg;
          imgData.data[i * 4 + 2] = avg;
          // imgData.data[i * 4 + 3] = 200;
        }
    }

    var screenData = ctx.getImageData(0, 0, ctx.canvas.width,
                              ctx.canvas.height);
    darkScreen(screenData);
    ctx.putImageData(screenData, 0, 0);

    this.src.forEach(function(role, index) {
      ctx.drawImage(Resources.get(role), index * IMG_WIDTH, 5 * IMG_HEIGHT - 30);
    });
    ctx.fillText("请输入数字1,2,3,4,5进行角色选择", 40, 420);
};

Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite),
                this.col * IMG_WIDTH, this.row * IMG_HEIGHT - 30);
    this.updateScore();
};

// Enemies our player must avoid
var Gem = function(col, row) {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started
    this.col = col;
    this.row = row;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.src = ['images/Gem Blue.png',
                'images/Gem Orange.png',
                'images/Gem Green.png'
              ];
    this.sprite = this.src[Math.round(Math.random() * 2)];
};

Gem.prototype.render = function() {
    ctx.save();
    ctx.scale(0.75, 0.75);
    ctx.drawImage(Resources.get(this.sprite),
                (this.col * IMG_WIDTH) / 0.75 + 15,
                (this.row * IMG_HEIGHT + 6) / 0.75);
    ctx.restore();
};

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var reset_entities = function (obj) {
  var entities = [];
  var total = Math.random() * 8;
  for (var i = 0; i < total; i++) {
    entities.push(new obj(Math.round(Math.random() * 4),
                           Math.ceil(Math.random() * 3) ));
  }
  return entities;
};
var allEnemies = reset_entities(Enemy);
var player = new Player(2, 5);
var allGems = reset_entities(Gem);


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        49: '1',
        50: '2',
        51: '3',
        52: '4',
        53: '5'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
