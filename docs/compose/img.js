function c_img(src, cx = 0, cy = 0, cr = null) {
    this.image     = new Image();
    this.image.src = src;
	this.cx         = cx; 
	this.cy         = cy; 
	this.cr         = cr;
}

c_img.prototype.draw = function(x = 0, y = 0) {	
	if (this.image.complete) {
		ctx.drawImage(this.image, x, y);
	} else {
		this.image.onload = on_resize;
	}
};

c_img.prototype.click = function(draw_x = 0, draw_y = 0) {
	if (!this.image.complete) return false;
	if (this.r === null) {
		return will_click(this.image, draw_x, draw_y);
	} else {
		const cx = this.cx + draw_x;
		const cy = this.cy + draw_y;
		const dx = cx - click_x;
		const dy = cy - click_y;
		return dx * dx + dy * dy < this.cr * this.cr;
	}
};

export default c_img;
