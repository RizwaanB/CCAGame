// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);
var score = -2;
var scoreD = 0;
var labelScore;
var player;
var pipes = [];
var pipeEnds = [];
var pipeInterval = 1.75;
var pipeGap = 150
var height = 400
var margin = 40
var blockHeight = 50
var width = 790
var pipeEndHeight = 25
var pipeEndExtraWidth = 10
var balloons = [];
var weights = [];
var gameGravity = 160;
/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
game.load.image("playerImg", "../assets/Eliot_Gardiner.png")
game.load.image("background","../assets/gameBackground.png")
game.load.audio("score", "../assets/point.ogg")
game.load.image("pipe", "../assets/pipe.png")
game.load.image("pipeEnd", "../assets/pipe-end.png")
game.load.image("weight", "../assets/weight.png")
game.load.image("balloons", "../assets/balloons.png")
}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
    game.stage.setBackgroundColor("#3333ff");
    game.add.tileSprite(0, 0, 790, 400,"background");
    //game.add.text(50, 50, "Hello", {font: "30px Arial", fill: "#43f7bb"})
    //game.add.sprite(70, 70, "playerImg")
    //game.input.onDown.add(clickHandler)
    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerJump)
    labelScore = game.add.text(50, 100, scoreD);
    player = game.add.sprite(100, 200, "playerImg")
    player.anchor.setTo(0.5, 0.5);
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(player);
    player.body.gravity.y = gameGravity;
    game.time.events
    .loop(pipeInterval * Phaser.Timer.SECOND, generate);
    game.input.onDown.add(playerJump);
    /*
    game.input
        .keyboard.addkey(Phaser.keyboard.J)
        .onDown.add(moveRight);
    */
}

/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
  game.physics.arcade.overlap(player, pipes, gameOver);
  game.physics.arcade.overlap(player, pipeEnds, gameOver)
  if (player.body.y < -45 || player.body.y > 400) {
    gameOver();
  }
  checkBonus(balloons, -1);
  checkBonus(weights, 1);
}
function checkBonus(bonusArray, bonusEffect) {
   // Step backwards in the array to avoid index errors from splice
   for(var i=0; i < bonusArray.length; i++){
     game.physics.arcade.overlap(player, bonusArray[i], function(){
       // destroy sprite
       bonusArray[i].destroy();
       // remove element from array
       bonusArray.splice(i,1);
       // apply the bonus effect
       changeGravity(bonusEffect * game.rnd.integerInRange(50, 150));
   });
   }
}
/*
function clickHandler(event) {
  game.add.sprite(event.x, event.y, "playerImg");

}
*/
function spaceHandler() {
  game.sound.play("score")

}

function changeScore() {
  score = score + 1;
  if(score == -2) {
    scoreD = 0
  }
  if(score == -1) {
    scoreD = 0
  }
  else {
    scoreD = score
  }
  labelScore.setText(scoreD.toString())
}
/*
function moveRight () {
  player.x +=  10;
}
*/

function playerJump() {
  player.body.velocity.y = - 150;
}

function changeGravity(g) {
 gameGravity += g;
 player.body.gravity.y = gameGravity;
}

/*
function generatePipe() {
  var gapStart = game.rnd.integerInRange(1, 5);
  for(var count = 0; count < 8; count++) {
    if(count != gapStart && count != gapStart + 1){
      addPipeBlock(750, count * 50);
    }
  }
  changeScore();
}
*/
function generatePipe() {
  var gapStart = game.rnd.integerInRange(margin,height - pipeGap - margin)

  addPipeEnd(width - (pipeEndExtraWidth / 2), gapStart);
  for(var y = gapStart; y > 0; y-= blockHeight) {
    addPipeBlock(width, y - blockHeight);
  }

  addPipeEnd(width - (pipeEndExtraWidth / 2), gapStart + pipeGap);
  for(var y = gapStart + pipeGap + pipeEndHeight; y<height; y+= blockHeight) {
    addPipeBlock(width, y);
  }
  changeScore()
}

function addPipeBlock(x, y){
  var block = game.add.sprite(x,y, "pipe");
  pipes.push(block);
  game.physics.arcade.enable(block);
  block.body.velocity.x = -200;
}

function addPipeEnd(x, y) {
  var block = game.add.sprite(x,y, "pipeEnd");
  pipeEnds.push(block);
  game.physics.arcade.enable(block);
  block.body.velocity.x = -200;
}

function generateBalloons(){
 var bonus = game.add.sprite(width, 400, "balloons");
 balloons.push(bonus);
 game.physics.arcade.enable(bonus);
 bonus.body.velocity.x = -200;
 bonus.body.velocity.y = - game.rnd.integerInRange(60, 100);
}


function generateWeight(){
 var bonus = game.add.sprite(width, 0, "weight");
 weights.push(bonus);
 game.physics.arcade.enable(bonus);
 bonus.body.velocity.x = -200;
 bonus.body.velocity.y = game.rnd.integerInRange(60, 100);
}

function generate() {
 var diceRoll = game.rnd.integerInRange(1, 3);
 if(diceRoll==1) {
   generateWeight();
 }

 else if(diceRoll==2) {
   generateBalloons();
 }

 else {
   generatePipe();
 }
}

function gameOver() {
  game.state.restart();
  score = -2;
  gameGravity = 160
}
