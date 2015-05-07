module.exports = function(grunt) {
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-jasmine-node');
	grunt.loadNpmTasks('grunt-contrib-yuidoc');
	grunt.loadNpmTasks('zipdeploy');
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

		zipdeploy: {
			doc: {
				dir: "doc",
				url: "http://limikael.altervista.org",
				target: "pixi-transitionable-doc",
				key: "SaCpyeAzJ3YMdULv"
			},

			demo: {
				dir: "test/view",
				url: "http://limikael.altervista.org",
				target: "pixi-transitionable-demo",
				key: "TvR9x97AQ7ZvW3e6"
			}
		},

		ftpUploadTask: {
			target: {
				options: {
					user: "limikael",
					password: process.env.ALTERVISTA_PASSWORD,
					host: "ftp.limikael.altervista.org",
					checksumfile: "ftpuploadtest.checksums.json"
				},

				files: [{
					expand: true,
					dest: "ftpuploadtest",
					src: ["**", "!**/node_modules/**"]
				}]
			}
		},

		exec: {
			ip: "curl -s ipinfo.io"
		}
	});

	grunt.registerTask("test", ["jasmine_node"]);
	grunt.registerTask("doc", ["yuidoc", "zipdeploy:doc"])
}