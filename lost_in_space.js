"use strict";
// Project made by Audic XU and Tasnim Laiouar


class lost_in_space{
  constructor(ctx, t1, t2, t3, t4, alien_dx, alien_dy, SpaceShipSpeed){
    this.t1 = t1;
    this.t2 = t2;
    this.t3 = t3;
    this.t4 = t4;
    // t1, t2 SpaceShip size
    // t3, t4 Alien size
    this.speed = SpaceShipSpeed;
    this.SpaceShip = new SpaceShip(300, 600 - 50 - 5, this.t1, this.t2, ctx);
    this.Aliens = [];
    this.Bullets = [];
    this.ctx = ctx;
    this.Dead = false;
    // this.Dead is used in 'this.draw()'
    this.score = 0;
    this.alien_dx = alien_dx;
    this.alien_dy = alien_dy;
    // this.speed is used by the spaceship and by the bullets at constructor
    this.refreshAddAliens();
  }


  refreshAddAliens(){
    if (this.Aliens.length === 0 && !this.dead){
      this.alien_dx *= 1.1;
      this.alien_dy *= 1.1;
      let numberOfAlien = 6 + (this.score / 6);
      for (let i = 0; i <  numberOfAlien; i++) {
        let random_alien = new Alien(50 + (550 / numberOfAlien) * i,
          this.t2 + Math.floor(Math.random() * 300),
          this.t3, this.t4, this.alien_dx, this.alien_dy, ctx);
        this.Aliens.push(random_alien);
        }
    }
  }

  draw(){
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < this.Aliens.length; i++){
      this.Aliens[i].draw();
    }
    this.SpaceShip.draw();
    for (let i = 0; i < this.Bullets.length; i++){
      this.Bullets[i].draw();
    }
    // if dead show game over
    if (this.dead) {
      this.drawGameOver();
    }
  }

  createBullet(){
    let bullet = new Bullet(this.SpaceShip.x, this.SpaceShip.y,
                            this.t2 ,this.speed, ctx);
    this.Bullets.push(bullet);
  }

  refreshBullets() {
    /* Update Bullets position */
    let remember = [];
    for (let i = 0; i < this.Bullets.length; i++) {
      this.Bullets[i].dy *= 0.99;
      this.Bullets[i].y -= this.Bullets[i].dy;
      // check bullet range
      let starting_position = this.Bullets[i].starting_position;
      let current_position = this.Bullets[i].y;
      if (starting_position - 300 > current_position) {
        // range is exceeded
        remember.push(i)
      }
    }

    if (remember.length >= 1) {
      // shift: remove the first element
      this.Bullets.shift();
    }
  }

  refreshAliens(){
    /* Update ALiens position */
    for (let i = 0; i <this.Aliens.length; i++){

      if (this.Aliens[i].x > 600 - this.t3 || this.Aliens[i].x < this.t3) {
        this.Aliens[i].dx *= -1.1;
      }
      if (this.Aliens[i].y > 600 - this.t4 - 10 || this.Aliens[i].y < this.t4 + 10) {
        this.Aliens[i].dy *= -1.1;
      }
      this.Aliens[i].x += this.Aliens[i].dx;
      this.Aliens[i].y += this.Aliens[i].dy;
    }
  }

  refreshSelf(Direction){
    // Direction: "ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"
    if (Direction === "ArrowLeft"){
      if (this.SpaceShip.x - this.t1 >= 0){
        this.SpaceShip.x -= this.speed;
        this.draw();
      }
    } if (Direction === "ArrowUp"){
      if (this.SpaceShip.y - 1.5 * this.t2 >= 0){
        this.SpaceShip.y -= this.speed;
        this.draw();
      }
    } if (Direction === "ArrowRight"){
      if (this.SpaceShip.x + this.t1 <= 600){
        this.SpaceShip.x += this.speed;
        this.draw();
      }
    } if (Direction === "ArrowDown"){
      if (this.SpaceShip.y + this.t2<= 600){
        this.SpaceShip.y += this.speed;
        this.draw();
      }
    }

  }

  checkBullet(){
    /* Check Bullets with Aliens */
    for (let j = 0; j < this.Bullets.length; j++){
      let x = this.Bullets[j].x;
      let y = this.Bullets[j].y ;
      let rememberAlien = [];
      let rememberBullet = [];
      for (let i = 0; i < this.Aliens.length; i++){
        let x_between = (this.Aliens[i].x + this.t3 >= x) &&
          (x >= this.Aliens[i].x - this.t3);
        let y_between = (this.Aliens[i].y + this.t4 >= y) &&
          (y >= this.Aliens[i].y - this.t4);

        if (x_between && y_between) {
          // if hit each other
          rememberAlien.push(i);
          rememberBullet.push(j);
          this.score += 1;
        }
      }

      for (let i = rememberAlien.length - 1; i >= 0; i--){
        // remove the bullets and aliens
        let indexAlien = rememberAlien[i];
        this.Aliens.splice(indexAlien, 1);
      }
      for (let j = rememberBullet.length - 1; j >= 0; j--){
        let indexBullet = rememberBullet[j];
        this.Bullets.splice(indexBullet, 1);
      }
    }
  }

  checkCrash(){
    /* Check SpaceShip with Alien*/
    let x_left = this.SpaceShip.x - this.t1;
    let y_up = this.SpaceShip.y - this.t2;
    let x_right = this.SpaceShip.x + this.t1;
    let y_down = this.SpaceShip.y + this.t2;

    // consider alien and spaceship having a square shape
    for (let i = 0; i < this.Aliens.length; i++){
      let x_between = (this.Aliens[i].x + this.t3 >= x_left) &&
          (x_right >= this.Aliens[i].x - this.t3);
      let y_between = (this.Aliens[i].y + this.t4 >= y_up) &&
          (y_down >= this.Aliens[i].y - this.t4);

      if (x_between && y_between) {
        // clear game area
        this.Aliens = [];
        this.dead = true;
      }
    }
  }
  checkSelf(){

    /* Check SpaceShip with Bullet */
    let x_left = this.SpaceShip.x - this.t1;
    let y_up = this.SpaceShip.y - this.t2;
    let x_right = this.SpaceShip.x + this.t1;
    let y_down = this.SpaceShip.y + this.t2;
    for (let i = 0; i < this.Bullets.length; i++){
      let x = this.Bullets[i].x;
      let y = this.Bullets[i].y;
      let x_between = (x_left <= x) && (x <= x_right);
      let y_between = (y_up <= y) && (y <= y_down);
      if (x_between && y_between){
        this.Aliens = [];
        this.dead = true;
      }
    }
  }
  
  drawGameOver(){
    // draw game over and score
    this.ctx.beginPath();
    this.ctx.fillStyle = "#B0E0E6"; //Nuance de bleu
    this.ctx.fillRect(0, 0, 600, 600);
    ctx.strokeStyle = "white";
    ctx.fillStyle = "white";
    ctx.font = "100px Arial";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", 300, 300);
    ctx.font = "40px Lucida Sans Unicode";
    ctx.fillText("Score : " + this.score, 300, 350);
  }

}



class SpaceShip{
  constructor(x, y, t1, t2, ctx){
    this.x = x;
    this.y = y;
    this.t1 = t1;
    this.t2 = t2;
    this.ctx = ctx;
    // SpaceShip size: t1, t2
  }

  draw(){
    // Triangle shape
    this.ctx.beginPath();
    this.ctx.moveTo(this.x - this.t1, this.y + this.t2);
    this.ctx.lineTo(this.x + this.t1, this.y + this.t2);
    this.ctx.lineTo(this.x, this.y - this.t2);
    this.ctx.lineTo(this.x - this.t1, this.y + this.t2);
    this.ctx.fillStyle = "orange";
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.moveTo(this.x , this.y-5*2 );
    this.ctx.arc(this.x , this.y-5*3, 25, 0, 2 * Math.PI);
    this.ctx.fillStyle = "orange";
    this.ctx.fill();
  }

}


class Alien{
  constructor(x, y, t1, t2, dx, dy, ctx){
    this.x = x;
    this.y = y;
    this.t1 = t1;
    this.t2 = t2;
    this.dx = dx;
    this.dy = dy;
    this.ctx = ctx;
    // Alien size: t1, t2
    // Alien movement: dx, dy
  }

  draw(){ // space
    // SpaceShip size: t1,t2
    this.ctx.beginPath();
    this.ctx.moveTo(this.x - this.t1, this.y + this.t2);
    this.ctx.lineTo(this.x + this.t1, this.y + this.t2);
    this.ctx.lineTo(this.x, this.y - this.t2);
    this.ctx.lineTo(this.x - this.t1, this.y + this.t2);
    this.ctx.fillStyle = "green";
    this.ctx.fill();
    this.ctx.beginPath();
    this.ctx.moveTo(this.x , this.y-5*2 );
    this.ctx.arc(this.x , this.y-5*2, 13, 0, 2 * Math.PI);
    this.ctx.fillStyle = "green";
    this.ctx.fill();
  } 

}


class Bullet{
  constructor(x, y, t2, speed, ctx){
    this.x = x;
    this.y = y - t2;
    this.starting_position = y;
    this.dy = speed;
    this.ctx = ctx;
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.fillStyle = "lightblue";
    this.ctx.arc(this.x, this.y - this.dy, 5, 0, 2 * Math.PI);
    this.ctx.fill();
  }

}
