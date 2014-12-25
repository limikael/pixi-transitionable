var inherits = require("inherits");
var PIXI = require("pixi.js");
var TransitionableState = require("./TransitionableState");
var TransitionableTransition = require("./TransitionableTransition");
var ColorMatrixUtil = require("./ColorMatrixUtil");

/**
 * A Transitionable is a DisplayObject that can have different views 
 * states and transition smoothly between them. 
 * 
 * Think of a Transitionable as a DisplayObjectContainer,
 * in the sense that it has properties such as position,
 * rotation and scale to control its appearance. 
 * In the case of DisplayObjectContainer you set those
 * properties directly, but in the case of a Transitionable you set up a number
 * of states defining the possible values for those properties. You can then
 * transition between those states and these properties will be tweened to
 * animate smoothly.
 *
 * For example:
 *
 *     var transitionable = new Transitionable();
 *
 *     transitionable.state("out").scale = 1;
 *     transitionable.state("over").scale = 1.5;
 *
 *     transitionable.addChild(someContent);
 *
 * This defines a transitinable that has two states, the "out" state and the "over"
 * state. When the transitionable is in its "out" state, the scale should be 1,
 * and when it is in its "over" state the scale is 1.5. Also, the transitionable
 * has some content, illustrated by the addChild call, and that content could be
 * anything that can be added to a DisplayObjectContainer. Now, to set our 
 * transitionable to the "over" state, we can simply do:
 *
 *     transitionable.current = "over";
 *
 * Which will cause it to smoothly scale to 1.5 its original size. To make it
 * shrink down again, we can do: 
 *
 *     transitionable.current = "out";
 *
 * We can control how the transition should happen by accessing a transition object
 * and set properties there. For example, if we would like the transition from
 * the "over" state to the "out" state to take 500 milliseconds we can do:
 *
 *     transitionable.transition("out", "over").duration = 500;
 *
 * For more details on how to control the properties set by the states and 
 * transitions, see the {{#crossLink "TransitionableState"}}{{/crossLink}}
 * and {{#crossLink "TransitionableTransition"}}{{/crossLink}} classes.
 * @class Transitionable
 * @extends PIXI.DisplayObjectContainer
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

	this._transitionableChildren = [];
}

inherits(Transitionable, PIXI.DisplayObjectContainer);

/**
 * Get a reference to the state with specified name.
 * If it does not exist it will be created. The first
 * created state will automatically be made the current state.
 * @method state
 * @param {String} name The name of the state.
 * @return {TransitionableState} The object that holds properties specific to the state.
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
 * Get transition between state from and to.
 * This method will return an object representing the transition between the two
 * states.
 * @method transition
 * @param {String} from The name of the state that the transition transitions from.
 * @param {String} to The name of the state that the transition transitions to.
 * @return {TransitionableTransition} The object representing the transition.
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
 * Get or set the current view state.
 * Setting this property will make this Transitionable transition
 * into the specified state. If this is already the current state,
 * setting this property will have no effect. If this Transitionable
 * has child transitionables, added with
 * {{#crossLink "Transitionable/addTransitionableChild:method"}}{{/crossLink}},
 * the specified state will be made the the current state for the
 * children as well.
 * current state
 * @property current
 */
Object.defineProperty(Transitionable.prototype, "current", {
	get: function() {
		return this._currentStateName;
	},

	set: function(stateName) {
		for (var i = 0; i < this._transitionableChildren.length; i++)
			this._transitionableChildren[i].current = stateName;

		if (stateName == this._currentStateName || stateName === undefined)
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
		this._currentStateName = stateName;

		this._currentTransition.complete = this.onCurrentTransitionComplete.bind(this);
		this._currentTransition.play();
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
	}

	if (p.tintAmount !== undefined)
		this.tintAmount = p.tintAmount;

	if (p.alpha !== undefined)
		this.alpha = p.alpha;

	if (p.visible !== undefined)
		this.visible = p.visible;
}

/**
 * Get or set tint color. This transitionable will be tinted by the
 * color specified by this proberty, by the amount speficied by the
 * {{#crossLink "Transitionable/tintAmount:property"}}{{/crossLink}}.
 * Beware that if the tintAmount is 0, which is the default, setting 
 * the tint property will have no effect. If you want to apply a 
 * tint, always set the tintAmount in conjunction with the tint.
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
 * Set tint amount. The tintAmount specifies how much this Transitionable
 * should be tinted by the color specified using the 
 * {{#crossLink "Transitionable/tint:property"}}{{/crossLink}} property.
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
 * Update tint properties.
 * @method updateTint
 * @private
 */
Transitionable.prototype.updateTint = function() {
	this._tintEffect.matrix = ColorMatrixUtil.tint(
		this._tint,
		this._tintAmount
	);

	if (!this.filters || this.filters.indexOf(this._tintEffect)<0)
		this.filters = [this._tintEffect];
}

/**
 * Add a Transitionable as a child. This child will follow the
 * state changes of the parent Transitionable.
 *
 * For example, if we would have the following code:
 *
 *     var parent = new Transitionable();
 *     var child = new Transitionable();
 *
 *     parent.addTransitionableChild(child);
 *
 * Then this would firstly have the same effect as adding the child
 * using the regular addChild method. Secondly, it would also have
 * the added effect that if we do:
 *
 *     parent.current = "something";
 *
 * Then it would also change the state of the child into "something".
 * @method addTransitionableChild
 * @param {Transitionable} child The transitionable to add.
 */
Transitionable.prototype.addTransitionableChild = function(child) {
	this._transitionableChildren.push(child);
	this.addChild(child);

	if (this.current)
		child.current = this.current;
}

/**
 * Remove a child previously added with
 * {{#crossLink "Transitionable/addTransitionableChild:method"}}{{/crossLink}}.
 * @method removeTransitionableChild
 * @param {Transitionable} child The transitionable to remove.
 */
Transitionable.prototype.removeTransitionableChild = function(child) {
	var index = this._transitionableChildren.indexOf(child);
	if (index >= 0)
		this._transitionableChildren.splice(index, 1);

	this.removeChild(child);
}

module.exports = Transitionable;