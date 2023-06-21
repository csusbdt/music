function c_img(src = null, cx = 0, cy = 0, cr = null, bottom = null) {
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

export default c_img;
