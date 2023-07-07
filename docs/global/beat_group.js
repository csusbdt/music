function c_beat_group(dur, members = []) {
	this.dur     = dur;
	this.members = Array.from(members);
	this.joiners = [];
	this.on      = false;
	this.id      = null;
}

c_beat_group.prototype.add = function(m) {
	if (this.members.indexOf(m) === -1 && this.joiners.indexOf(m) === -1) {
		this.joiners.push(m);
	}
};

c_beat_group.prototype.remove = function(m) {
	let i = this.members.indexOf(m);
	if (i !== -1) {
		m.set_off();
		this.members.splice(i, 1);
	}
	i = this.joiners.indexOf(m);
	if (i !== -1) this.joiners.splice(i, 1);
};

c_beat_group.prototype.next = function() {
	while (this.joiners.length > 0) {
		const m = this.joiners.pop();
		m.set_on();
		this.members.push(m);
	}
	this.id = setTimeout(c_beat_group.prototype.next.bind(this), this.dur);
};

c_beat_group.prototype.start = function() {
	if (this.id === null) {
		while (this.joiners.length > 0) {
			this.members.push(this.joiners.pop());
		}
		this.members.forEach(m => m.set_on());
		this.id = setTimeout(c_beat_group.prototype.next.bind(this), this.dur);
	}
};

c_beat_group.prototype.stop = function() {
	if (this.id !== null) {
		clearTimeout(this.id);
		this.id = null;
		this.members.forEach(m => m.set_off());
		while (this.joiners.length > 0) {
			this.members.push(this.joiners.pop());
		}
	}
};

c_beat_group.prototype.restart = function() {
	this.stop();
	this.start();
};

c_beat_group.prototype.set_on = function() {
	this.on = true;
	this.start();
};

c_beat_group.prototype.set_off = function() {
	this.on = false;
	this.stop();
};

export default c_beat_group;
