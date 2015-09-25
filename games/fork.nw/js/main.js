enchant();

var val = {};

val.ratio = 320/320.;

window.onresize = function(){
	if(window.innerWidth*val.ratio>=window.innerHeight){
		val.core.scale = window.innerHeight/val.core.height;
	}else if(window.innerHeight>=window.innerWidth*val.ratio){
		val.core.scale = window.innerWidth/val.core.width;
	}
};

window.onload = function(){
    val.core = new Core(320,320);
    val.core.fps = 60;
    val.core.keybind(13,"enter"); //return key
    val.core.keybind(32,"space"); //space key
    val.core.preload("img/chara1.png","img/floor.png","img/count.png");
    
    var floor = [];
    var floor_position = [[320,-1],[-30,-1],[-1,-20],[-1,330]];
    var player;
    var stage = 1;
    var key_buf = {};
    var score=0;
    var key_num;
    var jumpMaxY=20,jumpTime=0.6,jumpHT=jumpTime/2.;
    var G = jumpMaxY/(jumpTime/(1/60.));
    
    val.core.onload = function(){
        var KeyInit = function(){
            for(var key in (val.core.input)){
                key_buf[key] = 0;
            }
        }

        var KeyUpdate = function(){
            for(var key in val.core.input){
                if(val.core.input[key]===true){
                    key_buf[key] += 1;//(key_buf[key]>=2?0:1);  
                }else{
                    key_buf[key] = 0;   
                }
            }
        }

        var AnyKeyPressCheck = function(array_key){
            var count=0;
            for(var i=0;i<=array_key.length-1;i++){
                if(key_buf[array_key[i]]===1){
                    count++;
                    break;
                }
            }

            return count;
        }
        
        var Player = Class.create(Sprite,{
            initialize: function(){
                Sprite.call(this,32,32);
                this.x = 144;
                this.y = 320-32;
                this.image = val.core.assets["img/chara1.png"];
                this.time = 0;
                this.jumpFlag = 0;
                this.on("enterframe",function(){
                    KeyUpdate();
                    JumpAndGrav(this);
                    if(val.core.input.right && this.x<320-32){
                        this.frame = key_buf["right"]/5%3;
                        this.scaleX = 1;
                        this.x += 2;
                    }else if(val.core.input.left && this.x>0){
                        this.frame = key_buf["left"]/5%3;
                        this.scaleX = -1;
                        this.x -= 2;
                    }else{
                        this.frame = 0;
                    }

                    if(this.jumpFlag===0 && key_buf["space"]>=1){
                        this.jumpFlag = 1;
                    }
                });
            }
        });
        
        var JumpAndGrav = function(player){
            if(player.jumpFlag===0 && (player.y+32+G)<320){
                player.y += G;
            }else if(player.jumpFlag===1){
                var a = -jumpMaxY/((jumpHT)*(jumpHT));
                var y = a*Math.pow(player.time-jumpHT,2) + jumpMaxY;
                var v = (2*a*player.time - 2*a*jumpHT)/60.;
                
                if(player.time>=jumpHT || (player.y-v)<0){//y<-(1/60.)
                    player.jumpFlag = 0;
                    player.time = 0;
                }else{
                    player.y = player.y - v;
                    player.time += (1/60.);
                }
                
            }
        };
        
        var Floor = Class.create(Sprite,{
            initialize: function(){
                Sprite.call(this,30,10);
                this.image = val.core.assets["img/floor.png"];
                this.timeLimit = Math.floor(Math.random()*40)*30;
                this.opacity = 1;
                this.dir = Math.floor(Math.random()*stage);
                this.rotate(90*Math.floor(this.dir/2));

                if(floor_position[this.dir][0]===-1){
                    this.x = Math.floor(Math.random()*16)*20;
                    this.y = floor_position[this.dir][1];
                }else if(floor_position[this.dir][1]===-1){
                    this.x = floor_position[this.dir][0];
                    this.y = Math.floor(Math.random()*16)*20;
                }

                this.on("enterframe",function(){
                    if(this.within(player,20)){
                        val.core.replaceScene(GameOverScene());
                    }
                    if(this.timeLimit<=0 && this.opacity===1){
                        switch(this.dir){
                            case 0:
                                this.x -= 1;
                                if(this.x+this.width<=0){
                                    score += stage*100;
                                    this.opacity=0;
                                }
                                break;
                            case 1:
                                this.x += 1;
                                if(this.x>=320){
                                    score += stage*100;
                                    this.opacity=0;
                                }
                                break;
                            case 2:
                                this.y += 1;
                                if(this.y>=320){
                                    score += stage*100;
                                    this.opacity=0;
                                }
                                break;
                            case 3:
                                this.y -= 1;
                                if(this.y+this.width<=0){
                                    score += stage*100;
                                    this.opacity=0;
                                }
                                break;
                        }
                    }else{
                        this.timeLimit -= 1;
                    }
                });
            }
        });
        
        var floorSceneInit = function(){
            var scene = new Scene();
            for(var i=0;i<20*stage;i++){
                floor[i] = new Floor();
                scene.addChild(floor[i]);
            }
            
            return scene;
        };

        var StartScene = function(){
            var scene = new Scene();
			scene.backgroundColor = "#80F0F0";
			var title_label = new Label("フオーク");
			title_label.font = "25px メイリオ";
			title_label.x = 110;
			title_label.y = 100;
			scene.addChild(title_label);

            var label = new Label("Enterキーを押して下さい");
			label.font = "16px メイリオ";
			label.x = 70;
			label.y = 250;
            scene.addChild(label);
            
            stage=1; score=0;

            scene.on("enterframe",function(){
                KeyUpdate();
                if(key_buf["enter"]===1){
                    val.core.replaceScene(GameScene());
                    val.core.pushScene(CountDownScene());
                }
            });

            return scene;
        };
        
        var CountDownScene = function(){
            var scene = new Scene();
            var sprite = new Sprite(80,80);
            sprite.image = val.core.assets["img/count.png"];
            sprite.x = 120;
            sprite.y = 120;
            sprite.frame = 2;
            sprite.tl.cue({
                60: function(){
                    sprite.frame = 1;
                },
                120: function(){
                    sprite.frame = 0;
                },
                180: function(){
                    val.core.popScene();
                }
            });
            scene.addChild(sprite);
            
            return scene;
        }

        var GameScene = function(){
            var scene = new Scene();
			scene.backgroundColor = "#80F0F0";
            var label = new Label(score+"点");
            player = new Player();
            scene.addChild(label);
            scene.addChild(player);
            scene.addChild(floorSceneInit());
            
            scene.on("enterframe",function(){

			label.text = score+"点";


                for(var i=0;i<=(20*stage)-1;i++){
                    if(floor[i].opacity===1){
                        break;
                    }
                    
                    if(i==(20*stage)-1){
                        if(++stage<=4){
                            scene.addChild(floorSceneInit());
                            break;
                        }else{
                            val.core.replaceScene(GameClearScene());
                            break;
                        }
                    }
                }
            });

            return scene;
        };
        
        var GameClearScene = function(){
            var scene = new Scene();
			scene.backgroundColor = "#80F0F0";
            var label = new Label("ゲームクリア");
			label.font = "25px メイリオ";
			label.x = 70;
			label.y = 100;
            scene.addChild(label);

			var label1 = new Label(score+"点");
			label1.font = "25px メイリオ";
            label1.x = 100;
            label1.y = 170;
            scene.addChild(label1);

            var back_label = new Label("Enterキーでスタート画面に戻ります");
			back_label.font = "16px メイリオ";
			back_label.x = 30;
			back_label.y = 280;
            scene.addChild(back_label);
            
            scene.on("enterframe",function(){
                KeyUpdate();
                if(key_buf["enter"]===1){
                    val.core.replaceScene(StartScene());
                }
            });
            
            return scene;
        }

        var GameOverScene = function(){
            var scene = new Scene();
			scene.backgroundColor = "#80F0F0";
            var label = new Label("ゲームオーバー");
			label.font = "25px メイリオ";
			label.x = 70;
			label.y = 100;
            scene.addChild(label);

            var label1 = new Label(score+"点");
			label1.font = "25px メイリオ";
            label1.x = 130;
            label1.y = 170;
            scene.addChild(label1);

            var back_label = new Label("Enterキーでスタート画面に戻ります");
			back_label.font = "16px メイリオ";
			back_label.x = 30;
			back_label.y = 280;
            scene.addChild(back_label);
            
            scene.on("enterframe",function(){
                KeyUpdate();
                if(key_buf["enter"]===1){
                    val.core.replaceScene(StartScene());
                }
            });
            
            return scene;
        }
        
        KeyInit();

        val.core.replaceScene(StartScene());
    };
	val.core.start();
    //val.core.debug();
};