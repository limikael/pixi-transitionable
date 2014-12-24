var PIXI = require("pixi.js");

/**
 * ColorMatrixUtil
 * @class ColorMatrixUtil
 * @internal
 */
function ColorMatrixUtil() {}

/**
 * Create a matrix for tinting.
 * @method tint
 * @static
 */
ColorMatrixUtil.tint = function(color, amount) {
	var LUMA_R = 0.299;
	var LUMA_G = 0.587;
	var LUMA_B = 0.114;

	var rgb = PIXI.hex2rgb(color);

	var r = rgb[0];
	var g = rgb[1];
	var b = rgb[2];
	var q = 1 - amount;

	var rA = amount * r;
	var gA = amount * g;
	var bA = amount * b;

	return [
		q + rA * LUMA_R, rA * LUMA_G, rA * LUMA_B, 0,
		gA * LUMA_R, q + gA * LUMA_G, gA * LUMA_B, 0,
		bA * LUMA_R, bA * LUMA_G, q + bA * LUMA_B, 0,
		0, 0, 0, 1
	];
}

module.exports = ColorMatrixUtil;