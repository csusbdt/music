function c_button(color, border = null, x = 0, y = 0, action = null) {
	this.color = color;
	this.border = border;
	this.x = x;
	this.y = y;
	this.action = action;
}

c_button.prototype.draw = function(x = 0, y = 0) {
	this.color.draw(this.x + x, this.y + y);
	if (this.border !== null) this.border.draw(this.x + x, this.y + y);
};

c_button.prototype.click = function(x = 0, y = 0) {
	if (this.color.click(this.x + x, this.y + y)) {
		if (this.action !== null) this.action(this);
		return true;
	} else return false;
};

c_button.prototype.clone = function(x = 0, y = 0, action = null) {
	return new c_button(this.color, this.border, x, y, action);
};

export default c_button;
