var TWEEN = require("tween.js");
var inherits = require("inherits");

/**
 * @class DisplayTransition
 */
function TransitionableTransition(fromState, toState) {
	this._fromState = fromState;
	this._toState = toState;
	this._target = this._fromState.getTarget();
	this._movieClips = [];
	this._tweenProperties = null;
	this._tween = null;
	this._easing = TWEEN.Easing.Quadratic.InOut;
	this._duration = 200;

	this.complete = null;

	if (!this._target || this._fromState.getTarget() != this._toState.getTarget())
		throw new Error("Something is wrong");
}

/**
 * Play.
 * @method play
 */
TransitionableTransition.prototype.play = function() {
	this._fromState.uninstall();

	for (var i = 0; i < this._movieClips.length; i++) {
		var mc = this._movieClips[i];
		this._target.addChild(mc)
		mc.gotoAndPlay(0);
		mc.loop = false;
	}

	this._tweenProperties = this._fromState.getProperties();

	this._tween = new TWEEN.Tween(this._tweenProperties);
	this._tween.to(this._toState.getProperties(), this._duration);
	this._tween.easing(this._easing);
	this._tween.onUpdate(this.onTweenUpdate.bind(this));
	this._tween.onComplete(this.onTweenComplete.bind(this));
	this._tween.start();
}

/**
 * Tween update.
 * @method onTweenUpdate
 * @private
 */
TransitionableTransition.prototype.onTweenUpdate = function(o) {
	this._target.setStateProperties(this._tweenProperties);
}

/**
 * Tween complete.
 * @method onTweenComplete
 * @private
 */
TransitionableTransition.prototype.onTweenComplete = function() {
	for (var i = 0; i < this._movieClips.length; i++) {
		var mc = this._movieClips[i];
		mc.stop();
		this._target.removeChild(mc)
	}

	this._toState.install();
	this.complete();
}

/**
 * Get from state.
 * @method getFromState
 */
TransitionableTransition.prototype.getFromState = function() {
	return this._fromState;
}

/**
 * Get to state.
 * @method getToState
 */
TransitionableTransition.prototype.getToState = function() {
	return this._toState;
}

/**
 * Add movie clip.
 * @method addMovieClip
 */
TransitionableTransition.prototype.addMovieClip = function(mc) {
	this._movieClips.push(mc);
}

/**
 * Get or set the duration of the transition.
 * @property duration
 */
Object.defineProperty(TransitionableTransition.prototype, "duration", {
	get: function() {
		return this._duration;
	},

	set: function(value) {
		this._duration = value;
	}
});

module.exports = TransitionableTransition;