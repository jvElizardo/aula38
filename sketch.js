var canvas;
var backgroundImage;
var bgImg;
var database;
var form, player;
var playerCount;
var gameState = 0;
var pista;
var carro1;
var carro2;
 var carro1img,carro2img;
function preload() {
  backgroundImage = loadImage("./assets/planodefundo.png");
  pista = loadImage("./assets/planodefundo.png");
  carro1img = loadImage("./assets/car1.png");
  carro2img = loadImage ("/assets/car2.png");
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  database = firebase.database();
  game = new Game();
  game.getState();
  game.start();

}

function draw() {
  background(backgroundImage);
  if(playerCount === 2){
    game.update(1);
  }
 /* if(gameState === 1){
    game.play();
  }*/
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
