import c_img from "./img.js";

function c_button(color, border = null, x = 0, y = 0, action = null) {
	this.color  = color;
	this.border = border;
	this.x      = x;
	this.y      = y;
	this.action = action;
}

c_button.prototype.draw = function() {
	this.color.draw(this.x, this.y);
	if (this.border != null) this.border.draw(this.x, this.y);
};

c_button.prototype.click = function() {
	if (this.color.click(this.x, this.y)) {
		if (this.action !== null) this.action();
		return true;
	} else {
		return false;
	}
};

export default c_button;

/*

//Object.setPrototypeOf(c_button.prototype, c_img.prototype);

function c_button(img, x = 0, y = 0) {
	if (!Array.isArray(colors)) colors = [colors];
	this.colors = colors;
	this.border = border;
	this.x = x;
	this.y = y;
	this.i = 0;
}

c_button.prototype.draw = function() {
	this.colors[this.i].draw(this.x, this.y);
	this.border.draw(this.x, this.y);
};

c_button.prototype.click = function() {
	if (this.colors[0].click(this.x, this.y)) {
		if (++this.i === this.colors.length) this.i = 0;
		return true;
	} else {
		return false;
	}
};


unction c_img(src = null, cx = 0, cy = 0, cr = null, bottom = null) {
	this.src = src;
	if (src !== null) {
	    this.image = new Image();
	    this.image.src = src;
	} else {
		this.image = null;
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
		this.image.onload = on_resize;
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

*/