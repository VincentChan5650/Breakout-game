var canvas = document.getElementById("myCanvas"); // get the canvas element
var ctx = canvas.getContext('2d');				 //return the drawing context, set 2d
var score = 0;

//============drawBall function=========================
var x = canvas.width/2,				 			// half of the width
    y = canvas.height -30, 						// a liitle above the bottom
	ballRadius = 10;

//============draw function==============================
var dx = 2, // the movement of the ball in width
	dy = -2;// the movement of the ball in height
//============drawPaddle function========================
var paddleHeight = 10,
	paddleWidth = 75,
	paddleX = (canvas.width - paddleWidth)/2; //start index of the paddle, center bottom
//============draw function==============================
var rightPressed = false,
	leftPressed = false;

//=====the brick function=================
var brickRowCount = 3,
	brickColumnCount = 5,
	brickWidth = 75,
	brickHeight = 20,
	brickPadding = 10,
	brickOffsetTop = 30,
	brickOffsetLeft = 30,
	bricks = [],
	c = 0,
	r = 0;

//create a two dimensional loop for the bricks
for (c = 0; c <brickColumnCount; c++){
	bricks[c] = [];
	for(r=0; r <brickRowCount; r++){
		bricks[c][r]= {x:0, y:0, status:1};
	}
}

//==========key Control=============
//add event listener when user press the key, left or right key
//keycode 39 is right and keycode 37 is left
document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);
//==========mouse Control=============
document.addEventListener("mousemove", mouseMoveHandler);

function keyDownHandler(e){
	if(e.keyCode === 39){
		rightPressed = true;
	}else if(e.keyCode === 37){
		leftPressed = true;
	}
}

function keyUpHandler(e){
	if(e.keyCode === 39){
		rightPressed = false;
	}else if(e.keyCode === 37){
		leftPressed = false;
	}
}

function mouseMoveHandler(e){
	var relativeX = e.clientX - canvas.offsetLeft;
	if (relativeX >0 && relativeX <canvas.width){
		paddleX = relativeX - paddleWidth/2;
	}
}


//==========The main function===========
function draw(){
	ctx.clearRect(0,0,canvas.width, canvas.height);
	drawBall();
	drawPaddle();
	drawBricks();
	collisionDetection();
	drawScore();
	
	// if the ball hit wall, reserve its direction
	// when the ball touches the wall, bouncing back
	
	// the ballRadius in the if statement ensure the ball bounches 
	// when it hits the wall, if change to 0 or delete it
	// ball will bounch when the center of the ball hit the wall, not the ball surface
	if(y + dy < ballRadius){ 
		dy = -dy;
	}else if(y + dy > canvas.height-ballRadius){
		// if the ball hit the bottom of canvas
		if(x > paddleX && x < paddleX + paddleWidth){
			// if ball hit the paddle, rebounce
			dy = -dy;
		}else {
			document.getElementById("gameStatus").innerHTML= "Game Over, your score is :" + score;
		}
	} 

	if( x + dx < ballRadius || x + dy > canvas.width-ballRadius){
		dx = -dx;
	}
	
	if(rightPressed && paddleX < canvas.width - paddleWidth){
		paddleX += 7;
	}else if(leftPressed && paddleX > 0){
		paddleX -= 7;
	}
	x += dx;
	y += dy;


}

//========Draw the ball============
function drawBall(){
	ctx.clearRect(0,0, canvas.width, canvas.height);
	ctx.beginPath();
	ctx.arc(x, y , ballRadius, 0, Math.PI*2);
	ctx.fillStyle ="#0095DD";
	ctx.fill();
	ctx.closePath();
}

//=========Draw paddle=================
function drawPaddle(){
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = "#000000";
	ctx.fill();
	ctx.closePath();
}
//=========Draw bricks=================
function drawBricks(){
	for ( c=0; c<brickColumnCount; c++){
		for( r=0; r<brickRowCount; r++){
			if(bricks[c][r].status ===1){
				var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
				var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
				bricks[c][r].x = brickX;
				bricks[c][r].y = brickY;

				ctx.beginPath();
				ctx.rect(brickX,brickY, brickWidth, brickHeight);
				ctx.fillStyle = "#0095DD";
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}
function collisionDetection(){
	for( c = 0; c <brickColumnCount; c++){
		for(r =0; r <brickRowCount; r++){
			var b = bricks[c][r];
			if(b.status == 1){
				if(x >b.x && x <b.x+ brickWidth && y> b.y && y<b.y+brickHeight){
					dy = -dy; // change direction
					b.status = 0;
					score++;
					highestScore(score);
					if(score == brickRowCount * brickColumnCount){
						alert("You Win!");
						document.location.reload();
					}
				}
			}
		}
	}
}

function drawScore(){
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Score: "+score, 8, 20);
}

// call all functions
setInterval(draw, 10);
