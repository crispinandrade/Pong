//Constants
var WIDTH = 700, 
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

player = {
    x:null,
    y:null,
    width: 20,
    height: 100,
    update: function() {
        if (keystate[upArrow]) this.y -= 7; // subtract 7px when up arrow
        if (keystate[downArrow]) this.y += 7;// add 7px when down arrow
    },
    draw: function() {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};
ai = {
    x:null,
    y:null,
    width: 20,
    height: 100,
    update: function() {},
    draw: function() {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
};
ball = {
    x:null,
    y:null,
    vel: null,
    side: 20,
    speed:5,
    update: function() {
        this.x += this.vel.x;
        this.y += this.vel.y;
        // Y collision
        if (0 > this.y || this.y + this.side > HEIGHT){ 
            // Fix ball moving out of the canvas (?=then :=else)
            var offset = this.vel.y < 0 ? 0 - this.y : HEIGHT - (this.y+this.side); 
            this.y += 2*offset;
            this.vel.y *= -1;
        }

        // X collision
        var paddleCollision = function(x1, y1, w1, h1, x2, y2, w2, h2) {
            return x1 < x2+w2 && y1 < y2 && x2 < x1+w1 && y2 < y1+h1;
        };

        var paddle = this.vel.x < 0 ? player : ai; // negative=player, positive=ai
        if (paddleCollision(paddle.x, paddle.y, paddle.width, paddle.height, 
                            this.x, this.y, this.side, this.side)
        ){ 
            this.x = paddle===player ? player.x+player.width : ai.x - this.side;
            var n = (this.y+this.side - paddle.y)/(paddle.height+this.side);
            var reflectionAngle = 0.25*pi*(2*n - 1); // convert to radians
            this.vel.x = (paddle===player ? 1 : -1)*this.speed*Math.cos(reflectionAngle);
            this.vel.y = this.speed*Math.sin(reflectionAngle);
        }
    },
    draw: function() {
        ctx.fillRect(this.x, this.y, this.side, this.side);
    }
};

function main() {
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

    ball.x = (WIDTH - ball.side)/2;
    ball.y = (HEIGHT - ball.side)/2;

    ball.vel = {
        x: ball.speed,
        y: 0,
    };
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

// Start Pong
main();