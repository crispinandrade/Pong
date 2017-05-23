//Constants
var WIDTH = 800, 
    HEIGHT = 600, 
    pi=Math.PI,
    upArrow = 38,
    downArrow = 40,
    canvas, 
    ctx, 
    keystate,
    player, 
    ai, 
    ball;

//Player paddle object
player = {
    x:null,
    y:null,
    width: 20,
    height: 100,
    update: function() {
        // Add or subtract 7px when up arrow or down arrow
        if (keystate[upArrow]) this.y -= 10; 
        if (keystate[downArrow]) this.y += 10;
        // restrict paddles within the canvas
        this.y = Math.max(Math.min(this.y, HEIGHT - this.height), 0); 
    },
    draw: function() {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};

//Computer paddle object
ai = {
    x:null,
    y:null,
    width: 20,
    height: 100,
    update: function() {
        var hit = ball.y - (this.height - ball.side)*0.5;
        this.y += (hit - this.y) * 0.1;
        // restrict paddles within canvas
        this.y = Math.max(Math.min(this.y, HEIGHT - this.height), 0); 
    },
    draw: function() {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};

// Ball object
ball = {
    x:null,
    y:null,
    vel: null,
    side: 20,
    speed:10,

    // Serves ball to player or compter direction
    serve: function(side){
        var r = Math.random();
        this.x = side===1 ? player.x+player.width : ai.x - this.side;
        this.y = (HEIGHT - this.side)*r;

        var reflectionAngle = 0.1*pi*(1-2*r);
        this.vel = {
            // Angle and speed of the serve
            x:side*this.speed*Math.cos(reflectionAngle),
            y: this.speed*Math.sin(reflectionAngle)
        }
    },

    // Update ball's X and Y position to calculate collisions
    update: function() {
        this.x += this.vel.x;
        this.y += this.vel.y;
        // Y collision with canvas
        if (0 > this.y || this.y + this.side > HEIGHT){ 
            // Fix ball moving out of the canvas (?=then :=else)
            var offset = this.vel.y < 0 ? 0 - this.y : HEIGHT - (this.y+this.side); 
            this.y += 2*offset;
            this.vel.y *= -1;
        }
        // X collision with paddle
        var paddleCollision = function(x1, y1, w1, h1, x2, y2, w2, h2) {
            return x1 < x2+w2 && y1 < y2+h2 && x2 < x1+w1 && y2 < y1+h1;
        };
        // negative=player, positive=ai
        var paddle = this.vel.x < 0 ? player : ai; 
        if (paddleCollision(paddle.x, paddle.y, paddle.width, paddle.height, 
                            this.x, this.y, this.side, this.side)
        ){ 
            this.x = paddle===player ? player.x+player.width : ai.x - this.side;
            var n = (this.y+this.side - paddle.y)/(paddle.height+this.side);
            // convert to radians
            var reflectionAngle = 0.25*pi*(2*n - 1); 

            // smash velocity when ball hits the edge of paddles
            var smash = Math.abs(reflectionAngle) > 0.2*pi ? 1.5 : 1;
            this.vel.x = smash*(paddle===player ? 1 : -1)*this.speed*Math.cos(reflectionAngle);
            this.vel.y = smash*this.speed*Math.sin(reflectionAngle);
        }

        // serve the ball again when the player or computer wins
        if (0 > this.x+this.side || this.x > WIDTH){
            this.serve(paddle===player ? 1 : -1);
        }
    },

    // create the ball object
    draw: function() {
        ctx.fillRect(this.x, this.y, this.side, this.side);
    }
};

// Main to start the game
function main() {
    // Add canvas to html
    canvas = document.createElement("canvas");
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    ctx = canvas.getContext('2d');
    document.body.appendChild(canvas);

    keystate = {};
    document.addEventListener("keydown", function(evt) { // checks if key is pressed
        keystate[evt.keyCode] = true;
    });
    document.addEventListener("keyup", function(evt) { // checks if key is not pressed
        delete keystate[evt.keyCode]; 
    });

    // Call init function to create paddles and ball objects
    init(); 

    var loop = function() {
        update();
        draw();
        window.requestAnimationFrame(loop, canvas);
    };
    window.requestAnimationFrame(loop, canvas);
}

//initialise objects
function init() {
    player.x = player.width;
    player.y = (HEIGHT - player.height)/2;

    ai.x = WIDTH - (player.width + ai.width);
    ai.y = (HEIGHT - ai.height)/2;

    ball.serve(1);
}
function update() {
    player.update();
    ball.update();
    ai.update();   
}
function draw() {
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    ctx.save();
    
    ctx.fillStyle = "#fff";

    player.draw();
    ball.draw();
    ai.draw();

    //Draw center dotted line
    var w = 4;
    var x = (WIDTH - w)*0.5;
    var y = 0;
    var step = HEIGHT/25;
    while (y < HEIGHT) {
        ctx.fillRect(x, y+step*0.25, w, step*0.5);
        y += step;
    }

    ctx.restore();
}

// Called main to run the game
main();