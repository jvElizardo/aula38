class Game {
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");
    //erro era o símbolo de igual (estava um traço)
    this.leaderboardTitle = createElement("h2");
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

    fuels = new Group();
    powerCoins = new Group();
    obstacles = new Group();

    var obstaclesPositions = [
      { x: width / 2 + 250, y: height - 800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 1300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 1800, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 2300, image: obstacle2Image },
      { x: width / 2, y: height - 2800, image: obstacle2Image },
      { x: width / 2 - 180, y: height - 3300, image: obstacle1Image },
      { x: width / 2 + 180, y: height - 3300, image: obstacle2Image },
      { x: width / 2 + 250, y: height - 3800, image: obstacle2Image },
      { x: width / 2 - 150, y: height - 4300, image: obstacle1Image },
      { x: width / 2 + 250, y: height - 4800, image: obstacle2Image },
      { x: width / 2, y: height - 5300, image: obstacle1Image },
      { x: width / 2 - 180, y: height - 5500, image: obstacle2Image }
    ];

    //chamada da função para adicionar combustível
    this.addSprites(fuels,8,fuelsImage,0.02);
    //chamada da função para adicionar as moedas
    this.addSprites(powerCoins,10,powerCoinsImage,0.09);
    //chamada da função para adicionar os obstáculos
    this.addSprites(obstacles,obstaclesPositions.length,obstacle1Image,0.04,obstaclesPositions);

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

      this.showLeaderboard();

      var index = 0;
      //for(var i=0; i< carros.length; i++) {}
      for(var plr in allPlayers){
        index = index + 1; //i começa em 0
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;

        carros[index-1].position.x = x;
        carros[index-1].position.y = y;

        //marcação do carro
        if(index === player.index){
          stroke(10);
          fill("red");
          ellipse(x,y,60,60);

          //coletar combustível
          this.handleFuel(index);
          //camera do jogo
          camera.position.y = carros[index-1].position.y;
        }
      }

      this.handlePlayerControls(); //chamada da função de movimentação do player

      drawSprites();
    }
  }

 handleElements(){
   form.hide();
   form.titleImg.position(40,50);
   form.titleImg.class("gameTitleAfterEffect");

   //Botão de reset
   this.resetTitle.html("Reiniciar Jogo");
   this.resetTitle.class("resetText");
   this.resetTitle.position(width/2 + 200,40);

   this.resetButton.class("resetButton");
   this.resetButton.position(width/2 + 230, 100);

   //Placar
   this.leaderboardTitle.html("Placar");
   this.leaderboardTitle.class("resetText");
   this.leaderboardTitle.position(width/3-60,40);

   this.leader1.class("leadersText");
   this.leader1.position(width/3-50,80);

   this.leader2.class("leadersText");
   this.leader2.position(width/3-50,130);

 }

 handlePlayerControls(){
   if(keyIsDown(UP_ARROW)){
     player.positionY +=10;
     player.update(); //erro nesta função
   }
 }

 showLeaderboard()
 {
   var leader1, leader2;
   var players = Object.values(allPlayers);
   if((players[0].rank === 0 && players[1].rank === 0) || player[0].rank === 1)
   {
     leader1 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score;
     leader2 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score;
   }
   if(players[1].rank === 1)
   {
     leader1 = players[1].rank + "&emsp;" + players[1].name + "&emsp;" + players[1].score;
     leader2 = players[0].rank + "&emsp;" + players[0].name + "&emsp;" + players[0].score;
   }
   this.leader1.html(leader1);
   this.leader2.html(leader2);
 }
 

  handleResetButton(){
    this.resetButton.mousePressed(()=>{
      database.ref("/").set({
        playerCount:0,
        gameState:0,
        players:{}
      });
      window.location.reload();
    });
  }
  //função para criar as moedas, combustíveis e obstáculos
  addSprites(spriteGroup,spriteNumber,spriteImage,scale, positions=[])
  { 
    for(var i=0; i<spriteNumber; i++){
      var x,y;

      if(positions.length > 0){
        x = positions[i].x;
        y = positions[i].y;
      }else{
        x = random(width/2+150, width/2-150); 
        y = random(-height*4.5, height-400); 
      }

      var sprite = createSprite(x,y);
      sprite.addImage("sprite", spriteImage);
      sprite.scale = scale;
      spriteGroup.add(sprite);

    }
  }

  //pegar o combustível
  handleFuel(index){
    carros[index-1].overlap(fuels, function(collector,collected){
      player.fuel = 185;
      collected.remove();
    });
  }


} //chave da classe

