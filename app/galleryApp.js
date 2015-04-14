var app = (function () {
	var filesUpload = function filesUpload(config) {
		var input = config.input;
		if ('files' in input && input.files.length != 0) {
			for (var i = 0; i < input.files.length; i++) {
				var file = input.files[i];
				console.log(file);
				var configCallback = {
					file: file,
					output: config.output,
					draw: config.draw,
					element: config.element
				}
				config.callback(configCallback);
			}
		}	
	},
	callback = function callback(configCallback) {
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
		var img = configDraw.img,
		canvas = configDraw.canvas,
		maxHeight = configDraw.maxHeight,
		context = configDraw.context;
		if (img.height > maxHeight) {
			img.width *= maxHeight /img.height;
			img.height = maxHeight;
		}
		canvas.width = img.width;
		canvas.height = img.height;
		context.drawImage(img,0,0,img.width, img.height);
	};
	return {
		filesUpload: filesUpload,
		callback: callback,
		drawThumbnail: drawThumbnail,
		fileReader: fileReader
	}
}());


var dragNDrop = (function () {
	var setDnD = function setDnD(config) {
		config.input.addEventListener("dragover", function(e){
			e.preventDefault();

		}, true);
		config.input.addEventListener("drop", function(e){
			e.preventDefault();
			var conf = {
				e: e
			};
			config.callback(conf);
		}, true);
	},
	callback = function callback(config) {
		var e = config.e;
		var data = e.dataTransfer.files;
		console.log(data);
	};
	return {
		setDnD: setDnD,
		callback: callback
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
	var configDnD = {
		input: document.getElementById("target"),
		callback: dragNDrop.callback
	}
	dragNDrop.setDnD(configDnD);
}

