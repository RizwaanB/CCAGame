// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);
var score;
score = 0;
var labelScore;
var player;
var pipes = [];
var pipeInterval = 1.75;
var pipeGap = 100
/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
game.load.image("playerImg", "../assets/Eliot_Gardiner.png")
game.load.audio("score", "../assets/point.ogg")
game.load.image("pipe", "../assets/pipe.png")
game.load.image("pipeEnd", "../assets/pipe-end.png")
}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
    // set the background colour of the scene
    game.stage.setBackgroundColor("#3333ff")
    //game.add.text(50, 50, "Hello", {font: "30px Arial", fill: "#43f7bb"})
    //game.add.sprite(70, 70, "playerImg")
    //game.input.onDown.add(clickHandler)
    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerJump)
    labelScore = game.add.text(50, 50, score);
    player = game.add.sprite(100, 200, "playerImg")
    player.anchor.setTo(0.5, 0.5);
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(player);
    player.body.gravity.y = 200;
    game.time.events
    .loop(pipeInterval * Phaser.Timer.SECOND, generatePipe);
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
  labelScore.setText(score.toString())
}
/*
function moveRight () {
  player.x +=  10;
}
*/

function playerJump() {
  player.body.velocity.y = - 200;
}

function generatePipe() {
  var gapStart = game.rnd.integerInRange(1, 5);
  for(var count = 0; count < 8; count++) {
    if(count != gapStart && count != gapStart + 1){
      addPipeBlock(750, count * 50);
    }
  }
  changeScore();
}

function addPipeBlock(x, y){
  var block = game.add.sprite(x,y, "pipe");
  pipes.push(block);
  game.physics.arcade.enable(block);
  block.body.velocity.x = -200;
}

function gameOver() {
  game.state.restart();
  score = 0;
}
