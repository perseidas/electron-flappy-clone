// Add credits of this game here

var

canvas,
ctx,
width,
height,

fgpos = 0,
frames = 0,
score = 0,
best = localStorage.getItem("best") || 0,

// State vars

currentstate,
states = {
	Splash: 0, Game: 1, Score: 2
},

// Game objects

/* Ok button */
okbtn,

/* Bird */
bird = {

	x: 80,
	y: 100,

	frame: 0,
	velocity: 0,
	animation: [0, 1, 2, 1],

	rotation: 0,
	radius: 12,

	gravity: 0.25,
	_jump: 4.6,

	/* Flap and jump */
	jump: function() {
		this.velocity = -this._jump;
	},

	/* Update animation and position */
	update: function() {
		/* Ok make sure animation updates and plays
		faster in gamestate */
		var n = currentstate === states.Splash ? 10 : 5;
		this.frame += frames % n === 0 ? 1 : 0;
		this.frame %= this.animation.length;

		/* In splash state make bird hover up
		and down and set rotation to zero */
		if (currentstate === states.Splash) {
			this.y = height - 280 + 5*Math.cos(frames/10);
			this.rotation = 0.1*Math.sin(frames/10);
		}
		/* Game and score state */
		else {
			this.velocity += this.gravity;
			this.y += this.velocity;

			/* Change to the score state
			when bird touches the ground */
			if (this.y >= height - s_fg.height-10) {
				this.y = height - s_fg.height-10;
				if (currentstate === states.Game) {
					currentstate = states.Score;
				}
				/* Sets velocity to jump spped
				for correct rotation */
				this.velocity = this._jump;
			}

			/* When bird lack upward momentum
			increment the rotation angle */
			if (this.velocity >= this._jump) {

				this.frame = 1;
				this.rotation = Math.min(Math.PI/2, this.rotation + 0.3);
			} else {
				this.rotation = -0.3;
			}
		}

	},

	/* Draws bird with rotation to canvas ctx
	@param {CanvasRenderingContext2D} ctx the
	context used for drawing
	*/
	draw: function(ctx) {
		ctx.save();
		/* Translate and rotate ctx */
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);

		var n = this.animation[this.frame];

		/* Draw bird with center in origin */
		s_bird[n].draw(ctx, -s_bird[n].width/2, -s_bird[n].height/2);

		ctx.restore();
	}
};


/* Pipes */
pipes = {

	_pipes: [],

	/* Reset pipes array */
	reset: function() {
		this._pipes = [];
	},

	/* Create, push, and update
	all pipes in pipe array */
	update: function() {
		if (frames % 100 === 0) {
			/* Calculate y position */
			var _y = height - (s_pipeSouth.height + s_fg.height + 120 + 200*Math.random());
			/* Create and push pipe to array */
			this._pipes.push({
				x: 500,
				y: _y,
				width: s_pipeSouth.width,
				height: s_pipeSouth.height
			});
		}
		for (var i = 0, len = this._pipes.length; i < len; i++) {
			var p = this._pipes[i];
			var m = 20*Math.cos(frames/50);

			if (i === 0) {

				score += p.x === bird.x ? 1 : 0;

				/* Collision check */
				var cx = Math.min(Math.max(bird.x, p.x), p.x + p.width);
				var cy1 = Math.min(Math.max(bird.y, p.y + m), p.y + p.height + m);
				var cy2 = Math.min(Math.max(bird.y, p.y + p.height + 80 + m), p.y + 2*p.height + 80 + m);
				/* Closest difference */
				var dx = bird.x - cx;
				var dy1 = bird.y - cy1;
				var dy2 = bird.y - cy2;
				/* Vector length */
				var d1 = dx*dx + dy1*dy1;
				var d2 = dx*dx + dy2*dy2;
				var r = bird.radius*bird.radius;
				/* Determine intersection */
				if (r > d1 || r > d2) {
					currentstate = states.Score;
				}
			}
			/* Move pipe and remove
			if outside of canvas */
			p.x -= 2;
			if (p.x < -50) {
				this._pipes.splice(i, 1);
				i--;
				len--;
			}
		}
	},

	/* Draw all pipes to canvas ctx
	@param {CanvasRenderingContext2D} ctx
	the context used for drawing
	*/
	draw: function(ctx) {
		for (var i = 0, len = this._pipes.length; i < len; i++) {
				var p = this._pipes[i];
				var m = 20*Math.cos(frames/50);
				s_pipeSouth.draw(ctx, p.x, p.y + m);
				s_pipeNorth.draw(ctx, p.x, p.y + 80 + p.height + m);
			}
	}
};

/* Called on mouse or touch press
Update and change state depending on current game state
@param {MouseEvent/TouchEvent} evt tho on press event
*/
function onpress(evt) {

	switch (currentstate) {

		/* Change state and update bird velocity */
		case states.Splash:
			currentstate = states.Game;
			bird.jump();
			break;

		/* Update bird velocity */
		case states.Game:
			bird.jump();
			break;

		/* Change state if event within
		okbutn bounding box */
		case states.Score:
			/* Get event position */
			var mx = evt.offsetX, my = evt.offsetY;

			 if (mx == null || my == null ||
			 (okbtn.x < mx && mx < okbtn.x + okbtn.width &&
 				okbtn.y < my && my < okbtn.y + okbtn.height)) {
				// mx = evt.touches[0].clientX;
				// my = evt.touches[0].clientY;
				pipes.reset();
				currentstate = states.Splash;
				score = 0;
			 }

			/* Check if within */
			// if (okbtn.x < mx && mx < okbtn.x + okbtn.width &&
			//	okbtn.y < my && my < okbtn.y + okbtn.height
			//	) {
			//	pipes.reset();
			//	currentstate = states.Splash;
			//	score = 0;
			//}
			break;
	}
}

/* Start and initiate the game */
function main(){
	/* Create canvas and set width/height */
	canvas = document.createElement("canvas");

	width = window.innerWidth;
	height = window.innerHeight;

	var evt = "touchstart";
	if (width >= 500) {
		width  = 320;
		height = 480;
		canvas.style.border = "1px solid #000";
		evt = "mousedown";
		// evt = "keypress";
	}

	/* Listen for input event */
	document.addEventListener(evt, onpress);
	document.addEventListener("keypress", onpress);

	canvas.width = width;
	canvas.height = height;
	if (!(!!canvas.getContext && canvas.getContext("2d"))) {
		alert("Your browser doesn't support HTML5, please update to latest version");
	}
	ctx = canvas.getContext("2d");

	currentstate = states.Splash;

	/* Append canvas to document */
	document.getElementById("game-div").appendChild(canvas);

	/* Initiate graphics and okbtn */
	var img = new Image();
	img.onload = function() {
		initSprites(this);
		ctx.fillStyle = s_bg.color;

		okbtn = {
			x: ( width - s_buttons.Ok.width)/2,
			y: height - 200,
			width: s_buttons.Ok.width,
			height: s_buttons.Ok.height
		};

		run();

	}
	img.src = "res/sheet.png";

}

/* Starts and update gameloop */
function run(){
	var loop = function() {
		update();
		render();
		window.requestAnimationFrame(loop, canvas);
	}
	window.requestAnimationFrame(loop, canvas);
}

/* Update foreground, bird and pipes position */
function update(){
	frames++;

	if (currentstate !== states.Score) {
		fgpos = (fgpos - 2) % 14;
	} else {
		best = Math.max(best, score);
	}
	if (currentstate === states.Game) {
		pipes.update();
	}

	bird.update();
}

/* Draws bird and all pipes and assets to the canvas */
function render(){
	/* draw background color */
	ctx.fillRect(0, 0, width, height);
	/* draw background sprites */
	s_bg.draw(ctx, 0, height - s_bg.height);
	s_bg.draw(ctx, s_bg.width, height - s_bg.height);

	pipes.draw(ctx);
	bird.draw(ctx);

	/* draw foreground sprites */
	s_fg.draw(ctx, fgpos, height - s_fg.height);
	s_fg.draw(ctx, fgpos + s_fg.width, height - s_fg.height);

	/* center of canvas */
	var width2 = width/2;

	if (currentstate === states.Splash) {
		/* draw splash text and sprite to canvas */
		s_splash.draw(ctx, width2 - s_splash.width/2, height - 300);
		s_text.GetReady.draw(ctx, width2 - s_text.GetReady.width/2, height - 380);
	}
	if (currentstate === states.Score) {
		/* draw gameover text and score board */
		s_text.GameOver.draw(ctx, width2 - s_text.GameOver.width/2, height - 400);
		s_score.draw(ctx, width2 - s_score.width/2, height - 340);
		s_buttons.Ok.draw(ctx, okbtn.x, okbtn.y);
		/* draw score and best inside the score board */
		s_numberS.draw(ctx, width2 - 47, height - 304, score, null, 10);
		s_numberS.draw(ctx, width2 - 47, height - 262, best, null, 10);

	} else {
		/* draw score to top of canvas */
		s_numberB.draw(ctx, null, 20, score, width2);
	}
}

// Start and run the game
main();
