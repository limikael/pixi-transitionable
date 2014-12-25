var TWEEN = require("tween.js");
var inherits = require("inherits");

/**
 * Holds information about the transition between two states.
 * @class TransitionableTransition
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
	this._isPlaying = false;
	this.complete = null;

	if (!this._target || this._fromState.getTarget() != this._toState.getTarget())
		throw new Error("Something is wrong");
}

/**
 * Play.
 * @method play
 * @internal
 */
TransitionableTransition.prototype.play = function() {
	if (this._isPlaying)
		throw new Error("this shouldn't happen!");

	this._isPlaying = true;
	this._fromState.uninstall();

	for (var i = 0; i < this._movieClips.length; i++) {
		var mc = this._movieClips[i];
		this._target.addChild(mc)
		mc.onComplete = this.onComplete.bind(this);
		mc.loop = false;
		mc.gotoAndPlay(0);
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
 * On movie clip complete.
 * @method onMovieClipComplete
 * @private
 */
TransitionableTransition.prototype.onMovieClipComplete = function() {
	console.log("movieclip complete: " + this._movieClips[0].playing);
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
	this._tween = null;
	this.onComplete();
}

/**
 * We are complete, report completion.
 * But only once!
 * @method onComplete
 * @private
 */
TransitionableTransition.prototype.onComplete = function() {
	if (!this._isPlaying)
		return;

	for (var i = 0; i < this._movieClips.length; i++)
		if (this._movieClips[i].playing)
			return;

	if (this._tween)
		return;

	this._isPlaying = false;

	for (var i = 0; i < this._movieClips.length; i++) {
		var mc = this._movieClips[i];

		mc.stop();
		mc.onComplete = null;
		this._target.removeChild(mc)
	}

	this._toState.install();

	// Call callback.
	this.complete();
}

/**
 * Get from state.
 * @method getFromState
 * @internal
 */
TransitionableTransition.prototype.getFromState = function() {
	return this._fromState;
}

/**
 * Get to state.
 * @method getToState
 * @internal
 */
TransitionableTransition.prototype.getToState = function() {
	return this._toState;
}

/**
 * Add MovieClip that should be played when this transition is in progress.
 * @method addMovieClip
 * @param {PIXI.MovieClip} mc The MovieClip
 */
TransitionableTransition.prototype.addMovieClip = function(mc) {
	this._movieClips.push(mc);
}

/**
 * Remove MovieClip previously added with addMovieClip.
 * @method removeMovieClip
 * @param {PIXI.MovieClip} mc The MovieClip
 */
TransitionableTransition.prototype.removeMovieClip = function(mc) {
	var index = this._movieClips.indexOf(mc);

	if (mc >= 0)
		this._movieClips.splice(index, 1);
}

/**
 * Get or set the duration of the transition in milliseconds.
 * @property duration
 * @type Number
 */
Object.defineProperty(TransitionableTransition.prototype, "duration", {
	get: function() {
		return this._duration;
	},

	set: function(value) {
		this._duration = value;
	}
});

/**
 * Get or set the easing function to use when playing this transition.
 * These transitions are played using the 
 * <a href="https://github.com/sole/tween.js/">TWEEN.js</a> library, 
 * so the avilable functions are those defined there, for example:
 *
 *     TWEEN.Easing.Elastic.InOut
 *     TWEEN.Easing.Quadratic.InOut
 * 
 * @property easing
 * @type Object
 */
Object.defineProperty(TransitionableTransition.prototype, "easing", {
	get: function() {
		return this._easing;
	},

	set: function(value) {
		this._easing = value;
	}
});

module.exports = TransitionableTransition;