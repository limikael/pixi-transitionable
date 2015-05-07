module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-jasmine-node');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');
	grunt.loadNpmTasks('grunt-ftps');
	grunt.loadNpmTasks("grunt-exec");
	grunt.loadNpmTasks('grunt-ftpuploadtask');

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
		},

		ftpUploadTask: {
			doc: {
				options: {
					user: "limikael",
					password: process.env.ALTERVISTA_PASSWORD,
					host: "ftp.limikael.altervista.org",
					checksumfile: "_checksums/pixi-transitionable-doc.json"
				},

				files: [{
					expand: true,
					dest: "pixi-transitionable-doc",
					cwd: "doc",
					src: ["**"]
				}]
			},

			demo: {
				options: {
					user: "limikael",
					password: process.env.ALTERVISTA_PASSWORD,
					host: "ftp.limikael.altervista.org",
					checksumfile: "_checksums/pixi-transitionable-demo.json"
				},

				files: [{
					expand: true,
					dest: "pixi-transitionable-demo",
					cwd: "test/view",
					src: ["**"]
				}]
			}
		},

		exec: {
			ip: "curl -s ipinfo.io"
		}
	});

	grunt.registerTask("test", ["jasmine_node"]);
	grunt.registerTask("doc", ["yuidoc", "ftpUploadTask:doc"])
}