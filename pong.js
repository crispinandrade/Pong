var pi = Math.PI;
var canvas, context, keystate;
var player, ai, ball;

player = {
    x:null,
    y:null,
    width: 20,
    height: 100,
    update: function() {},
    draw: function(){
        context.fillRect(this.x, this.y, this.width, this.height);
    }
};
ai = {
    x:null,
    y:null,
    width: 20,
    height: 100,
    update: function() {},
    draw: function(){
        context.fillRect(this.x, this.y, this.width, this.height);
    }
};
ball = {
    x:null,
    y:null,
    side: 20,
    update: function() {},
    draw: function(){
        context.fillRect(this.x, this.y, this.width, this.height);
    }
};

function main() {
    canvas = document.getElementById('pong');
    context = canvas.getContext('2d');
    document.body.appendChild(canvas);

    init();

    var loop = function() {
        update();
        draw();

        window.requestAnimationFrame(loop, canvas);
    };
    window.requestAnimationFrame(loop, canvas);
}

function init() {
    player.x = player.width;
    player.y = (canvas.height - player.height)/2;
    ai.x = canvas.width - (player.width + ai.width);
    ai.y = (canvas.height - ai.height)/2;
    ball.x = (canvas.width - ball.side)/2;
    ball.y = (canvas.height - ball.side)/2;
}

function update() {
    ball.update();
    player.update();
    ai.update();
}

function draw() {
    ball.draw();
    player.draw();
    ai.draw();
}