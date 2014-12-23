var inherits = require("inherits");
var PIXI = require("pixi.js");
var TransitionableState = require("./TransitionableState");
var TransitionableTransition = require("./TransitionableTransition");
var ColorMatrixUtil = require("./ColorMatrixUtil");

/**
 * A display object that can have different states and transition
 * between them.
 * @class Transitionable
 */
function Transitionable() {
	PIXI.DisplayObjectContainer.call(this);

	this._states = {};
	this._transitions = [];

	this._currentStateName = null;
	this._currentTransition = null;
	this._queuedTransition = null;

	this._tint = 0;
	this._tintAmount = 0;

	this._tintEffect = new PIXI.ColorMatrixFilter();
	this.filters = [this._tintEffect];
}

inherits(Transitionable, PIXI.DisplayObjectContainer);

/**
 * Get a reference to the state with specified name.
 * If it does not exist it will be created. The first
 * created state will automatically be made current.
 * @method state
 */
Transitionable.prototype.state = function(name) {
	if (!name)
		throw new Error("Name expected");

	if (this._states[name])
		return this._states[name];

	this._states[name] = new TransitionableState(name, this);

	if (!this._currentStateName)
		this.current = name;

	return this._states[name];
}

/**
 * Get transition between from and to.
 * @method transition
 */
Transitionable.prototype.transition = function(from, to) {
	for (var i = 0; i < this._transitions.length; i++)
		if (this._transitions[i].getFromState().getName() == from &&
			this._transitions[i].getToState().getName() == to)
			return this._transitions[i];

	var t = new TransitionableTransition(this.state(from), this.state(to));
	this._transitions.push(t);

	return t;
}

/**
 * Gets or sets the current view state.
 * @property current
 */
Object.defineProperty(Transitionable.prototype, "current", {
	get: function() {
		return this._currentStateName;
	},

	set: function(stateName) {
		if (stateName == this._currentStateName)
			return;

		if (!this._states[name])
			this._states[name] = new TransitionableState(name, this);

		if (this._currentTransition) {
			var targetStateName = this._currentTransition.getToState().getName();
			this._queuedTransition = this.transition(targetStateName, stateName);
			this._currentStateName = stateName;
			return;
		}

		if (!this._currentStateName) {
			this._currentStateName = stateName;
			this.state(stateName).install();
			return;
		}

		this._currentTransition = this.transition(this._currentStateName, stateName);
		this._currentTransition.complete = this.onCurrentTransitionComplete.bind(this);
		this._currentTransition.play();
		this._currentStateName = stateName;
	}
});

/**
 * Transition complete.
 * @method onCurrentTransitionComplete
 * @private
 */
Transitionable.prototype.onCurrentTransitionComplete = function() {
	this._currentTransition.complete = null;
	this._currentTransition = null;

	if (this._queuedTransition) {
		this._currentTransition = this._queuedTransition;
		this._queuedTransition = null;

		this._currentTransition.complete = this.onCurrentTransitionComplete.bind(this);
		this._currentTransition.play();
	}
}

/**
 * Set properties.
 * @method setProperties
 * @private
 */
Transitionable.prototype.setStateProperties = function(p) {
	if (p.positionX !== undefined)
		this.position.x = p.positionX;

	if (p.positionY !== undefined)
		this.position.y = p.positionY;

	if (p.scaleX !== undefined)
		this.scale.x = p.scaleX;

	if (p.scaleY !== undefined)
		this.scale.y = p.scaleY;

	if (p.rotation !== undefined)
		this.rotation = p.rotation;

	if (p.width !== undefined)
		this.width = p.width;

	if (p.height !== undefined)
		this.height = p.height;

	if (p.tintR !== undefined || p.tintG !== undefined || p.tintB !== undefined) {
		this.tint = PIXI.rgb2hex([p.tintR, p.tintG, p.tintB]);

		//console.log("r: " + p.tintR + " g: " + p.tintG + " b: " + p.tintB + " tint: " + PIXI.rgb2hex(p.tintR, p.tintG, p.tintB));
	}

	if (p.tintAmount !== undefined)
		this.tintAmount = p.tintAmount;

	if (p.alpha !== undefined)
		this.alpha = p.alpha;

	if (p.visible !== undefined)
		this.visible = p.visible;
}

/**
 * Set tint.
 * @property tint
 */
Object.defineProperty(Transitionable.prototype, "tint", {
	get: function() {
		return this._tint;
	},

	set: function(value) {
		this._tint = value;
		this.updateTint();
	}
});

/**
 * Set tint amount.
 * @property tintAmount
 */
Object.defineProperty(Transitionable.prototype, "tintAmount", {
	get: function() {
		return this._tint;
	},

	set: function(value) {
		this._tintAmount = value;
		this.updateTint();
	}
});

/**
 * Update tint.
 * @method updateTint
 * @private
 */
Transitionable.prototype.updateTint = function() {
	this._tintEffect.matrix = ColorMatrixUtil.tint(
		this._tint,
		this._tintAmount
	);
}

module.exports = Transitionable;