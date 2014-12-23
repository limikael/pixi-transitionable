var PixiApp = require("PixiApp");
var PIXI = require("pixi.js");
var inherits = require("inherits");
var Transitionable = require("../src/Transitionable");
var TWEEN = require("tween.js");

function TransitionableButton(text) {
	Transitionable.call(this);

	var g = new PIXI.Graphics();
	g.beginFill(0xff8000);
	g.drawRect(-100, -20, 200, 40);

	this.addChild(g);

	var t = new PIXI.Text(text);

	t.x = -t.width / 2;
	t.y = -12;
	this.addChild(t);

	this.interactive = true;
	this.buttonMode = true;

	this.state("up").scale = 1;
	this.state("up").tint = 0xffffff;
	this.state("up").tintAmount = 0;

	this.state("over").scale = 1.25;
	this.state("over").tint = 0xffff80;
	this.state("over").tintAmount = .5;

	this.state("down").scale = .75;
	this.state("down").tint = 0x808080;
	this.state("down").tintAmount = 1;

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

	this.backgroundColor = 0x000000;
	this.matte = true;
	this.matteColor = 0x808080;

	var assets = [
		"SpriteSheet.json"
	];

	this.assetLoader = new PIXI.AssetLoader(assets);
	this.assetLoader.addEventListener("onComplete", this.onAssetsLoaded.bind(this));
	this.assetLoader.load();

	this.on("frame", TWEEN.update);
}

inherits(TransitionableTestApp, PixiApp);

TransitionableTestApp.prototype.onAssetsLoaded = function() {
	console.log("assets loaded");
	var button = new TransitionableButton("CLICK ME");

	button.x = 200;
	button.y = 50;

	this.addChild(button);
}

new TransitionableTestApp();