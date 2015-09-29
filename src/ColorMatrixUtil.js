var PIXI = require("pixi.js");

/**
 * ColorMatrixUtil
 * @class ColorMatrixUtil
 * @internal
 */
function ColorMatrixUtil() {}

/**
 * Create a matrix for tinting.
 * Same tinting algorithm as PIXI.
 * @method tint
 * @static
 */
ColorMatrixUtil.tint = function(color) {
	var rgb = ColorMatrixUtil.hex2rgb(color);
	var r = rgb[0];
	var g = rgb[1];
	var b = rgb[2];

	return [
		r, 0, 0, 0,
		0, g, 0, 0,
		0, 0, b, 0,
		0, 0, 0, 1
	];
}

/**
 * Create a matrix for tinting.
 * Uses the algorithm from Flash.
 * @method advancedTint
 * @static
 */
ColorMatrixUtil.advancedTint = function(color, amount) {
	var LUMA_R = 0.299;
	var LUMA_G = 0.587;
	var LUMA_B = 0.114;

	var rgb = ColorMatrixUtil.hex2rgb(color);

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

/**
 * Convert hex to rgb.
 * @method hex2rgb
 * @static
 */
ColorMatrixUtil.hex2rgb = function(hex) {
	return [(hex >> 16 & 0xFF) / 255, (hex >> 8 & 0xFF) / 255, (hex & 0xFF) / 255];
};

/**
 * Convert rgb to hex.
 * @method rgb2hex
 * @static
 */
ColorMatrixUtil.rgb2hex = function(rgb) {
    return ((rgb[0]*255 << 16) + (rgb[1]*255 << 8) + rgb[2]*255);
};

module.exports = ColorMatrixUtil;