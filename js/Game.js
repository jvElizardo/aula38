class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");

    this.leaderboardTitle - createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");

  }

  start() {
    player = new Player();
    playerCount = player.getCount();
    form = new Form();
    form.display();

    carro1 = createSprite(width/2 - 50, height - 100);
    carro1.addImage("car1", carro1img);
    carro1.scale = 0.07;
    carro2 = createSprite(width/2 + 100, height - 100);
    carro2.addImage("car2", carro2img);
    carro2.scale = 0.07;

    carros = [carro1,carro2];
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
    });
  }

  play(){
    this.handleElements();
    this.handleResetButton();
    Player.getPlayersInfo();
    if(allPlayers !== undefined){
      image(pista,0,-height*5,width,height*6);

      //this.showLeaderboard();

      var index = 0;
      //for(var i=0; i< carros.length; i++) {}
      for(var plr in allPlayers){
        index = index + 1; //i começa em 0
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        carros[index-1].position.x = x;
        carros[index-1].position.y = y;
      }

      this.handlePlayerControls(); //chamada da função de movimentação do player

      drawSprites();
    }
  }

 handleElements(){
   form.hide();
   form.titleImg.position(40,50);
   form.titleImg.class("gameTitleAfterEffect");

   this.resetTitle.html("Reiniciar Jogo");
   this.resetTitle.class("resetText");
   this.resetTitle.position(width/2 + 200,40);

   this.resetButton.class("resetButton");
   this.resetButton.position(width/2 + 230, 100);

   /*this.leadeboardTitle.html("Placar");
   this.leaderboardTitle.class("resetText");
   this.leaderboardTitle.position(width/3-60,40);

   this.leader1.class("leadersText");
   this.leader1.position(width/3-50,80);

   this.leader2.class("leadersText");
   this.leader2.position(width/3-50,130);*/

 }

 handlePlayerControls(){
   if(keyIsDown(UP_ARROW)){
     player.positionY +=10;
     player.update(); //erro nesta função
   }
 }
/*
 showLeaderboard()
 {
   var leader1, leader2;
   var players = Object.values(allPlayers);
   if(players[0].rank === 0 && players[1].rank === 0 || player[0].rank === 1)
   {
     leader1 = players[0].rank + "&emsp;" + players[0].nome + "&emsp;" + players[0].score;
     leader2 = players[1].rank + "&emsp;" + players[1].nome + "&emsp;" + players[1].score;
   }
   if(player[1].rank === 1)
   {
     leader1 = players[1].rank + "&emsp;" + players[1].nome + "&emsp;" + players[1].score;
     leader2 = players[0].rank + "&emsp;" + players[0].nome + "&emsp;" + players[0].score;
   }
   this.leader1.html(leader1);
   this.leader2.html(leader2);
 }*/
 

  handleResetButton(){
    this.resetButton.mousePressed(()=>{
      database.ref("/").set({
        playerCount:0,

      });
      window.location.reload();
    });
  }
} //chave da classe

