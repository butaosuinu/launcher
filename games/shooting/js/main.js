enchant();

window.onload = function () {
    
    game = new Game(320, 320);

    var end = function () {
        game.end();
        setTimeout(function () {
            location.reload(true);
        }, 3000);
    };
    var stop = function () {
        game.stop();
        setTimeout(function () {
            location.reload(true);
        }, 3000);
    };
    game.fps = 24;
    game.score = 0;
    game.touched = false;
    game.time = 100;
    game.life = 3;
    game.preload('images/graphic.png',"effect0.gif","images/netr0b.png",'clear.png');
    game.onload = function () {
        enemies = new Array();
        fasteres = new Array();
        dangans = new Array();
        background = new Background();
        player = new Player(0,152);

        //自分の機体のライフ
        lifeLabel = new Label();
        lifeLabel.x = 200;
        lifeLabel.y = 5;
        lifeLabel.color = "white";
        game.rootScene.addChild(lifeLabel);
        lifeLabel.addEventListener('enterframe',function(){
            this.text = "MY LIFE: " + game.life;
        })

        game.rootScene.addEventListener('enterframe', function () { 

			//アイテムの出現条件
            if(game.frame % 95 == 0 && game.life == 1 && game.time < 60){
                item = new Item(320,Math.random() * 320);
            }

            if(rand(100) < 10){
                var enemy = new Enemy(320, rand(320));
                enemy.key = game.frame;
                enemies[game.frame] = enemy; 
                    if(game.time < 70){
                        enemy.remove();
                        var omega = rand(320) < 160 ? 1: -1;
                        var faster = new FastEnemy(320,rand(320),omega);
                        faster.key = game.frame;
                        fasteres[game.frame] = faster;
                        if(game.time < 40){
                            faster.remove();
                            var dangan = new Dangan(320,rand(320));
                            dangan.key = game.frame;
                            dangans[game.frame] = dangan;
                        }if(game.time < 10) {
							dangan.remove();
							s.stop();
						}
                    }
            }else if(game.life == 0){
                end();
            }

            scoreLabel.score = game.score;
        });

        scoreLabel = new ScoreLabel(8, 8);
        game.rootScene.addChild(scoreLabel);

        //制限時間
        var timeLabel = new Label();
        timeLabel.x = 200;
        timeLabel.y = 20;
        timeLabel.color = "white";
        timeLabel.text = "TIME :" + game.time + "s";
        game.rootScene.addChild(timeLabel);
        timeLabel.on('enterframe',function(){
            if(game.frame % game.fps == 0){
                game.time--;
                this.text = "TIME：　" + game.time + "s";
                if(game.time == 0 && game.score > 1000){
                    stop();
					s.stop();
                    clear = new Clear();
                    c.play();
                }else if(game.time == 0 && game.score < 1000){
					s.stop();
                    end();
                    o.play();
                }
            }
        })
    };
    
    game.start();
};

//自分の機体のクラス
var Player = Class.create(Sprite, {
    initialize: function (x, y) {
        Sprite.call(this, 16, 16);
        this.image = game.assets['images/graphic.png'];
        this.x = x;
        this.y = y;
        this.frame = 0;
        game.rootScene.addChild(this);
    },
    ontouchstart: function(e){
        player.x = e.x;
        player.y = e.y;
        game.touched = true;
    },
    ontouchend: function(e){
        player.x = e.x;
        player.y = e.y;
        game.touched = false;
    },
    ontouchmove: function(e){
        player.x = e.x;
        player.y = e.y;
    },
    onenterframe: function(){
        if(game.touched && game.frame % 3 == 0){
            var shoot = new PlayerShoot(this.x,this.y);
        }
    }
});

//敵のクラス
var Enemy = Class.create(Sprite, {
    initialize: function (x, y) {
        Sprite.call(this, 16, 16);
        this.image = game.assets['images/graphic.png'];
        this.x = x;
        this.y = y;
        this.frame = 3;
        this.direction = 0;
        this.moveSpeed = 3;
        game.rootScene.addChild(this);
    },
    move: function () {
        this.x -= 3;
        this.y += this.moveSpeed * Math.sin(this.age * 0.1);
    },
    remove: function () {
        game.rootScene.removeChild(this);
        delete enemies[this.key];
    },
    onenterframe: function(){
        this.move();
        if(this.x > 320 || this.y > 320 || this.x < -game.width || this.y < -game.height){
            this.remove();
        }else if(this.age % 10 == 0 && game.time < 90){
            var shot = new EnemyShoot(this.x,this.y);
        }
    }
});

//スプライトから継承
var Shoot = Class.create(Sprite, {
    initialize: function (x, y, direction) {
        Sprite.call(this, 16, 16);
        this.image = game.assets['images/graphic.png'];
        this.x = x;
        this.y = y;
        this.frame = 2;
        this.direction = direction;
        this.moveSpeed = 10;
        game.rootScene.addChild(this);
        this.addEventListener('enterframe',function(){
            this.x += this.moveSpeed * Math.cos(this.direction);
            this.y += this.moveSpeed * Math.sin(this.direction);
            if(this.x > 320 || this.y > 320 || this.x < -game.width || this.y <-game.height){
                this.remove();
            }
        })
    },
    onenterframe: function(){

    },
    remove: function () {
        game.rootScene.removeChild(this);
        delete this;
    }
});

//スプライトから継承
var PlayerShoot = Class.create(Sprite, {
    initialize: function (x, y) {
        Sprite.call(this,16,16);
        this.x = x;
        this.y = y;
        this.image = game.assets["images/graphic.png"];
        this.frame = 1;
        game.rootScene.addChild(this);
    },
    onenterframe: function(){
        if(this.x > 320 || this.y > 320 || this.x < -game.width || this.y < -game.height){
            this.remove();
        };
        this.x +=10;
        for(var i in enemies){
            if(enemies[i].intersect(this)){
                this.remove();
                enemies[i].remove();
                game.score +=10;
                effect = new Effect(this.x,this.y);
            }
        }
        for(var i in fasteres){
            if(fasteres[i].intersect(this)){
                this.remove();
                fasteres[i].remove();
                game.score+=20;
                effect = new Effect(this.x,this.y);
            }
        }
        for(var i in dangans){
            if(dangans[i].within(this,8)){
                this.remove();
                dangans[i].remove();
                game.score+=30;
                effect = new Effect(this.x,this.y);
            }
        }
    }
});

//Shootクラスから継承
var EnemyShoot = Class.create(Shoot, {
    initialize: function (x, y) {
        Shoot.call(this, x, y, Math.PI);
    },
    onenterframe: function(){
        if(player.within(this,8)){
            game.life--;
            effect = new Effect(player.x,player.y);
        }
    },
})

//爆発エフェクトのクラス
var Effect = Class.create(Sprite,{
    initialize: function(x,y){
        Sprite.call(this,16,16);
        this.image = game.assets["effect0.gif"];
        this.x = x;
        this.y = y;
        this.frame = 0;
        this.time = 0;
        this.duration = 20;
        game.rootScene.addChild(this);
    },
    onenterframe: function(){
        this.time++;
        this.frame = Math.floor(this.time/this.duration * 5);
        if(this.time == this.duration){
            this.remove();
        }
    },
    remove: function(){
        game.rootScene.removeChild(this);
    }
})

//背景のクラス
var Background = Class.create(Sprite,{
    initialize: function(){
        Sprite.call(this,640,320);
        this.x = 0;
        this.y = 0;
        this.image = game.assets["images/netr0b.png"];
        game.rootScene.addChild(this);
    },
    onenterframe: function(){
        this.x--;
        if(this.x <= -320){
            this.x = 0;
        }
    }
})

//ピンクドロイドのクラス
var FastEnemy = Class.create(Sprite,{
    initialize: function(x,y,omega){
        Sprite.call(this,16,16);
        this.image = game.assets["images/graphic.png"];
        this.x = x;
        this.y = y;
        this.frame = 4;
        this.time = 0;
        this.rotation = 0;
        this.direction = 0;
        game.rootScene.addChild(this);
        //ラジアン角に変換
        this.omega = omega * Math.PI / 180; 
    },
    move: function(){
        this.direction += this.omega;
        this.x -= 3 * Math.cos(this.direction);
        this.y += 3 * Math.sin(this.direction);
    },
    remove: function(){
        game.rootScene.removeChild(this);
        delete this;
        delete fasteres[this.key];
    },
    onenterframe: function(){
        this.move();
        this.rotation += 10;
        if(this.x > 320 || this.y > 320 || this.x < -game.width || this.y < -game.height){
            this.remove();
        }else if(this.age % 15 === 0){
            var s = new EnemyShoot(this.x,this.y);
        }
    }
})

//特攻するオレンジドロイドのクラス
var Dangan = Class.create(Sprite,{
    initialize: function(x,y){
        Sprite.call(this,16,16);
        this.x = x;
        this.y = y;
        this.image = game.assets["images/graphic.png"];
        this.frame = 6;
        this.rotaiton = 0;
        game.rootScene.addChild(this);
    },
    onenterframe: function(){
        this.x -= 15;
        this.rotation += 15;
        if(player.intersect(this)){
            this.remove();
            game.life--;
            var effect = new Effect(this.x,this.y);
        }
    },
    remove: function(){
        game.rootScene.removeChild(this);
        delete this;
        delete dangans[this.key];
    }
})

//クリア画像のクラス
var Clear = Class.create(Sprite,{
    initialize: function(){
        Sprite.call(this,267,48);
        this.x = 26;
        this.y = 142;
        this.image = game.assets["clear.png"];
        game.rootScene.addChild(this);
    },
})

//アイテムのクラス
var Item = Class.create(Sprite,{
    initialize: function(x,y){
        Sprite.call(this,16,16);
        this.image = game.assets["images/graphic.png"];
        this.frame = 11;
        this.x = x;
        this.y = y;
        game.rootScene.addChild(this);
    },
    move: function(){
        this.x -= 5;
    },
    remove: function(){
        game.rootScene.removeChild(this);
    },
    onenterframe: function(){
        this.move();
        if(player.within(this,8)){
            game.life++;
            this.remove();
        }else if(this.x > 320 || this.y > 320 || this.x < -game.width || this.y < -game.height){
            this.remove();
        }
    }
})

