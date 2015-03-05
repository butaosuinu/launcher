enchant();

var StartFrame = 0;
var Point_num = 0;
var random_flag = [10];
var mode = [2,3,5];
var mode_flag=0;
var ratio;
var core = new Core(450,320);

window.onresize = function(){
	if(window.innerWidth*ratio>=window.innerHeight){
		core.scale = window.innerHeight/core.height;
	}else if(window.innerHeight>=window.innerWidth*ratio){
		core.scale = window.innerWidth/core.width;
	}
};

window.onload = function(){
	ratio = 320/450.;
	core.preload('img/car2.png');
	core.preload('img/enemy2.png');
	core.preload('img/cursor1.png');
	core.fps = 60;
	core.keybind(32,"a");//space key
	core.keybind(13,"b");//return key

	core.onload = function(){ //GameStartScreen
		core.pushScene(core.GameStart());
	};

	core.GameStart = function(){
		init();
		var StartScene = new Scene();
		StartScene.backgroundColor = '#00f0f0';
		
		var TitleLabel = new Label("Avoid Game");
		TitleLabel.font = "30px MSゴシック";
		TitleLabel.x = 155;
		TitleLabel.y = 80;
		StartScene.addChild(TitleLabel);

		var SpaceLabel = new Label("Spaceを押してください");
		SpaceLabel.font = "16px MSゴシック";
		SpaceLabel.x = 155;
		SpaceLabel.y = 200;
		StartScene.addChild(SpaceLabel);

		StartScene.on('enterframe',function(){
			if(core.input.a){
				core.replaceScene(core.Mode());
			}
		});

		return StartScene;
	};

	core.Mode = function(){
		init();
		var ModeScene = new Scene();
		ModeScene.backgroundColor = '#00f0f0';

		var cursor = new Sprite(9,17);
		cursor.image = core.assets['img/cursor1.png'];
		cursor.x = 180;
		cursor.y = 170;

		var cursor_flag = 0;

		cursor.on('enterframe',function(){
			if(core.input.up && cursor_flag==0){
				if(mode_flag!=0){
					cursor.y -= 30;
					mode_flag--;
				}
				cursor_flag=1;
			}else if(core.input.down && cursor_flag==0){
				if(mode_flag!=2){
					cursor.y += 30;
					mode_flag++;
				}
				cursor_flag=1;
			}else if(core.input.b){
				StartFrame = core.frame;
				core.replaceScene(core.Game());
			}else if(!core.input.up && !core.input.down){
				cursor_flag=0;
			}
		});

		ModeScene.addChild(cursor);

		var TitleLabel = new Label("Avoid Game");
		TitleLabel.font = "30px MSゴシック";
		TitleLabel.x = 155;
		TitleLabel.y = 80;
		ModeScene.addChild(TitleLabel);

		var Easy_Label = new Label("かんたん");
		Easy_Label.font = "16px MSゴシック";
		Easy_Label.x = 210;
		Easy_Label.y = 170;
		ModeScene.addChild(Easy_Label);
		
		var Normal_Label = new Label("ふつう");
		Normal_Label.font = "16px MSゴシック";
		Normal_Label.x = 210;
		Normal_Label.y = 200;
		ModeScene.addChild(Normal_Label);
		
		var Hard_Label = new Label("むずかしい");
		Hard_Label.font = "16px MSゴシック";
		Hard_Label.x = 210;
		Hard_Label.y = 230;
		ModeScene.addChild(Hard_Label);
		
		return ModeScene;
	}

	core.Game = function(){ //GameScene
		core.keybind(27,"a");//esc key
		var GameScene = new Scene();
		GameScene.backgroundColor = '#f0f0f0';
		var car = new Sprite(30,60);
		car.image = core.assets['img/car2.png'];
		car.x = 135;
		car.y = 270;

		car.on('enterframe',function(){

			//チート

			/*for(var i=0;i<=9;i++){
				if(random_flag[i]!=1){
					this.x = i*30;
					break;
				}
			}*/

			if(core.input.left && this.x>0){
				this.x -= 5;
			}else if(core.input.right && this.x<270){
				this.x += 5;
			}
			for(var i=0;i<=4;i++){
				if(this.within(enemys[i],25)){
					core.replaceScene(core.GameOver());
				}
			}
		});
		GameScene.addChild(car);

		var Enemy = Class.create(Sprite,{
			initialize: function(x,y){
				var accel=0,rand;
				Sprite.call(this,30,60);
				this.x = x;
				this.y = y;
				this.image = core.assets['img/enemy2.png'];
				this.on('enterframe',function(){
					if(this.y<=320){
						this.y += mode[mode_flag]+accel;
					}else{
						do{
							rand = Math.floor(Math.random()*10);
						}while(random_flag[rand]==1);
						random_flag[rand]=1;random_flag[this.x/30]=0;
						this.x = rand*30;
						this.y = -60-(accel*50);
						Point_num += (mode_flag+1)*100;
						Point.text = Point_num+"点";
						accel = Math.floor(Math.random()*Math.floor(Point_num/((3-mode_flag)*10000)+1));
					}
				});
				GameScene.addChild(this);
			}
		});

		var enemys = [];
		for(var i=0;i<=4;i++){
			var rand,accel;
			do{
				rand = Math.floor(Math.random()*10);
			}while(random_flag[rand]==1);
			random_flag[rand]=1;
			accel = Math.floor(Math.random()*20);
			enemys[i] = new Enemy(rand*30,core.frame-StartFrame<=1?(-180*(mode[mode_flag]+2))-(accel*10):0);
		}

		var sprite = new Sprite(450,320);
		var surface = new Surface(450,320);
		surface.context.fillStyle = "rgb(0,190,180)";
		surface.context.fillRect(300,0,150,320);
		sprite.image = surface;
		GameScene.addChild(sprite);
		
		var Point = new Label("0点");
		Point.font = "14px MSゴシック";
		Point.color = '#ffffff';
		Point.x = 360;
		Point.y = 60;
		GameScene.addChild(Point);

		var Count_Label = new Label();
		Count_Label.x = 340;
		Count_Label.y = 30;
		GameScene.on('enterframe',function(){
			if(core.frame-StartFrame<=180){
				Count_Label.text = "開始"+(3-Math.floor((core.frame-StartFrame)/60))+"秒前";
			}else{
				Count_Label.text = "GO!";
				Count_Label.x = 360;
			}
			if(core.input.a){
				core.keybind(32,"a");
				core.replaceScene(core.Mode());
			}
		});
		GameScene.addChild(Count_Label);

		return GameScene;
	};

	core.GameOver = function(){ //GameOver
		var GameOverScene = new Scene();
		GameOverScene.backgroundColor = 'black';

		var GameLabel = new Label("G A M E");
		GameLabel.font = '40px MSゴシック';
		GameLabel.color = '#ffffff';
		GameLabel.x = 160;
		GameLabel.y = 60;
		GameOverScene.addChild(GameLabel);

		var OverLabel = new Label("O V E R");
		OverLabel.font = '40px MSゴシック';
		OverLabel.color = '#ffffff';
		OverLabel.x = 162;
		OverLabel.y = 110;
		GameOverScene.addChild(OverLabel);

		var Point = new Label();
		Point.text = Point_num+"点";
		Point.font = "16px MSゴシック";
		Point.color = '#ffffff';
		Point.x = 210;
		Point.y = 190;
		GameOverScene.addChild(Point);

		var ReturnLabel = new Label("ENTERでスタート画面に戻ります");
		ReturnLabel.font = '16px MSゴシック';
		ReturnLabel.color = '#ffffff';
		ReturnLabel.x = 130;
		ReturnLabel.y = 250;
		GameOverScene.addChild(ReturnLabel);

		GameOverScene.on('enterframe',function(){
			if(core.input.b){
				core.replaceScene(core.GameStart());
			}
		});
		return GameOverScene;
	};

	core.start();

};

function init(){
	StartFrame = 0;
	Point_num = 0;
	mode_flag=0;
	for(var i=0;i<=9;i++){
		random_flag[i] = 0;
	}
}