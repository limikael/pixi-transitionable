module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-browserify');

	grunt.initConfig({
		browserify: {
			options: {
				browserifyOptions: {
					debug: true
				}
			},

			"test/TransitionableTestApp.bundle.js": ["test/TransitionableTestApp.js"]
		},

		pkg: grunt.file.readJSON('package.json')
	});
}