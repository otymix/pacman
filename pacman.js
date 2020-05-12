"use strict";


//GAME
var game = new Game("canvas", 30),
player = new Player(19, 19, 1, 1, "#3498DB"),
redGhost = new Ghost(19, 19, 9, 10, "#FF0000"),
blueGhost = new Ghost(19, 19, 9, 10, "#0000FF"),

food = new Food(3),
firstLevel = new Map(firstMap, 19);



var t0=0;
var IntervalWorker 
function start_game(){

                    begin_sound.play(); 
                    setTimeout(()=>{        
                            game.init();
                            t0 = performance.now();
                            console.log("t0 " + t0)
                                    }, 
                                4500)
}


// Game Matrix
var firstMap =[
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
    [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,0,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
    [1,1,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,1,1],
    [1,1,1,2,2,2,2,0,2,0,0,0,2,1,2,2,2,2,1],
    [1,1,1,1,0,1,2,1,2,1,1,1,2,1,2,1,1,2,1],
    [0,0,0,2,2,2,2,1,2,1,2,1,2,0,2,2,2,2,0],
    [1,1,1,1,0,1,2,1,2,1,2,1,2,1,2,0,0,2,1],
    [1,1,1,2,2,2,2,0,2,2,2,2,2,1,2,1,1,2,1],
    [1,1,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,1],
    [1,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
    [1,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,1],
    [1,0,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
    ];


//FUNCTION FOR BUILDING THE CANEVAS 
    function Map(levelMap, wallScale)
    {
        this.levelMap = levelMap,
    
        this.generate = function()
        {
            function display(wall)
            {
                if (wall === 1)
                {
                    game.ctx.fillStyle = "#1136FF";
                    game.ctx.fillRect(j * wallScale, i * wallScale, wallScale, wallScale);
                }
                else if (wall === 0)
                {
                    game.ctx.fillStyle = "#000";
                    game.ctx.fillRect(j * wallScale, i * wallScale, wallScale, wallScale);
                    //put food
                    food.display((j * wallScale) + (wallScale / 2), (i * wallScale) + (wallScale / 2));
                }
            }
                //i are lines and j are columns
            for (var i = 0; i < this.levelMap.length; i++)
            {
                for (var j = 0; j < this.levelMap[i].length; j++)
                    display(this.levelMap[i][j]);
            }
        };
    }

 //BUILDING THE CANEVAS BASED ON the MATRIX   
    firstLevel = new Map(firstMap, 19);


// GAME : Managing the player and Phantoms and check if game is ever eneded or not yet...
    function Game(container, ms)
    {
        this.container=document.querySelector("#canvas");
    
        this.ms = ms,
        this.width = this.container.width,
        this.height = this.container.height,
        this.ctx = this.container.getContext("2d"),
        this.play = true,
    
        this.rightDown = false,
        this.leftDown = false,
        this.topDown = false,
        this.bottomDown = false,
        this.spaceDown = false,
    
        this.init = function()
        {   
                  this.initKeys();
                   //stocking the IntervalWorker so we can kill it when game has to end up
                   IntervalWorker =  setInterval(this.mainLoop, this.ms);
                 
        },
    
        this.initKeys = function()
        {
            document.addEventListener('keydown', keyDown);
            document.addEventListener('keyup', keyUp);
    
            function keyDown(e){
                if (game.play === true)
                {
                    if (e.keyCode === 39)
                        game.rightDown = true;
                    else if (e.keyCode === 37)
                        game.leftDown = true;
                    else if (e.keyCode === 38)
                        game.topDown = true;
                    else if (e.keyCode === 40)
                        game.bottomDown = true;
                }
            }
    
    
            function keyUp(e){
                if (game.play === true)
                {
                    if (e.keyCode === 39)
                        game.rightDown = false;
                    else if (e.keyCode === 37)
                        game.leftDown = false;
                    else if (e.keyCode === 38)
                        game.topDown = false;
                    else if (e.keyCode === 40)
                        game.bottomDown = false;
                }
            }
    
        },
    

    //HERE THE MAIN LOOP FUNCTION FOR OUR GAME    
        this.mainLoop = function()        
        {

            if (game.play === true)
            {   
                //console.log(`GAME IS TRUE YET ${game.play} .`)
                game.ctx.clearRect(0, 0, game.width, game.height);
                firstLevel.generate();
                
    
                player.create("./img/pacman.png");
                player.move();

                redGhost.create("./img/redghost.png");
                redGhost.move(2);
    
                blueGhost.create("./img/blueghost.png");
                blueGhost.move(3);

                //update the score element
                document.querySelector("#score").innerHTML= player.score
    
                if (player.score >= maxScore)
                {
                    document.querySelector("#game_over").style.color= "green"
                    document.querySelector("#game_over").innerHTML= "You Won "
                    let end_time = performance.now();
                    let start_time = t0;
                    let game_duration = ((end_time - start_time) / 1000).toFixed(2)
                    let game_points = (player.score / game_duration).toFixed(2)
                    game_over.play();
                    console.log(`La partie a pris ${game_duration} SECONDES.`);
                    
                    setTimeout(
                                 alert(`👏 BRAVO! Tu as gagné avec un score de ${player.score} et ça t'a pris exactement ${game_duration} secondes ! \n tu as ${game_points} Points dans le classement`), 
                        7000);

                    clearInterval(IntervalWorker)
                }
            }

            if(game.play === false)
            {
                    //console.log("Entered in game False")
                    document.querySelector("#game_over").innerHTML= "Game Over";
                    let end_time = performance.now();
                    let start_time = t0;
                    let game_duration = ((end_time - start_time) / 1000).toFixed(2)
                    let game_points = (player.score / game_duration).toFixed(2)
                    game_over.play();
                        console.log(`TU AS PERDU... 😑 , la partie a durée ${game_duration} SECONDES.`)
        
                    setTimeout(
                               alert(`OOPS,  TU AS PERDU... 😑 , la partie a durée ${game_duration} secondes! \n tu as ${game_points} Points dans le classement`),
                       3000);
                    clearInterval(IntervalWorker)
            }
             
            game.keyManager();
        },
    
        this.keyManager = function()
        {
            if (game.rightDown)
                player.direction = 0;
            if (game.leftDown)
                player.direction = 1;
            if (game.topDown)
                player.direction = 2;
            if (game.bottomDown)
                player.direction = 3;
        };
    }
 
    


//FOOD 

function Food(radius)
{
    this.radius = radius,
    // seting points of a food to 10 by default , Attention maxScore doit dépendre de cela
    this.scoreValue = 10, 
    this.display = function(x, y)
    {
        game.ctx.fillStyle = "#FFFFFF";
        game.ctx.beginPath();
        game.ctx.arc(x, y, this.radius, 0, Math.PI * 360 );
        game.ctx.fill();
    };
}
    



//PLAYER
    //SOUNDS OF THE GAME
    const eat_sound = new Audio('./sound/pacman_eatfruit.wav')
    const begin_sound = new Audio('./sound/pacman_beginning.wav')
    const game_over = new Audio('./sound/game_over.mp3')
    begin_sound.volume = 0.1
    eat_sound.volume = 0.06
    game_over.volume = 0.1

    
    function Player(width, height, posX, posY, color)
    {
        this.width = width,
        this.height = height,
        this.scale = 19,
        this.posX = posX * this.scale,
        this.posY = posY * this.scale,
        this.color = color,
        this.image = null,
        this.onTheRight = null,
        this.onTheLeft = null,
        this.onTheTop = null,
        this.onTheBottom = null,
        this.speed = 2,
        this.direction = 0,
        this.score = 0,
    
        this.create = function(path)
        {
            path = path || false;
    
            if (path === false)
            {
                game.ctx.fillStyle = this.color;
                game.ctx.fillRect(this.posX, this.posY, this.width, this.height);
            }
            else
            {
                this.image = new Image();
                this.image.src = path;
            }
        },
    
        this.move = function()
        {   
            console.log(`PosX : ${this.posX} and PosY ${this.posY}`)
            this.onTheRight = firstMap[Math.floor((this.posY + (this.scale / 2)) / this.scale)][Math.floor((this.posX + this.scale) / this.scale)];
            this.onTheLeft = firstMap[Math.floor((this.posY + (this.scale / 2)) / this.scale)][Math.floor((this.posX - 1) / this.scale)];
            this.onTheTop = firstMap[Math.floor((this.posY - 1) / this.scale)][Math.floor((this.posX + (this.scale / 2)) / this.scale)];
            this.onTheBottom = firstMap[Math.floor((this.posY + this.scale) / this.scale)][Math.floor((this.posX + (this.scale / 2)) / this.scale)];
    
            if (Math.floor(this.posX / this.scale) > Math.floor(game.width / this.scale))
                this.posX = 0;
            else if (Math.floor(this.posX / this.scale) < 0)
                this.posX = game.width;
    
            if (this.direction === 0)
            {
                game.ctx.drawImage(this.image, 0, 0, this.scale, this.scale, this.posX, this.posY, this.scale, this.scale);
    
                if (this.onTheRight === 1)
                    return 0;
                else if (this.onTheRight === 0)
                {
                    firstMap[Math.floor((this.posY + (this.scale / 2)) / this.scale)][Math.floor((this.posX + this.scale) / this.scale)] = 2;
                    this.score += food.scoreValue;
                    eat_sound.play();
                }
                this.posX += this.speed;
            }
            else if (this.direction === 1)
            {
                game.ctx.drawImage(this.image, 0, this.scale, this.scale, this.scale, this.posX, this.posY, this.scale, this.scale);
    
                if (this.onTheLeft === 1)
                    return 0;
                else if (this.onTheLeft === 0)
                {
                    firstMap[Math.floor((this.posY + (this.scale / 2)) / this.scale)][Math.floor((this.posX - 1) / this.scale)] = 2;
                    this.score += food.scoreValue;
                    eat_sound.play();
                }
                this.posX -= this.speed;
            }
            else if (this.direction === 2)
            {
                game.ctx.drawImage(this.image, this.scale, this.scale, this.scale, this.scale, this.posX, this.posY, this.scale, this.scale);
    
                if (this.onTheTop === 1)
                    return 0;
                else if (this.onTheTop === 0)
                {
                    firstMap[Math.floor((this.posY - 1) / this.scale)][Math.floor((this.posX + (this.scale / 2)) / this.scale)] = 2;
                    this.score += food.scoreValue;
                    eat_sound.play();
                }
                this.posY -= this.speed;
            }
            else if (this.direction === 3)
            {
                game.ctx.drawImage(this.image, this.scale, 0, this.scale, this.scale, this.posX, this.posY, this.scale, this.scale);
    
                if (this.onTheBottom === 1)
                    return 0;
                else if (this.onTheBottom === 0)
                {
                    firstMap[Math.floor((this.posY + this.scale) / this.scale)][Math.floor((this.posX + (this.scale / 2)) / this.scale)] = 2;
                    this.score += food.scoreValue;
                    eat_sound.play();
                }
                this.posY += this.speed;
            }
        };
    }



//GHOSTS
function Ghost(width, height, posX, posY, color)
{
    this.width = width,
    this.height = height,
    this.scale = 19,
    this.posX = posX * this.scale,
    this.posY = posY * this.scale,
    this.color = color,
    this.GhostImage = null,
    this.speed = 2.5,
    this.direction = 2,

    this.create = function(path)
    {
        path = path || false;

        if (path === false)
        {
            game.ctx.fillStyle = this.color;
            game.ctx.fillRect(this.posX, this.posY, this.width, this.height);
        }
        else
        {
            this.GhostImage = new Image();
            this.GhostImage.src = path;

            game.ctx.drawImage(this.GhostImage, 0, 0, this.scale, this.scale, this.posX, this.posY, this.scale, this.scale);
        }
    },

    this.move = function(direction)
    {
        this.onTheRight = firstMap[Math.floor((this.posY + (this.scale / 2)) / this.scale)][Math.floor((this.posX + this.scale) / this.scale)],
        this.onTheLeft = firstMap[Math.floor((this.posY + (this.scale / 2)) / this.scale)][Math.floor((this.posX - 1) / this.scale)],
        this.onTheTop = firstMap[Math.floor((this.posY - 1) / this.scale)][Math.floor((this.posX + (this.scale / 2)) / this.scale)],
        this.onTheBottom = firstMap[Math.floor((this.posY + this.scale) / this.scale)][Math.floor((this.posX + (this.scale / 2)) / this.scale)];

        if (Math.floor(this.posX / this.scale) > Math.floor(game.width / this.scale))
            this.posX = 0;
        else if (Math.floor(this.posX / this.scale) < 0)
            this.posX = game.width;

        if (Math.floor(player.posX / this.scale) == Math.floor(this.posX / this.scale) &&
            Math.floor(player.posY / this.scale) == Math.floor(this.posY / this.scale))
            {
                game.play = false;
                console.log("Collission happened")
            }
        if (this.direction === 0)
        {
            game.ctx.drawImage(this.GhostImage, 0, 0, this.scale, this.scale, this.posX, this.posY, this.scale, this.scale);

            if (this.onTheRight === 1)
            {
                this.direction = Math.floor(Math.random() * 4);
                return 0;
            }
            this.posX += this.speed;
        }
        else if (this.direction === 1)
        {
            game.ctx.drawImage(this.GhostImage, 0, this.scale, this.scale, this.scale, this.posX, this.posY, this.scale, this.scale);

            if (this.onTheLeft === 1)
            {
                this.direction = Math.floor(Math.random() * 4);
                return 0;
            }
            this.posX -= this.speed;
        }
        else if (this.direction === 2)
        {
            game.ctx.drawImage(this.GhostImage, this.scale, this.scale, this.scale, this.scale, this.posX, this.posY, this.scale, this.scale);

            if (this.onTheTop === 1)
            {
                this.direction = Math.floor(Math.random() * 4);
                return 0;
            }
            this.posY -= this.speed;
        }
        else if (this.direction === 3)
        {
            game.ctx.drawImage(this.GhostImage, this.scale, 0, this.scale, this.scale, this.posX, this.posY, this.scale, this.scale);

            if (this.onTheBottom === 1)
            {
                this.direction = Math.floor(Math.random() * 4);
                return 0;
            }
            this.posY += this.speed;
        }
    };
}

//END GHOSt


//TO START THE GAME WITH SIMPLE TAP ON ENTER KEY ...
document.addEventListener('keypress', (e)=>{
    if (e.which == 13) {
           // start_game();
    }
})

  
function setMaxScore(array,ptsPerFood){
    let nb_ligne = array.length;
    let total_1 = 0;
      for(let i=0; i<nb_ligne; i++){
        let nb_col = array[i].length
        console.log(nb_col)
            for(let j=0; j<nb_col; j++){
                  if( array[i][j] === 0) {
                        total_1++;} 
            }
      }
  return (total_1 )* ptsPerFood
  
  }
  
 var maxScore = setMaxScore(firstMap,10);