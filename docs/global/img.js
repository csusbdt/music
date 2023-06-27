let loading = 0;

const on_loading_complete = _ => {
	assert(loading > 0);
	if (--loading === 0) on_resize();
};

function c_img(src = null, cx = 0, cy = 0, cr = null, bottom = null) {
	if (typeof src === 'string') {
	    this.image = new Image();
	    this.image.src = src;		
	} else if (src === null) {
		this.image = null;
	} else {
		this.image = src;
	}
	this.cx        = cx; 
	this.cy        = cy; 
	this.cr        = cr;
	this.bottom    = bottom;
}

c_img.prototype.draw = function(x = 0, y = 0) {
	if (this.image === null) {
		return;
	} else if (this.image.complete) {
		ctx.drawImage(this.image, x, y);
	} else {
		++loading;
		this.image.addEventListener('load', on_loading_complete, {once: true});
	}
};

c_img.prototype.click = function(draw_x = 0, draw_y = 0) {
	if (!this.image.complete) return false;
	if (this.cr === null) {
		return click_test(this.image, draw_x, draw_y);
	} else if (this.bottom !== null) {
		const left = this.cx;
		const top = this.cy;
		const right = this.cr;
		return (
			draw_x + left        < click_x && 
			draw_y + top         < click_y &&
			draw_x + right       > click_x &&
			draw_y + this.bottom > click_y
		);
	} else {
		const cx = this.cx + draw_x;
		const cy = this.cy + draw_y;
		const dx = cx - click_x;
		const dy = cy - click_y;
		return dx * dx + dy * dy < this.cr * this.cr;
	}
};

const to_color = function(from_img, to_img, r, g, b) {
	const canvas = document.createElement("canvas");
	canvas.width  = design_width;
	canvas.height = design_height;
	const ctx = canvas.getContext("2d");
	ctx.drawImage(from_img.image, 0, 0);
	const image_data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = image_data.data;
    const len = pixels.length;
    for (let pixel = 0; pixel < len; pixel += 4) {
		if (pixels[pixel + 3] !== 0) {
			pixels[pixel + 0] = r;
			pixels[pixel + 1] = g;
			pixels[pixel + 2] = b;
		}
    }
    ctx.putImageData(image_data, 0, 0);
	to_img.image = new Image();
	to_img.image.src = canvas.toDataURL();
};

c_img.prototype.clone_color = function(r, g, b) {
	const img = new c_img(null, this.cx, this.cy, this.cr, this.bottom);
	if (!this.image.complete) {
		let onload = to_color.bind(null, this, img, r, g, b);
		this.image.addEventListener('load', onload, {once: true});
	} else {
		to_color(this, img, r, g, b);
	}
	return img;
};

c_img.prototype.clone_red = function() {
	return this.clone_color(
		window.colors.red[0], 
		window.colors.red[1], 
		window.colors.red[2]
	);
};

c_img.prototype.clone_green = function() {
	return this.clone_color(
		window.colors.green[0], 
		window.colors.green[1], 
		window.colors.green[2]
	);
};

c_img.prototype.clone_blue = function() {
	return this.clone_color(
		window.colors.blue[0], 
		window.colors.blue[1], 
		window.colors.blue[2]
	);
};

c_img.prototype.clone_yellow = function() {
	return this.clone_color(
		window.colors.yellow[0], 
		window.colors.yellow[1], 
		window.colors.yellow[2]
	);
};

c_img.prototype.clone_white = function() {
	return this.clone_color(
		window.colors.white[0], 
		window.colors.white[1], 
		window.colors.white[2]
	);
};

c_img.prototype.clone_black = function() {
	return this.clone_color(
		window.colors.black[0], 
		window.colors.black[1], 
		window.colors.black[2]
	);
};

export default c_img;
