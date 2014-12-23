var PIXI = require("pixi.js");

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

	if (this._properties.position !== undefined) {
		p.positionX = this._properties.position.x;
		p.positionY = this._properties.position.y;
	}

	if (this._properties.x !== undefined)
		p.positionX = this._properties.x;

	if (this._properties.y !== undefined)
		p.positionY = this._properties.y;

	if (typeof this._properties.scale == "number") {
		p.scaleX = this._properties.scale;
		p.scaleY = this._properties.scale;
	} else if (typeof this._properties.scale == "object") {
		p.scaleX = this._properties.scale.x;
		p.scaleY = this._properties.scale.y;
	}

	if (this._properties.tint !== undefined) {
		var rgb = PIXI.hex2rgb(this._properties.tint);

		p.tintR = rgb[0];
		p.tintG = rgb[1];
		p.tintB = rgb[2];
	}

	if (this._properties.tintAmount !== undefined) {
		p.tintAmount = this._properties.tintAmount;
	}

	return p;
}

/**
 * Set property.
 */
TransitionableState.prototype.setProperty = function(property, value) {
	this._properties[property] = value;

	if (this._installed)
		this._target.setStateProperties(this.getProperties());
}

/**
 * Add child.
 * @method addChild
 */
TransitionableState.prototype.addChild = function(c) {
	this.children.push(c);

	if (this._installed)
		this.target.addChild(c);
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
 * Create a property.
 * @static
 * @private
 */
TransitionableState.createProperty = function(name) {
	Object.defineProperty(TransitionableState.prototype, name, {
		get: function() {
			return this._properties[name];
		},
		set: function(v) {
			return this.setProperty(name, v);
		}
	});
}

TransitionableState.createProperty("position");
TransitionableState.createProperty("x");
TransitionableState.createProperty("y");
TransitionableState.createProperty("rotation");
TransitionableState.createProperty("scale");
TransitionableState.createProperty("alpha");
TransitionableState.createProperty("visible");
TransitionableState.createProperty("tint");
TransitionableState.createProperty("tintAmount");

module.exports = TransitionableState;