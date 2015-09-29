var PixiApp = require("pixiapp");
var PIXI = require("pixi.js");
var inherits = require("inherits");
var Transitionable = require("../../src/Transitionable");
var TWEEN = require("tween.js");

function TransitionableButton(text) {
	Transitionable.call(this);

	var g = new PIXI.Graphics();
	g.beginFill(0xffffff);
	g.drawRect(-100, -20, 200, 40);

	this.addChild(g);

	var t = new PIXI.Text(text);

	t.x = -t.width / 2;
	t.y = -12;
	this.addChild(t);

	this.interactive = true;
	this.buttonMode = true;

	this.state("up").scale = 1;
	this.state("up").tint = 0xff8000;

	this.state("over").scale = 1.25;
	this.state("over").tint = 0xffc040;

	this.state("down").scale = .75;
	this.state("down").tint = 0xc08040;

	this.transition("over", "down").duration = 100;

	var scope = this;

	this.mouseover = function() {
		scope.current = "over";
	}

	this.mouseout = function() {
		scope.current = "up";
	}

	this.mousedown = function() {
		scope.current = "down";
	}

	this.mouseup = function() {
		scope.current = "over";
	}
}

inherits(TransitionableButton, Transitionable);

function TransitionableTestApp() {
	PixiApp.call(this, 1024, 768);

	this.backgroundColor = 0xffffff;
	this.matte = true;
	this.matteColor = 0x000000;

	PIXI.loader
		.add("SpriteSheet.json")
		.add("egg_whole.png")
		.add("egg_cracked.png")
		.load(this.onAssetsLoaded.bind(this));

	this.on("frame", TWEEN.update);
}

inherits(TransitionableTestApp, PixiApp);

TransitionableTestApp.prototype.onAssetsLoaded = function() {
	console.log("assets loaded");

	/**** Create the egg. ****/
	var egg = new Transitionable();
	this.addChild(egg);
	egg.x = 130;
	egg.y = -50;

	var explosionFrames = [];
	for (i = 1; i <= 27; i++)
		explosionFrames.push("Explosion_Sequence_A " + i + ".png");

	var explosion = PIXI.extras.MovieClip.fromFrames(explosionFrames);
	explosion.x = 50;
	explosion.y = 170;
	egg.transition("whole", "cracked").addMovieClip(explosion);

	var wholeEgg = new Transitionable();
	wholeEgg.transition("whole", "cracked").duration = 500;
	wholeEgg.transition("cracked", "whole").duration = 0;
	wholeEgg.addChild(PIXI.Sprite.fromImage("egg_whole.png"));
	wholeEgg.state("whole").alpha = 1;
	wholeEgg.state("cracked").alpha = 0;
	egg.addTransitionableChild(wholeEgg);

	var crackedEgg = new Transitionable();
	crackedEgg.transition("whole", "cracked").duration = 500;
	crackedEgg.transition("cracked", "whole").duration = 0;
	crackedEgg.addChild(PIXI.Sprite.fromImage("egg_cracked.png"));
	crackedEgg.state("whole").alpha = 0;
	crackedEgg.state("cracked").alpha = 1;
	egg.addTransitionableChild(crackedEgg);

	/**** Create the square. ****/
	var square = new Transitionable();
	this.addChild(square);

	var g = new PIXI.Graphics();
	g.beginFill(0xff0000);
	g.drawRect(0, 0, 100, 100);
	square.addChild(g);

	square.state("one").x = 600;
	square.state("one").y = 50;

	square.state("two").x = 900;
	square.state("two").y = 200;

	square.state("three").x = 500;
	square.state("three").y = 400;

	/**** Create the buttons. ****/
	var b;

	b = new TransitionableButton("one");
	b.x = 700;
	b.y = 600;
	this.addChild(b);
	b.click = function() {
		square.current = "one";
	}

	b = new TransitionableButton("two");
	b.x = 700;
	b.y = 650;
	this.addChild(b);
	b.click = function() {
		square.current = "two";
	}

	b = new TransitionableButton("three");
	b.x = 700;
	b.y = 700;
	this.addChild(b);
	b.click = function() {
		square.current = "three";
	}

	b = new TransitionableButton("whole");
	b.x = 300;
	b.y = 600;
	this.addChild(b);
	b.click = function() {
		egg.current = "whole";
	}

	b = new TransitionableButton("cracked");
	b.x = 300;
	b.y = 650;
	this.addChild(b);
	b.click = function() {
		egg.current = "cracked";
	}
}

new TransitionableTestApp();