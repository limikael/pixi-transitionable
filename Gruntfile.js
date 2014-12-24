module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-jasmine-node');

	grunt.initConfig({
		browserify: {
			options: {
				browserifyOptions: {
					debug: true
				}
			},

			"test/view/TransitionableTestApp.bundle.js": ["test/view/TransitionableTestApp.js"]
		},

		jasmine_node: {
			all: ["./test/unit"]
		},

		pkg: grunt.file.readJSON('package.json')
	});

	grunt.registerTask("test", ["jasmine_node"]);
}