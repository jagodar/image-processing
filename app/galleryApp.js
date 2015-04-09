var app = (function () {
	var filesUpload = function filesUpload(config) {
		var defaults = {};
		if (typeof config !== 'object') {
			config = {};
		};
		Object.keys(defaults).forEach(function(key) {
			if (typeof config[key] === 'undefined') {
				config[key] = defaults[key];
			}
		});

		if ('files' in config.input) {
			if (config.input.files.length != 0) {
				for (var i = 0; i < config.input.files.length; i++) {
					var file = config.input.files[i];
					var configCallback = {
						file: file,
						output: config.output,
						draw: config.draw,
						element: config.element
					}
					config.callback(configCallback);
				}
			}
		}	
	},
	callback = function callback(configCallback) {
		var defaults = {};
		if (typeof configCallback !== 'object') {
			configCallback = {};
		};
		Object.keys(defaults).forEach(function(key) {
			if (typeof configCallback[key] === 'undefined') {
				configCallback[key] = defaults[key];
			}
		});

		var canvas = configCallback.element;
		var context = canvas.getContext('2d');
		configCallback.output.appendChild(canvas);

		var configFileReader = {
			context: context, 
			draw: configCallback.draw, 
			canvas: canvas, 
			file: configCallback.file
		}
		fileReader(configFileReader);
	},
	fileReader = function fileReader(configFileReader) {
		var defaults = {};
		if (typeof configFileReader !== 'object') {
			configFileReader = {};
		};
		Object.keys(defaults).forEach(function(key) {
			if (typeof configFileReader[key] === 'undefined') {
				configFileReader[key] = defaults[key];
			}
		});

		var reader = new FileReader();
		reader.onload = (function(context) { 
			return function(e) {
				var img = new Image();
				img.onload = function() {
					var configDraw = {
						img: img, 
						canvas: configFileReader.canvas, 
						context: context,
						maxHeight: 150
					}
					configFileReader.draw(configDraw);
					configFileReader.canvas.onclick = function() {
						window.open(img.src);
					}
				}
				img.src = e.target.result;
			}
		})(configFileReader.context);
		reader.readAsDataURL(configFileReader.file);
	},
	drawThumbnail = function drawThumbnail(configDraw) {
		var defaults = {
			maxHeight: 150
		};
		if (typeof configDraw !== 'object') {
			configDraw = {};
		};
		Object.keys(defaults).forEach(function(key) {
			if (typeof configDraw[key] === 'undefined') {
				configDraw[key] = defaults[key];
			}
		});

		var maxHeight = configDraw.maxHeight;
		if (configDraw.img.height > maxHeight) {
			configDraw.img.width *= maxHeight /configDraw.img.height;
			configDraw.img.height = maxHeight;
		}
		configDraw.canvas.width = configDraw.img.width;
		configDraw.canvas.height = configDraw.img.height;
		configDraw.context.drawImage(configDraw.img,0,0,configDraw.img.width, configDraw.img.height);
	};

	return {
		filesUpload: filesUpload,
		callback: callback,
		drawThumbnail: drawThumbnail,
		fileReader: fileReader
	}
}());

function controller() {
	var config = {
		input: document.getElementById("imagesInput"), 
		output: document.getElementById("imgs"), 
		callback: app.callback, 
		draw: app.drawThumbnail,
		element: document.createElement("canvas")
	};
	app.filesUpload(config);
}
