/**
 * An object that notifies a function when its
 * properties change.
 * @class ReactableObject
 * @internal
 */
function ReactableObject(properties) {
	if (!(properties instanceof Array))
		throw new Error("need to be array");

	this.properties = {};

	for (var i = 0; i < properties.length; i++)
		this.createReactableProperty(properties[i]);
}

/**
 * A function that gets called if any of the properties
 * specified in the constructor gets modified.
 * @property onchange
 */
ReactableObject.prototype.onchange = null;

/**
 * Create a property that calles the change function if it gets modified.
 * @method createReactableProperty
 * @private
 */
ReactableObject.prototype.createReactableProperty = function(name) {
	var scope = this;

	Object.defineProperty(this, name, {
		get: function() {
			return scope.properties[name]
		},

		set: function(value) {
			scope.properties[name] = value;
			if (scope.onchange)
				scope.onchange();
		}
	});
}

module.exports = ReactableObject;