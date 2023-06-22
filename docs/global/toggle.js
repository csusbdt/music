function c_toggle(color_0, color_1, border = null, action_0 = null, action_1 = null) {
	this.color_0  = color_0;
	this.color_1  = color_1;
	this.border   = border;
	this.action_0 = action_0;
	this.action_1 = action_1;
	this.color    = color_0;
}

c_toggle.prototype.reset = function() {
	if (this.color === this.color_1) {
		this.color = this.color_0;
		if (this.action_1 !== null) this.action_1(this);
	}
};

c_toggle.prototype.draw = function() {
	this.color.draw();
	if (this.border !== null) this.border.draw();
};

c_toggle.prototype.click = function() {
	if (this.color.click()) {
		if (this.color === this.color_0) {
			this.color = this.color_1;
			if (this.action_0 !== null) this.action_0(this);
		}
		else if (this.color === this.color_1) {
			this.color = this.color_0;
			if (this.action_1 !== null) this.action_1(this);
		}
		return true;
	} else return false;
};

export default c_toggle;
