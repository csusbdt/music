import c_tone from "./tone.js";

function c_tone_seq(dur, fs, b = 0, vs = null) {
    assert(fs.length > 0);
	this.dur  = dur;
	this.fs   = fs;
    this.b    = b;
	this.vs   = vs === null ? Array(fs.length).fill(1) : vs;
	this.i    = fs.length - 1;
	this.id   = null;
	this.on   = false;
	this.tone = new c_tone(0, b, vs === null ? 1 : vs[0]);
}

c_tone_seq.prototype.next = function() {
	if (++this.i === this.fs.length) this.i = 0;
	this.tone.set_fv(this.fs[this.i], this.vs[this.i]);
	this.id = setTimeout(c_tone_seq.prototype.next.bind(this), this.dur);
};

c_tone_seq.prototype.start = function() {
	if (window.stop_audio === null) {
		start_audio();
	} else if (this.on && this.id === null) {
		this.i = this.fs.length - 1;
		this.tone.start();
		this.next();
	}
};

c_tone_seq.prototype.stop = function() {
	if (this.id !== null) {
		clearTimeout(this.id);
		this.id = null;
		this.tone.stop();
	}
};

c_tone_seq.prototype.restart = function() {
	this.stop();
	this.start();
};

c_tone_seq.prototype.set_on = function() {
	this.on = true;
	this.start();
};

c_tone_seq.prototype.set_off = function() {
	this.on = false;
	this.stop();
};

export default c_tone_seq;
