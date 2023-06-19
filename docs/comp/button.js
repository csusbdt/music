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
