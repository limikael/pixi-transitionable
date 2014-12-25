var PIXI = require("pixi.js");
var ReactableObject = require("./ReactableObject");

/**
 * Holds the properties for a view state. The properties set to the state
 * will be applied to the target
 * {{#crossLink "Transitionable"}}{{/crossLink}} when this state is made
 * current. If this state is already the current state, then chaning the
 * properties of the state will immediately effect those of the target.
 * @class TransitionableState
 */
function TransitionableState(name, target) {
	this._target = target;
	this._name = name;
	this._children = [];
	this._properties = {};
	this._installed = false;

	this._position = new ReactableObject(["x", "y"]);
	this._scale = new ReactableObject(["x", "y"]);

	this._position.onchange = this.onPropertiesChange.bind(this);
	this._scale.onchange = this.onPropertiesChange.bind(this);
}

/**
 * Properties were changed, set properties in our target if
 * this state is installed.
 * @method onPropertiesChange
 * @private
 */
TransitionableState.prototype.onPropertiesChange = function() {
	if (this._installed)
		this._target.setStateProperties(this.getProperties());
}

/**
 * Get target.
 * @method getTarget
 * @internal
 */
TransitionableState.prototype.getTarget = function() {
	return this._target;
}

/**
 * Get name of the state.
 * @method getName
 * @internal
 */
TransitionableState.prototype.getName = function() {
	return this._name;
}

/**
 * Install.
 * @method install
 * @internal
 */
TransitionableState.prototype.install = function() {
	this._installed = true;
	this._target.setStateProperties(this.getProperties());

	for (var i = 0; i < this._children.length; i++) {
		var c = this._children[i];
		this._target.addChild(c);
	}
}

/**
 * Get properties.
 * @method getProperties
 * @internal
 */
TransitionableState.prototype.getProperties = function() {
	var p = {};

	if (this._position.x !== undefined)
		p.positionX = this._position.x;

	if (this._position.y !== undefined)
		p.positionY = this._position.y;

	if (this._scale.x !== undefined)
		p.scaleX = this._scale.x;

	if (this._scale.y !== undefined)
		p.scaleY = this._scale.y;

	if (this._properties.tint !== undefined) {
		var rgb = PIXI.hex2rgb(this._properties.tint);

		p.tintR = rgb[0];
		p.tintG = rgb[1];
		p.tintB = rgb[2];
	}

	if (this._properties.tintAmount !== undefined)
		p.tintAmount = this._properties.tintAmount;

	if (this._properties.rotation !== undefined)
		p.rotation = this._properties.rotation;

	if (this._properties.alpha !== undefined)
		p.alpha = this._properties.alpha;

	return p;
}

/**
 * Add child that should be added to the target
 * {{#crossLink "Transitionable"}}{{/crossLink}}
 * when this state is entered.
 * @method addChild
 * @param {PIXI.DisplayObject} child The child to add.
 */
TransitionableState.prototype.addChild = function(c) {
	this._children.push(c);

	if (this._installed)
		this._target.addChild(c);
}

/**
 * Remove a child previously added with
 * {{#crossLink "TransitionableState/addChild:method"}}{{/crossLink}},
 * @method removeChild
 * @param {PIXI.DisplayObject} child The child to remove.
 */
TransitionableState.prototype.removeChild = function(c) {
	var index = this._children.indexOf(c);
	if (index < 0)
		return;

	this._children.splice(index, 1);

	if (this._installed)
		this._target.removeChild(c);
}

/**
 * Uninstall.
 * @method uninstall
 * @internal
 */
TransitionableState.prototype.uninstall = function() {
	this._installed = false;

	for (var i = 0; i < this._children.length; i++)
		this._target.removeChild(this._children[i]);
}

/**
 * Holds the x and y coordinate. To access it use code like this:
 * 
 *     transitionable.state("somestate").position.x = 100;
 *     transitionable.state("somestate").position.y = 100;
 * @property position
 * @type Object
 */
Object.defineProperty(TransitionableState.prototype, "position", {
	get: function() {
		return this._position;
	},

	set: function(o) {
		this._position.x = o.x;
		this._position.y = o.y;
	}
});

/**
 * The scaling of the object. This can be assigned a number,
 * or the x and y values can be set individually. I.e., you can
 * set individual scale for the x and y axis using code like this:
 * 
 *     transitionable.state("somestate").scale.x = 1.5;
 *     transitionable.state("somestate").scale.y = 1.5;
 *
 * You can also assign a number to this property, and this will
 * specify the scaling for both axis. For example:
 * 
 *     transitionable.state("somestate").scale = 1.5;
 *
 * @property scale
 * @type Object
 */
Object.defineProperty(TransitionableState.prototype, "scale", {
	get: function() {
		return this._scale;
	},

	set: function(o) {
		if (typeof o == "number") {
			this._scale.x = o;
			this._scale.y = o;
			return;
		}

		this._scale.x = o.x;
		this._scale.y = o.y;
	}
});

/**
 * The x coordinate for the object. This is an alias for
 * `position.x`.
 * @property x
 * @type Number
 */
Object.defineProperty(TransitionableState.prototype, "x", {
	get: function() {
		return this._position.x;
	},

	set: function(value) {
		this._position.x = value;
	}
});

/**
 * The y coordinate for the object. This is an alias for
 * `position.y`.
 * @property y
 * @type Number
 */
Object.defineProperty(TransitionableState.prototype, "y", {
	get: function() {
		return this._position.y;
	},

	set: function(value) {
		this._position.y = value;
	}
});

/**
 * Create a simple property.
 * @method createSimpleProperty
 * @static
 * @private
 */
TransitionableState.createSimpleProperty = function(name) {
	Object.defineProperty(TransitionableState.prototype, name, {
		get: function() {
			return this._properties[name];
		},
		set: function(value) {
			this._properties[name] = value;

			if (this._installed)
				this._target.setStateProperties(this.getProperties());
		}
	});
}

/**
 * The rotation of the target object when this state is current.
 * The angle is in radians.
 * @property rotation
 * @type Number
 */
TransitionableState.createSimpleProperty("rotation");

/**
 * The opacity of the target object when this state is current.
 * @property alpha
 * @type Number
 */
TransitionableState.createSimpleProperty("alpha");

/**
 * The tint of the target object when this state is current.
 * @property tint
 * @type Number
 */
TransitionableState.createSimpleProperty("tint");

/**
 * The tintAmount of the target object when this state is current.
 * @property tintAmount
 * @type Number
 */
TransitionableState.createSimpleProperty("tintAmount");

//TransitionableState.createProperty("visible");

module.exports = TransitionableState;