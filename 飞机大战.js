var img11 = new Image();
img11.src = 'img/plane1.png';
var img2 = new Image();
img2.src ='img/bullet11.png';
var planebulletimg = new Image();
planebulletimg.src ='img/planebullet.png';
var boss2bulletimg = new Image();
boss2bulletimg.src = 'img/bullet111.png';
var enemy1img = new Image();
enemy1img.src ='img/enemy11.png';
var enemy2 = new Image();
enemy2.src = 'img/enemy2.png';
var boss1 = new Image();
boss1.src = 'img/Boss1.png';
var boss22 = new Image();
boss22.src = 'img/Boss22.png';
var Obstacle1img = new Image();
Obstacle1img.src = 'img/Obstacle1.png';
var treatment =new Image();
treatment.src = 'img/treatment.png';
var greenbulletprop = new Image();
greenbulletprop.src = 'img/greenbulletprop.png';
var redbulletprop = new Image();
redbulletprop.src = 'img/redbulletprop.png';
var bg1 =new Image();
bg1.src =  'img/bg-1.jpg';
var bg2 =new Image();
bg2.src =  'img/bg-2.jpg';
var bg3 =new Image();
bg3.src =  'img/bg-3.jpg';
var enemyhp=300;
var planehp=1000;
var boss1hp=4000;
var boss2hp=100000;
var score=0;
var lastscore=0;
var skillbar=100;//技能条
function angleToGradiant(angle) {
    return Math.PI / 180 *angle
}

//移动物体
// row 行
// col 列
function MoveObject(speed,size,img,c,r) {
    var _this = this;
    this.speed = speed;
    this.size = size;
    this.img = img;
    this.c = c;
    this.r = r;
    this.draw = function () {
        ctx.beginPath();
        ctx.drawImage(_this.img,_this.c,_this.r,_this.img.width ,_this.img.height,_this.moveX1,_this.moveY1,_this.size ,_this.size);
    };
}
//飞机
function Plane(game) {
    var _this = this;
    MoveObject.call(this,10,100,img11,0,0);
    this.game=game;
    this.moveX = cvs.width / 2 -_this.size/2;
    this.moveY = cvs.height -_this.size;
    this.size=_this.img.width / 4;
    this.planeHp = planehp;
    this.t=1;
    this.angle=0;
    this.firestate = false;
    this.fireCD = 5;
    this.currentCD = 0;
    this.bulletsposition=0;
    this.skillbar=0;
    this.skillstate='close';
    this.skillswitch=false;
    //技能持续时间
    this.currentskillCD=0;
    this.skillCD=120;
    this.c=this.bulletsposition;
    this.draw = function () {
        ctx.beginPath();
        ctx.fillStyle = 'green';
        ctx.fillRect(_this.moveX,_this.moveY - _this.size/2,_this.planeHp / planehp * _this.size,10);
        ctx.strokeRect(_this.moveX,_this.moveY-_this.size/2,_this.size,10);
        ctx.beginPath();
        ctx.drawImage(_this.img,_this.img.width / 4 * _this.c,0,_this.img.width / 4 ,_this.img.height,_this.moveX,_this.moveY,_this.size ,_this.size)
    };
    this.setmovestate = function (objectstate, angle) {
        this.objectstate = objectstate;
        this.angle = angle;
    };
    this.updatePos= function () {
        switch (this.objectstate) {
            case "idle": {
                break;
            }
            case "move": {

                _this.moveX+=_this.speed * _this.t * Math.cos(_this.angle);
                _this.moveY+=_this.speed * _this.t* Math.sin(_this.angle);
                if (_this.moveX < 0) {
                    _this.moveX=0;
                }
                else if (_this.moveX  > cvs.width-_this.size) {
                    _this.moveX  = cvs.width-_this.size
                }
                else if (_this.moveY < 0) {
                    _this.moveY = 0
                }
                else if (_this.moveY > cvs.height-_this.size) {
                    _this.moveY = cvs.height-_this.size
                }
                break;
            }
        }
        this.currentCD++;
        if (this.firestate) {
            this.fire();
        }
        if(_this.skillswitch==true){
            _this.openskill();
        }
        _this.c=_this.game.bulletstate;
        _this.speed=10+_this.c*4;
        _this.fireCD=10-_this.c*2;

    };
    this.fire = function () {
        if (this.currentCD >= this.fireCD) {
            this.currentCD = 0;
            _this.bulletsposition=0;
            if(_this.game.bulletstate==0||_this.game.bulletstate==1){
                _this.game.bullets.push(new PlaneBullet(_this.game.plane.moveX,_this.game.plane.moveY,0,_this.game.bulletstate,_this.game.hurt));
            }else if(_this.game.bulletstate==2) {
                for(var i=0;i<3;i++) {
                    _this.bulletsposition++;
                    _this.game.bullets.push(new PlaneBullet(_this.game.plane.moveX,_this.game.plane.moveY,0,_this.game.bulletstate,_this.game.hurt,_this.bulletsposition));
                }
            }

        }
    };
    this.drawskillbar = function () {
        ctx.beginPath();
        ctx.save();
        ctx.translate(cvs.width*0.04,cvs.height*0.9);
        ctx.rotate(Math.PI/180*-90);
        ctx.fillStyle = 'green';
        ctx.fillRect(0,0,_this.skillbar/skillbar*cvs.width*0.6,15);
        ctx.strokeRect(0,0,cvs.width*0.6,15);
        ctx.restore();
    };
    this.openskill = function () {
        if(_this.skillstate=='open'){
            this.currentskillCD++;
            _this.skillbar=skillbar-skillbar/this.skillCD*this.currentskillCD;
            if (this.currentskillCD >= this.skillCD) {
                this.currentskillCD = 0;
                _this.skillswitch=false;
                this.skillstate='close';

            }else {
                for(var j=0;j<50;j++){
                    _this.game.bullets.push(new PlaneBullet(Math.random()*cvs.width,Math.random()*cvs.height,0,0,_this.game.hurt));
                }
            }


        }
    };

}
//子弹
/*function Buttets(speed,size,img,c,r) {
    var _this = this;
    this.speed = speed;
    this.size = size;
    this.img = img ;
    this.c= c;
    this.r = r;
    MoveObject.call(this,this.speed,this.size);
    this.draw = function () {
        ctx.drawImage(img2,0,0,img2.width / 4 *4 ,img2.height / 4 *4,_this.moveX,_this.moveY,img2.width / 4  *4,img2.height / 4 *4);
    };
    this.updatePos =function () {
        _this.moveY -= _this.speed;
    }
}*/
//飞机子弹
function PlaneBullet(moveX,moveY,id,bullutstate,hurt,bulletposition) {
    var _this = this;
    MoveObject.call(this,10,20,planebulletimg,0,0);
    this.moveX = moveX + 30 ;
    this.moveY = moveY;
    this.c=bullutstate;
    this.hurt=hurt;
    this.t=1;
    this.id =id;
    this.bulletsposition=bulletposition;
    this.dead =false;
    this.draw = function () {
        ctx.drawImage(_this.img,_this.img.width / 4 *_this.c,_this.img.height/4*_this.r,_this.img.width/4,_this.img.height,_this.moveX,_this.moveY,_this.size,_this.size);
    };
    this.updatePos =function () {
        if(_this.c==0) {
            _this.speed=10;
            _this.moveY -= _this.speed * _this.t;
        }else if(_this.c==1){
            _this.speed=20;
            _this.moveY -= _this.speed * _this.t;
        }else if(_this.c==2){
            if(_this.bulletsposition==1){
                _this.moveX= moveX+10;
            }else if(_this.bulletsposition==2){
                _this.moveX= moveX+30;
            }else if(_this.bulletsposition==3){
                _this.moveX= moveX+50;
            }
            _this.moveY -= _this.speed * _this.t;
        }
    };
    this.collision = function () {
        if(_this.moveY<0||_this.moveY>cvs.height){
            _this.dead=true;
        }
    }

}
//敌人1号子弹
function Enemy1Bullet(game,moveX1,moveY1,id,index) {
    var _this = this;
    MoveObject.call(this,5,20,img2,4,4);
    this.game=game;
    this.moveX = moveX1 + this.game.enemies[index].size/2;
    this.moveY = moveY1 + this.game.enemies[index].size;
    this.t=1;
    this.id=id;
    this.dead =false;
    this.draw = function () {
        ctx.drawImage(_this.img,0,0,_this.img.width / 4 *_this.c ,_this.img.height / 4 *_this.r,_this.moveX,_this.moveY,_this.size,_this.size);
    };
    this.updatePos = function () {
        _this.moveY += _this.speed * _this.t;
    };
    this.collision = function () {
        if(_this.moveY<0||_this.moveY>cvs.height){
            _this.dead=true;
        }
    }
}
function Enemy2Bullet(game,moveX1,moveY1,id,index) {
    var _this = this;
    MoveObject.call(this,5,20,img2,4,4);
    this.game=game;
    this.moveX = moveX1 +  this.game.enemies[index].size/2;
    this.moveY = moveY1 +  this.game.enemies[index].size;
    this.planemoveX =  this.game.plane.moveX+this.game.plane.size/2;
    this.planemoveY = this.game.plane.moveY+this.game.plane.size/2;
    this.t = 1;
    this.id = id;
    this.dead =false;
    this.dx = this.planemoveX - this.moveX;
    this.dy = this.planemoveY - this.moveY;
    this.dz = Math.sqrt(this.dx*this.dx + this.dy*this.dy);
    this.angle = Math.atan2(this.dy,this.dx);
    this.draw = function () {
        ctx.drawImage(_this.img,0,0,_this.img.width / 4 *_this.c ,_this.img.height / 4 *_this.r,_this.moveX,_this.moveY,_this.size,_this.size);
    };
    this.updatePos = function () {
        _this.moveX += Math.cos(_this.angle) * _this.speed * _this.t;
        _this.moveY += Math.sin(_this.angle) * _this.speed * _this.t;
    };
    this.collision = function () {
        if(_this.moveY<0||_this.moveY>cvs.height){
            _this.dead=true;
        }
    }
}
function BossBullet(game,moveX1,moveY1,angle,sizeT,id,index,a) {
    var _this = this;
    MoveObject.call(this,5,20,boss2bulletimg,4,4);
    this.sizeT = sizeT;
    this.game=game;
    this.moveX = moveX1 + this.game.enemies[index].size/2;
    this.moveY = moveY1 + this.game.enemies[index].size/2;
    this.t = 1;
    this.id =id;
    this.dead =false;
    this.angle = angle;
    this.a=a;
    this.draw = function () {
        ctx.drawImage(_this.img,_this.img.width/4*_this.a,0,_this.img.width / 4  ,_this.img.height,_this.moveX,_this.moveY,_this.size,_this.size);
    };
    this.updatePos = function () {
        _this.moveX += Math.cos(angleToGradiant(_this.angle)) * _this.speed * _this.t;
        _this.moveY += Math.sin(angleToGradiant(_this.angle)) * _this.speed * _this.t;
        if(_this.a<4){
            _this.a++;
        }else {
            _this.a=0
        }
    };
    this.collision = function () {
        if(_this.moveY<0||_this.moveY>cvs.height){
            _this.dead=true;
        }
    }
}
//敌人1号
function Enemy1(id) {
    var _this = this;
    MoveObject.call(this,1,100,enemy1img,0,0);
    this.moveX1 = Math.random() * (cvs.width - 3*_this.size / 2) + _this.size / 2;
    this.moveY1 = _this.size / 2;
    this.angle = Math.random() * 135;
    this.t = 1;
    this.dead = false ;
    this.id = id;
    this.enemy1Hp = enemyhp;
    this.draw = function () {
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.fillRect(_this.moveX1,_this.moveY1 -10,_this.enemy1Hp/enemyhp*_this.size,10);
        ctx.strokeRect(_this.moveX1,_this.moveY1-10,_this.size,10);
        ctx.beginPath();
        ctx.drawImage(_this.img,_this.c,_this.r,_this.img.width ,_this.img.height,_this.moveX1,_this.moveY1,_this.size ,_this.size);

    };
    this.updatePos = function () {
        /* _this.moveX1 += _this.speed * _this.t * Math.cos(angleToGradiant(_this.angle));
         _this.moveY1 += _this.speed * _this.t * Math.sin(angleToGradiant(_this.angle));*/
        _this.moveY1 += _this.speed * _this.t;
    };
    this.collision = function () {
        /*if(_this.moveX1 < _this.size /2|| _this.moveX1 >= cvs.width -_this.size /2 ||
            _this.moveY1 <_this.size / 2 ) {
            _this.angle -= 40;
        }*/
        if(_this.moveY1 > cvs.height) {
            _this.dead = true;
        }
    };
}
function Enemy2(id) {
    var _this = this;
    MoveObject.call(this,1,100,enemy2,0,0);
    this.moveX1 = Math.random() * (cvs.width - 3*_this.size / 2) + _this.size / 2;
    this.moveY1 = _this.size / 2;
    this.id = id;
    this.angle = Math.random() * 20 + 60;
    this.t = 1;
    this.dead = false ;
    this.enemy2Hp = enemyhp;
    this.draw = function () {
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.fillRect(_this.moveX1,_this.moveY1 -10,_this.enemy2Hp/enemyhp*_this.size,10);
        ctx.strokeRect(_this.moveX1,_this.moveY1-10,_this.size,10);
        ctx.beginPath();
        ctx.drawImage(_this.img,_this.c,_this.r,_this.img.width ,_this.img.height,_this.moveX1,_this.moveY1,_this.size ,_this.size);

    };
    this.updatePos = function () {
        _this.moveX1 += _this.speed * _this.t * Math.cos(angleToGradiant(_this.angle));
        _this.moveY1 += _this.speed * _this.t * Math.sin(angleToGradiant(_this.angle));
    };
    this.collision = function () {
        if(_this.moveX1 < _this.size /2|| _this.moveX1 >= cvs.width -_this.size /2 ||
            _this.moveY1 <_this.size / 2 ) {
            _this.angle -= 60;
        }
        if(_this.moveY1 > cvs.height) {
            _this.dead = true;
        }
    };
}
function Boss1(id) {
    var _this = this;
    MoveObject.call(this,1,200,boss1,0,0);
    this.moveX1 = Math.random() * (cvs.width - 3*_this.size / 2) + _this.size / 2;
    this.moveY1 = _this.size / 2;
    this.angle = Math.random() * 20 + 60;
    this.t = 1;
    this.dead = false ;
    this.boss1Hp = boss1hp;
    this.id=id;
    this.draw = function () {
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.fillRect(_this.moveX1,_this.moveY1 -10,_this.boss1Hp/boss1hp*_this.size,10);
        ctx.strokeRect(_this.moveX1,_this.moveY1-10,_this.size,10);
        ctx.beginPath();
        ctx.drawImage(_this.img,_this.c,_this.r,_this.img.width ,_this.img.height,_this.moveX1,_this.moveY1,_this.size ,_this.size);

    };
    this.updatePos = function () {
        _this.moveX1 += _this.speed * _this.t * Math.cos(angleToGradiant(_this.angle));
        _this.moveY1 += _this.speed * _this.t * Math.sin(angleToGradiant(_this.angle));
    };
    this.collision = function () {
        if((_this.moveX1 + _this.size/2)< _this.size /2|| (_this.moveX1+ _this.size/2) >= cvs.width -_this.size /2 ||
            (_this.moveY1+ _this.size/2) <_this.size / 2 || (_this.moveY1+ _this.size/2) >= cvs.height - _this.size /2) {
            _this.angle -= 60;
        }
        if((_this.moveY1+ _this.size/2) > cvs.height) {
            _this.dead = true;
        }
    };
    /*    this.fall =function () {
            ctx.beginPath();
            ctx.drawImage(_this.img,_this.c,_this.r,_this.img.width ,_this.img.height,_this.moveX1,_this.moveY1,_this.size ,_this.size);
    /!*        ctx.beginPath();
            ctx.drawImage(img11,img11.width*0,0,img11.width/4 ,img11.height,_this.moveX1,_this.moveY1,img11.height,img11.height);*!/
        }*/
}
function Boss2(id) {
    var _this = this;
    MoveObject.call(this,1,400,boss22,0,0);
    this.moveX1 = Math.random() * (cvs.width - 3*_this.size / 2) + _this.size / 2;
    this.moveY1 = -_this.size/4;
    this.angle = Math.random() * 60+20;
    this.t = 1;
    this.dead = false ;
    this.boss2Hp = boss2hp;
    this.id=id;
    this.draw = function () {
        ctx.beginPath();
        ctx.fillStyle = 'red';
        ctx.fillRect(_this.moveX1,_this.moveY1 -10,_this.boss2Hp/boss2hp*_this.size,10);
        ctx.strokeRect(_this.moveX1,_this.moveY1-10,_this.size,10);
        ctx.beginPath();
        ctx.drawImage(_this.img,_this.img.width/3*_this.c,0,_this.img.width/3 ,_this.img.height,_this.moveX1,_this.moveY1,_this.size ,_this.size);

    };
    this.updatePos = function () {
        if(_this.c < 3) {
            _this.c++;
        }else {
            _this.c=0;
        }
        _this.moveX1 += _this.speed * _this.t * Math.cos(angleToGradiant(_this.angle));
        _this.moveY1 += _this.speed * _this.t * Math.sin(angleToGradiant(_this.angle));
    };
    this.collision = function () {
        if(_this.moveX1+_this.size/2 <=0|| _this.moveX1+_this.size/2 >= cvs.width +this.size/4||
            _this.moveY1 +_this.size/2<=0|| _this.moveY1+_this.size/2 >= cvs.height+this.size/4 ) {
            _this.angle -= 180;
        }

    };
}
//障碍物
function Obstacle() {
    var _this = this;
    MoveObject.call(this,1,100,Obstacle1img,0,0);
    this.moveX1 = Math.random() * (cvs.width - 3*_this.size / 2) + _this.size / 2;
    this.moveY1 = _this.size / 2 /2;
    this.t=2;
    this.dead = false;
    this.draw = function () {
        ctx.beginPath();
        ctx.drawImage(_this.img,_this.img.width/4*_this.c,_this.img.height/4*_this.r,_this.img.width ,_this.img.height,_this.moveX1,_this.moveY1,_this.size ,_this.size);
    };
    this.updatePos = function () {
        _this.moveY1 += _this.speed * _this.t ;
    };
    this.collision = function () {
        if(_this.moveY1 > cvs.height) {
            _this.dead = true;
        }
    };
}

function TreatmentProp(id) {
    var _this = this;
    MoveObject.call(this,1,50,treatment,0,0);
    this.moveX1 = Math.random() * (cvs.width - 3*_this.size / 2) + _this.size / 2;
    this.moveY1 = _this.size / 2 /2;
    this.t=2;
    this.id=id;
    this.dead = false;
    this.draw = function () {
        ctx.beginPath();
        ctx.drawImage(_this.img,_this.img.width/4*_this.c,_this.img.height/4*_this.r,_this.img.width ,_this.img.height,_this.moveX1,_this.moveY1,_this.size ,_this.size);
    };
    this.updatePos = function () {
        _this.moveY1 += _this.speed * _this.t ;
    };
    this.collision = function () {
        if(_this.moveY1 > cvs.height) {
            _this.dead = true;
        }
    };
}

function GreenBulletProp(id) {
    var _this = this;
    MoveObject.call(this,1,50,greenbulletprop,0,0);
    this.moveX1 = Math.random() * (cvs.width - 3*_this.size / 2) + _this.size / 2;
    this.moveY1 = _this.size / 2 /2;
    this.id=id;
    this.t=2;
    this.dead = false;
    this.draw = function () {
        ctx.beginPath();
        ctx.drawImage(_this.img,_this.img.width/4*_this.c,_this.img.height/4*_this.r,_this.img.width ,_this.img.height,_this.moveX1,_this.moveY1,_this.size ,_this.size);
    };
    this.updatePos = function () {
        _this.moveY1 += _this.speed * _this.t ;
    };
    this.collision = function () {
        if(_this.moveY1 > cvs.height) {
            _this.dead = true;
        }
    };
}

function RedBulletProp(id) {
    var _this = this;
    MoveObject.call(this,1,50,redbulletprop,0,0);
    this.moveX1 = Math.random() * (cvs.width - 3*_this.size / 2) + _this.size / 2;
    this.moveY1 = _this.size / 2 /2;
    this.id=id;
    this.t=2;
    this.dead = false;
    this.draw = function () {
        ctx.beginPath();
        ctx.drawImage(_this.img,_this.img.width/4*_this.c,_this.img.height/4*_this.r,_this.img.width ,_this.img.height,_this.moveX1,_this.moveY1,_this.size ,_this.size);
    };
    this.updatePos = function () {
        _this.moveY1 += _this.speed * _this.t ;
    };
    this.collision = function () {
        if(_this.moveY1 > cvs.height) {
            _this.dead = true;
        }
    };
}

function Fall(f,fallx,fally,fallc) {
    var _this=this;
    this.f=f;
    this.fallX=fallx+this.f.size/2;
    this.fallY=fally+this.f.size/2;
    this.fallc=fallc;
    this.size=img11.height*0.5;
    this.img = img11;
    this.c=0;
    this.draw = function () {
        ctx.beginPath();
        ctx.drawImage(img11,img11.width/4*_this.fallc,0,img11.width/4 ,img11.height,_this.fallX,_this.fallY,img11.height*0.5,img11.height*0.5);
    };
}

function Fallstate(t,fallstatenum) {
    var _this=this;
    this.t=t;
    this.fallX=this.t.fallX;
    this.fallY=this.t.fallY;
    this.fallstateX=cvs.width*0.3;
    this.fallstateY=cvs.height*0.04;
    this.angle=0;
    this.speed=2;
    this.fallstatenum=fallstatenum;
    this.drawstate = function () {
        ctx.beginPath();
        ctx.drawImage(t.img,t.img.width/4*t.fallc,0,t.img.width/4 ,t.img.height,_this.fallX,_this.fallY,t.img.height*0.5,t.img.height*0.5);
    };
    this.updatePos = function () {
        _this.fallX=_this.fallstateX + _this.fallstatenum*60;
        _this.fallY=_this.fallstateY;

    };
}

// 按键处理
function KeyProcess(game) {
    var _this = this;
    this.game = game;
    this.spacebar = false;
    this.arrowleft = false;
    this.arrowright = false;
    this.arrowup = false;
    this.arrowdown = false;
    this.skill=false;
    this.onkeydown = function (ev) {
        var e = ev || window.event;
        if (e.code == "ArrowRight") {
            _this.arrowright = true;
        }
        else if (e.code == "ArrowLeft") {
            _this.arrowleft = true;
        }
        else if (e.code == "ArrowUp") {
            _this.arrowup = true;
        }
        else if (e.code == "ArrowDown") {
            _this.arrowdown = true;
        }
        else if (e.code == "Space") {
            _this.spacebar = true;
        }
        else if(e.code=="KeyG") {
            _this.skill = true;
        }
        _this.process();
        // console.log(e);
    };
    this.onkeyup = function (ev) {
        var e = ev || window.event;
        if (e.code == "ArrowRight") {
            _this.arrowright = false;
        }
        else if (e.code == "ArrowLeft") {
            _this.arrowleft = false;
        }
        else if (e.code == "ArrowUp") {
            _this.arrowup = false;
        }
        else if (e.code == "ArrowDown") {
            _this.arrowdown = false;
        }
        else if (e.code == "Space") {
            _this.spacebar = false;
            /*  game.bullets.push(new PlaneBullet(game.plane.moveX,game.plane.moveY,0))*/
        }
        else if(e.code=="KeyG") {
            _this.skill = false;
        }
        _this.process();
    };

    this.process = function () {
        if (_this.spacebar) {
            _this.game.plane.firestate = true;
        }
        else {
            _this.game.plane.firestate = false;
        }
        if(game.plane.skillbar==skillbar){
            if (_this.skill) {
                _this.game.plane.skillstate = 'open';
            }
            else {
                /* _this.game.plane.skillstate = 'close';
                 console.log('close');*/
            }
        }
        var leftright = "stop";
        if (_this.arrowleft != _this.arrowright) {
            if (_this.arrowleft) {
                leftright = "left";
            }
            else {
                leftright = "right";
            }
        }
        var updown = "stop";
        if (_this.arrowup != _this.arrowdown) {
            if (_this.arrowup) {
                updown = "up";
            }
            else {
                updown = "down";
            }
        }
        if (leftright == "stop" && updown == "stop") {
            _this.game.plane.setmovestate("idle");
        }
        else if (leftright == "stop" && updown == "up") {
            _this.game.plane.setmovestate("move", -Math.PI / 2);
        }
        else if (leftright == "stop" && updown == "down") {
            _this.game.plane.setmovestate("move", Math.PI / 2);
        }
        else if (leftright == "left" && updown == "stop") {
            _this.game.plane.setmovestate("move", Math.PI);
        }
        else if (leftright == "left" && updown == "up") {
            _this.game.plane.setmovestate("move", -Math.PI * 3 / 4);
        }
        else if (leftright == "left" && updown == "down") {
            _this.game.plane.setmovestate("move", Math.PI * 3 / 4);
        }
        else if (leftright == "right" && updown == "stop") {
            _this.game.plane.setmovestate("move", 0);
        }
        else if (leftright == "right" && updown == "up") {
            _this.game.plane.setmovestate("move", -Math.PI * 1 / 4);
        }
        else if (leftright == "right" && updown == "down") {
            _this.game.plane.setmovestate("move", Math.PI * 1 / 4);
        }
    };

    document.onkeydown = _this.onkeydown;
    document.onkeyup = _this.onkeyup;
}

