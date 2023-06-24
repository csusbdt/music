function c_tone(f, b = 0, v = 1) {
	this.f       = f   ;
	this.b       = b   ;
	this.v       = v   ;
	this.o_left  = null;
	this.o_right = null;
	this.g       = null;
}

c_tone.prototype.is_playing = function() { return this.g !== null; }

c_tone.prototype.start = function() {
	if (this.g === null) {
    	this.g = audio.createGain();
    	this.g.connect(gain);
    	this.g.gain.value = 0;
    	const merger = new ChannelMergerNode(audio);
    	merger.connect(this.g);
    	this.o_left  = audio.createOscillator();
    	this.o_right = audio.createOscillator();
    	this.o_left.connect(merger, 0, 0);
    	this.o_right.connect(merger, 0, 1);
    	this.o_left.frequency.value = this.f; 
    	this.o_right.frequency.value = this.f + this.b;
    	this.o_left.start();
    	this.o_right.start();
    	this.g.gain.setTargetAtTime(this.v, audio.currentTime, .05);
    }
	return this;
};

c_tone.prototype.stop = function() {
	if (this.g !== null) {
    	this.g.gain.setTargetAtTime(0, audio.currentTime, .05);
    	let g        = this.g;
    	this.g       = null;
		this.o_left  = null;
		this.o_right = null;
    	setTimeout(_ => g.disconnect(), 1000);
    }
};

c_tone.prototype.set_f = function(f) {
	this.f = f;
	if (this.g !== null) {
		this.o_left.frequency.setTargetAtTime(this.f, audio.currentTime, .05);
		this.o_right.frequency.setTargetAtTime(this.f + this.b, audio.currentTime, .05);
	}
	return this;
};

c_tone.prototype.set_b = function(b) {
	this.b = b;
	if (this.g !== null) {
		this.o_right.frequency.setTargetAtTime(this.f + this.b, audio.currentTime, .05);
	}
	return this;
};

c_tone.prototype.set_v = function(v) { 
	this.v = v;
	if (this.g !== null) {
		this.g.gain.setTargetAtTime(v, audio.currentTime, .05);
	}
	return this;
};

export default c_tone;
