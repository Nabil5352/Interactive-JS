const canvas = document.getElementById("gemeCanvas");
let ctx = canvas.getContext("2d");

//ball
let ballRadius = 10;

let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;

//paddle
let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth)/2;

//control
let rightPressed = false;
let leftPressed = false;

//brick wall
let brickRowCount = 5;
let brickColumnCount = 3;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

//score
let score = 0;
let lives = 3;

let bricks = [];
for (let i = 0; i < brickColumnCount; i++) {
	bricks[i] = [];
	for (let j = 0; j < brickRowCount; j++) {
		bricks[i][j] = {x: 0, y: 0, status: 1};
	}
}

//event listener for control
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function keyDownHandler(event){
	if(event.keyCode == 39){
		rightPressed = true;
	}else if(event.keyCode == 37){
		leftPressed = true;
	}
}
function keyUpHandler(event){
	if(event.keyCode == 39){
		rightPressed = false;
	}else if(event.keyCode == 37){
		leftPressed = false;
	}
}
function mouseMoveHandler(event){
	let relativeX = event.clientX - canvas.offsetLeft;
	if(relativeX > 0 && relativeX < canvas.width){
		paddleX = relativeX - paddleWidth/2;
	}
}

//collision detection
function collisionDetection(){
	for (let i = 0; i < brickColumnCount; i++) {
		for (let j = 0; j < brickRowCount; j++) {
			let b = bricks[i][j];
			if(b.status == 1){
				if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight){
					dy = -dy;
					b.status = 0;
					score++;
					if(score == brickRowCount*brickColumnCount){
						console.log("YOU WIN, CONGRATULATIONS!");
						document.location.reload();
					}
				}
			}
		}
	}
}

//draw ball
function drawBall(){
	ctx.beginPath();
	ctx.arc(x, y, ballRadius, 0, Math.PI*2);
	ctx.fillStyle="#0095DD";
	ctx.fill();
	ctx.closePath();
}
//draw paddle
function drawPaddle(){
	ctx.beginPath();
	ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}
//draw bricks
function drawBricks(){
	for (let i = 0; i < brickColumnCount; i++) {
		for (let j = 0; j < brickRowCount; j++) {
			if(bricks[i][j].status == 1){
				let brickX = (j*(brickWidth+brickPadding)+brickOffsetLeft);
				let brickY = (i*(brickHeight+brickPadding)+brickOffsetTop);
				bricks[i][j].x = brickX;
				bricks[i][j].y = brickY;
				ctx.beginPath();
				ctx.rect(brickX, brickY, brickWidth, brickHeight);
				ctx.fillStyle = "#0095DD";
				ctx.fill();
				ctx.closePath();
			}
		}
	}
}
//draw score
function drawScore(){
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Score: "+score, 8, 20);
}
//draw lives
function drawLives(){
	ctx.font = "16px Arial";
	ctx.fillStyle = "#0095DD";
	ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}


function draw(){
	ctx.clearRect(0,0,canvas.width,canvas.height);
	drawBricks();
	drawBall();
	drawPaddle();
	drawScore();
	drawLives();
	collisionDetection();

	if(x + dx > canvas.width - ballRadius || x + dx < ballRadius){
		dx = -dx;
	}
	if(y + dy < ballRadius){
		dy = -dy;
	}else if(y + dy > canvas.height - ballRadius){
		if(x > paddleX && x < paddleX + paddleWidth){
			dy = -dy;
		}else{
			lives--;
			if(!lives){
				console.log("GAME OVER!");
				document.location.reload();
			}else{
				x = canvas.width / 2;
				y = canvas.height - 30;
				dx = 3;
				dy = -3;
				paddleX = (canvas.width - paddleWidth)/2;
			}
		}
	}

	//move paddle
	if(rightPressed && paddleX < canvas.width - paddleWidth){
		paddleX += 5;
	}else if(leftPressed && paddleX > 0){
		paddleX -= 5;
	}

	x += dx;
	y += dy;

	requestAnimationFrame(draw);
}

draw();