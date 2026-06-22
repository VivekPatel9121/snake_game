const canvas = document.getElementById("gameBoard");
const ctx = canvas.getContext("2d");

const scoreText = document.getElementById("score");
const highScoreText = document.getElementById("highScore");

const restartBtn = document.getElementById("restartBtn");

const box = 20;

let snake = [
    {x: 200, y: 200}
];

let direction = "RIGHT";

let food = randomFood();

let score = 0;

let highScore =
localStorage.getItem("snakeHighScore") || 0;

highScoreText.textContent = highScore;

function randomFood(){
    return {
        x: Math.floor(Math.random()*20)*box,
        y: Math.floor(Math.random()*20)*box
    };
}

document.addEventListener("keydown", changeDirection);

function changeDirection(event){

    if(event.key==="ArrowUp" && direction!=="DOWN")
        direction="UP";

    else if(event.key==="ArrowDown" && direction!=="UP")
        direction="DOWN";

    else if(event.key==="ArrowLeft" && direction!=="RIGHT")
        direction="LEFT";

    else if(event.key==="ArrowRight" && direction!=="LEFT")
        direction="RIGHT";
}

function draw(){

    ctx.clearRect(0,0,400,400);

    // Food
    ctx.fillStyle = "#ff006e";

    ctx.beginPath();
    ctx.arc(
        food.x+10,
        food.y+10,
        8,
        0,
        Math.PI*2
    );
    ctx.fill();

    // Snake
    snake.forEach((part,index)=>{

        ctx.fillStyle =
        index===0 ? "#00ffcc" : "#22c55e";

        ctx.shadowBlur = 15;
        ctx.shadowColor = "#00ffcc";

        ctx.fillRect(
            part.x,
            part.y,
            box,
            box
        );
    });

    let headX = snake[0].x;
    let headY = snake[0].y;

    if(direction==="UP") headY-=box;
    if(direction==="DOWN") headY+=box;
    if(direction==="LEFT") headX-=box;
    if(direction==="RIGHT") headX+=box;

    if(
        headX<0 ||
        headY<0 ||
        headX>=400 ||
        headY>=400 ||
        collision(headX,headY,snake)
    ){
        gameOver();
        return;
    }

    let newHead = {
        x: headX,
        y: headY
    };

    if(
        headX===food.x &&
        headY===food.y
    ){
        score++;

        scoreText.textContent = score;

        if(score>highScore){
            highScore=score;
            localStorage.setItem(
                "snakeHighScore",
                highScore
            );
            highScoreText.textContent =
            highScore;
        }

        food = randomFood();
    }
    else{
        snake.pop();
    }

    snake.unshift(newHead);
}

function collision(x,y,array){

    for(let i=0;i<array.length;i++){

        if(
            x===array[i].x &&
            y===array[i].y
        ){
            return true;
        }
    }

    return false;
}

function gameOver(){

    clearInterval(game);

    setTimeout(()=>{
        alert(
            "Game Over!\nScore: " + score
        );
    },100);
}

restartBtn.addEventListener("click",()=>{

    snake = [{x:200,y:200}];

    direction="RIGHT";

    score=0;

    scoreText.textContent=0;

    food=randomFood();

    clearInterval(game);

    game=setInterval(draw,120);
});

let game = setInterval(draw,120);