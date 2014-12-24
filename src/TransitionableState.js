var PIXI = require("pixi.js");
var ReactableObject = require("./ReactableObject");

/**
 * Holds the properties for a view state.
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
 */
TransitionableState.prototype.getTarget = function() {
	return this._target;
}

/**
 * Get name of the state.
 * @method getName
 */
TransitionableState.prototype.getName = function() {
	return this._name;
}

/**
 * Install.
 * @method install
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
 * Add child.
 * @method addChild
 */
TransitionableState.prototype.addChild = function(c) {
	this._children.push(c);

	if (this._installed)
		this._target.addChild(c);
}

/**
 * Uninstall.
 * @method uninstall
 */
TransitionableState.prototype.uninstall = function() {
	this._installed = false;

	for (var i = 0; i < this._children.length; i++)
		this._target.removeChild(this._children[i]);
}

/**
 * Holds the x and y coordinate.
 * @property position
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
 * or the x and y values can be set individually.
 * @property scale
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

Object.defineProperty(TransitionableState.prototype, "x", {
	get: function() {
		return this._position.x;
	},

	set: function(value) {
		this._position.x = value;
	}
});

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

TransitionableState.createSimpleProperty("rotation");
TransitionableState.createSimpleProperty("alpha");
TransitionableState.createSimpleProperty("tint");
TransitionableState.createSimpleProperty("tintAmount");

//TransitionableState.createProperty("visible");

module.exports = TransitionableState;