class Player {
  //propriedades do objeto player
  constructor() {
    this.name = null;
    this.index = null;
    this.positionX = 0;
    this.positionY = 0;
    this.rank = 0;
    this.score = 0;
    this.fuel = 185;
    this.life = 185;
  }

  //leitura da distância do BD
  getDistance(){
    var playerDistanceRef = database.ref("players/player"+ this.index);
    playerDistanceRef.on("value", data =>{
      var data = data.val();
      this.positionX = data.positionX;
      this.positionY = data.positionY;
    })
  }

  //adição dos players ao BD
  addPlayer(){
    var playerIndex = "players/player" + this.index;
    if(this.index === 1){
      this.positionX = width/2 - 100;
    }
    else{
      this.positionX = width/2 + 100;
    }
    database.ref(playerIndex).set({
      name: this.name,
      positionX: this.positionX,
      positionY: this.positionY,
      rank: this.rank,
      score: this.score,
    });
  }

  //leitura do número de players do BD
  getCount(){
    var playerCountRef = database.ref("playerCount");
    playerCountRef.on("value", data =>{
      playerCount = data.val();
    });
  }

  //atualização da contagem dos players no BD
  updateCount(count){
    database.ref("/").update({
      playerCount: count
    });
  }

  static getPlayersInfo(){ 
    var playerInfoRef = database.ref("players");
    playerInfoRef.on("value", data => {
      allPlayers = data.val();
    })
  }

  //atualização do banco de dados
  update(){ 
    var playerIndex = "players/player" + this.index;
    database.ref(playerIndex).update({
      positionX: this.positionX,
      positionY: this.positionY,
      rank: this.rank,
      score: this.score,
      life: this.life
    });
  }

  //ler carsAtEnd do banco de dados
  getCarsAtEnd(){ 
    database.ref("carsAtEnd").on("value",data =>{
      this.rank = data.val();
    });
  }

  //atualizar o carsAtEnd do banco de dados
  static updateCarsAtEnd(rank){ 
    database.ref("/").update({
      carsAtEnd: rank,
    });
  }



}
