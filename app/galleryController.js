var app = (function () {
	var filesUpload = function filesUpload(inputId, outputId, addImage, draw) {
		var input = document.getElementById(inputId);
		var output = document.getElementById(outputId);
		if ('files' in input) {
			if (input.files.length != 0) {
				for (var i = 0; i < input.files.length; i++) {
					var file = input.files[i];
					addImage(file, output, draw);
				}
			}
		}	
	},
	addImage = function addImage(file, output, draw) {
		var canvas = document.createElement("canvas");
		var context = canvas.getContext('2d');
		
		output.appendChild(canvas);

		var reader = new FileReader();
		reader.onload = (function(context) { 
			return function(e) {
				var img = new Image();
				img.onload = function() {
					draw(img, canvas, context);
					canvas.onclick = function() {
						window.open(img.src);
					}
				}
				img.src = e.target.result;
			}
		})(context);
		reader.readAsDataURL(file);
	},
	drawThumbnail = function drawThumbnail(img, canvas, context) {
		var maxHeigth = 150;
		if (img.height > maxHeigth) {
			img.width *= maxHeigth /img.height;
			img.height = maxHeigth;
		}
		canvas.width = img.width;
		canvas.height = img.height;
		context.drawImage(img,0,0,img.width, img.height);
	};

	return {
		filesUpload: filesUpload,
		addImage: addImage,
		drawThumbnail: drawThumbnail
	};
}());

function controller() {
	app.filesUpload("imagesInput", "imgs", app.addImage, app.drawThumbnail);
}
