function c_button(color, border, x, y, action = null) {
	this.color = color;
	this.border = border;
	this.x = x;
	this.y = y;
	this.action = action;
}

c_button.prototype.draw = function() {
	this.color.draw(this.x, this.y);
	this.border.draw(this.x, this.y);
};

c_button.prototype.click = function() {
	if (this.color.click(this.x, this.y)) {
		if (this.action !== null) this.action(this);
		return true;
	} else return false;
};

export default c_button;
