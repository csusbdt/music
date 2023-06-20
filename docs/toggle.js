function c_toggle(color_0, color_1, border) {
	this.color   = color_0;
	this.color_0 = color_0;
	this.color_1 = color_1;
	this.border  = border;
}

c_toggle.prototype.draw = function() {
	this.color.draw();
	this.border.draw();
};

c_toggle.prototype.click = function() {
	if (this.color.click()) {
		if (this.color === this.color_0) this.color = this.color_1;
		else this.color = this.color_0;
		return true;
	} else return false;
};

export default c_toggle;
