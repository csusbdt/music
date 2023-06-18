function c_button(colors, border, x = 0, y = 0) {
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

export default c_button;
