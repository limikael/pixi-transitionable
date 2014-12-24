module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-jasmine-node');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

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

		yuidoc: {
			all: {
				name: '<%= pkg.name %>',
				description: '<%= pkg.description %>',
				version: '<%= pkg.version %>',
				url: '<%= pkg.homepage %>',
				options: {
					paths: "src",
					outdir: "doc",
					preprocessor: ["yuidoc-filter-tags", "yuidoc-die-on-warnings"],
					"dont-include-tags": "internal"
				}
			}
		}
	});

	grunt.registerTask("test", ["jasmine_node"]);
}