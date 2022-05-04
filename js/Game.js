class Game {
  //propriedades do objeto game
  constructor() {
    this.resetTitle = createElement("h2");
    this.resetButton = createButton("");
    this.leaderboardTitle = createElement("h2");
    this.leader1 = createElement("h2");
    this.leader2 = createElement("h2");
    this.playerMoving = false; //sinalizador de movimento do carro
    this.leftKeyActive = false; //sinalizador do movimento para a esquerda
    this.blast = false;
  }

  //tela inicial do jogo
  start() {
    //objeto jogador
    player = new Player();
    //leitura do número de jogadores do BD
    playerCount = player.getCount();
    //objeto formulário
    form = new Form();
    //mostrar o formulário
    form.display();

    //criação dos sprites e animação dos carros
    carro1 = createSprite(width/2 - 50, height - 100);
    carro1.addImage("car1", carro1img);
    carro1.scale = 0.07;
    carro1.addImage("bater",crashImage);
    carro2 = createSprite(width/2 + 100, height - 100);
    carro2.addImage("car2", carro2img);
    carro2.scale = 0.07;
    carro2.addImage("bater",crashImage);
    //matriz dos carros
    carros = [carro1,carro2];

    //criação dos grupos de combustíveis, moedas e obstáculos  
    fuels = new Group();
    powerCoins = new Group();
    obstacles = new Group();

    //matriz das informações dos obstáculos (posição e imagem)
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

  //ler o estado do jogo do BD
  getState(){
    var gameStateRef = database.ref("gameState");
    gameStateRef.on("value", function(data){
      gameState = data.val();
    });
  }

  //atualização o estado do jogo no BD
  update(state){
    database.ref("/").update({
    gameState:state
    });
  }

  play(){
    //chamada da função para mostrar o título, botão de reset e placar do jogo
    this.handleElements();
    this.handleResetButton();

    Player.getPlayersInfo();
    player.getCarsAtEnd();

    if(allPlayers !== undefined){
      image(pista,0,-height*5,width,height*6);

      //chamada das funções para mostrar as informações do jogador, vida e combustível
      this.showLife();
      this.showFuel();
      this.showLeaderboard();

      var index = 0;
      //for(var i=0; i< carros.length; i++) {}
      for(var plr in allPlayers){ //loop for in
        index = index + 1; //i começa em 0
        var x = allPlayers[plr].positionX;
        var y = height - allPlayers[plr].positionY;
        
        var vida_atual=allPlayers[plr].life;
        
        if (vida_atual<=0){
          carros[index-1].changeImage("bater");
          carros[index-1].scale = 0.3;
        }
        carros[index-1].position.x = x;
        carros[index-1].position.y = y;

        //marcação do carro na tela do jogador
        if(index === player.index){
          stroke(10);
          fill("red");
          ellipse(x,y,60,60);
          //coletar combustível e moedas
          this.handleFuel(index);
          this.handleCoins(index);
          //detectar colisão com obstáculos
          this.handleObstaclesCollision(index);
          //detectar colisão com carros
          this.handleCarsCollision(index);

          if(player.life <=0)
          {
            this.blast = true;
            this.playerMoving = false;
          }

          //camera do jogo
          camera.position.y = carros[index-1].position.y;
        }
      }

      //IA que movimenta o carro  
     /* if(this.playerMoving){
        player.positionY +=5;
        player.update();
      } */

      this.handlePlayerControls(); //chamada da função de movimentação do player

      //verificar se passou pela linha de chegada
      const finishLine = height*6 -100;
      if(player.positionY > finishLine){
        gameState = 2;
        player.rank +=1;
        Player.updateCarsAtEnd(player.rank);
        player.update();
        this.showRank();
      }

      //desenhar os sprites
      drawSprites();
    }
  }

  //mostrar o título, botão de reset e placar do jogo
  handleElements(){
   
  //esconder o formulário
  form.hide();

   //título do jogo
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

  //mover o player
 handlePlayerControls(){
   if(!this.blast){
    if(keyIsDown(UP_ARROW)){
      this.playerMoving = true;
      player.positionY +=10;
      player.update(); //erro nesta função
     }
    if(keyIsDown(LEFT_ARROW)){
     player.positionX -=8;
     player.update();
     this.leftKeyActive = true;
    }
    if(keyIsDown(RIGHT_ARROW)){
      player.positionX +=8;
      player.update();
      this.leftKeyActive = false;
    }
  }
 }

  //mostrar o painel de informações dos jogadores  
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
 
  //criar o botão de reset 
  handleResetButton(){
    this.resetButton.mousePressed(()=>{
      database.ref("/").set({
        playerCount:0,
        gameState:0,
        players:{},
        carsAtEnd:0,
      });
      window.location.reload();
    });
  }
  //criar as moedas, combustíveis e obstáculos
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
    if(player.fuel>0 && this.playerMoving){
      player.fuel -= 1.1;
    }
    if(player.fuel <=0){
      gameState = 2;
      this.gameOver();
    }
  }

  //pegar moedas
  handleCoins(index){
    carros[index-1].overlap(powerCoins, function (collector,collected){
      player.score +=10;
      player.update();
    collected.remove();
    });

  }

  //colisão com os obstáculos
  handleObstaclesCollision(index){
    if(carros[index-1].collide(obstacles)){
      //verifica o lado onde ocorreu a colisão
      if(this.leftKeyActive){
        player.positionX += 100;
      }
      else{
        player.positionX -= 100;
      }
      //verifica se tem vida
      if(player.life > 0){
        player.life -= 20;
      }
      //atualiza o BD
      player.update();
      //fim de jogo
      //if(player.life <=0){
      //  gameState = 2;
     //   this.gameOver();
     // }
    }
  }

  //colisão com carros
  handleCarsCollision(index){
    //        player1, player2, player3....
    //matriz  indice 0
  //CARRO 1 BATE NO CARRO 2  
  if(index === 1){ 
    if(carros[index-1].collide(carros[1])){
      // matriz 0, player1    matriz 1, player2  
      if(this.leftKeyActive){
        player.positionX += 100;
      }
      else{
        player.positionX -= 100;
      }
      //verifica se tem vida
      if(player.life > 0){
        player.life -= 20;
      }
      //atualiza o BD
      player.update();

      //fim de jogo
     // if(player.life <=0){
     //   gameState = 2;
        //this.gameOver();
     // }
    }
  }
  
  //CARRO 2 BATE NO CARRO 1 
  if(index === 2){ 
    if(carros[index-1].collide(carros[0])){
      // matriz 1, player2    matriz 0, player1  
      if(this.leftKeyActive){
        player.positionX += 100;
      }
      else{
        player.positionX -= 100;
      }
      //verifica se tem vida
      if(player.life > 0){
        player.life -= 20;
      }
      //atualiza o BD
      player.update();
    }
  }
  }

  //barra de vida
  showLife(){
    push();
    image(lifeImage, width/2-130, height- player.positionY - 400, 20,20);
    fill("white");
    rect(width/2-100, height- player.positionY - 400, 185,20);
    fill("#f50057");
    rect(width/2-100, height- player.positionY - 400, player.life,20);
    noStroke();
    pop();
  }

  //barra de combustível
  showFuel(){
    push();
    image( fuelsImage,width/2-130,height- player.positionY - 350, 20,20);
    fill("white");
    rect(width/2-100,height- player.positionY - 350, 185,20 );
    fill("black");
    rect(width/2-100, height- player.positionY - 350, player.fuel,20);
    noStroke();
    pop();
  }
  //sweet alert para quem passou pela linha de chegada
  showRank(){
    swal({
      title: `Incrível! ${"\n"} Rank ${"\n"} ${player.rank}`,
      text: "Você alcançou a linha de chegada com sucesso!",
      imageURL: 
        "https://raw.githubusercontent.com/vishalgaddam873/p5-multiplayer-car-race-game/master/assets/cup.png",
      imageSize: "100x100",
      confirmButtonText: "Ok",
    });
  }
  
  //sweet alert quando acaba o combustível
  gameOver(){
    swal({
      title: `Game Over`,
      text: "Você perdeu a corrida",
      imageURL: 
        "https://cdn.shopify.com/s/files/1/1061/1924/products/Thumbs_Down_Sign_Emoji_Icon_ios10_grande.png",
      imageSize: "100x100",
      confirmButtonText: "Obrigada por jogar",
    });
  }


} //chave da classe

