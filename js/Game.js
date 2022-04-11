class Game {
  constructor() {}

  start() {
    player = new Player();
    playerCount = player.getCount();
    form = new Form();
    form.display();
  }

  getState(){
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data){
      gameState = data.val();
    });
  }
 update(state){
database.ref("/").update({
gameState:state
}
)
 }
}
