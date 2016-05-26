function Player() {
    this.x = 180;
    this.y = 170;
}

Player.prototype.moveUp = function(dt) { this.y -= SPEED * dt; };
Player.prototype.moveDown = function(dt) { this.y += SPEED * dt; };
Player.prototype.moveLeft = function(dt) { this.x -= SPEED * dt; };
Player.prototype.moveRight = function(dt) { this.x += SPEED * dt; };

Player.prototype.draw = function(ctx) {
    ctx.fillStyle = 'rgb(255,255,100)';
	ctx.beginPath();
	ctx.arc(this.x, this.y, 4, 0, RAD, false);
	ctx.fill();
};

var player = new Player();

Events.on("keyUp", player.moveUp);
Events.on("keyDown", player.moveDown);
Events.on("keyLeft", player.moveLeft);
Events.on("keyRight", player.moveRight);
