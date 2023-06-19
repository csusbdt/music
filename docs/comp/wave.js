function c_wave(f = 111, v = 1, b = 2, w = 0) {
	this.f = f;
	this.v = v;
	this.b = b;
	this.w = w;
	this.g       = null;
	this.o_left  = null;
	this.o_right = null;
	this.o_w     = null;
}

c_wave.prototype.frequency = function(f) {
	this.f = f;
	if (this.g !== null) {
    	this.o_left.frequency.setTargetAtTime(this.f, audio.currentTime, .05);
    	this.o_right.frequency.setTargetAtTime(this.f + this.b, audio.currentTime, .05);
    }
    return this;
};

c_wave.prototype.volume = function(v) {
	this.v = v;
	if (this.g !== null) {
    	this.g.gain.setTargetAtTime(this.v, audio.currentTime, .05);
    }
    return this;
};

c_wave.prototype.binaural = function(b) {
	this.b = b;
	if (this.g !== null) {
    	this.o_right.frequency.setTargetAtTime(this.f + this.b, audio.currentTime, .05);
    }
    return this;
};

c_wave.prototype.waver = function(w) {
	this.w = w;
	if (this.g !== null) {
    	this.o_w.frequency.setTargetAtTime(this.w, audio.currentTime, .05);
    }
    return this;
};

c_wave.prototype.start = function() {
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
    	this.o_w = audio.createOscillator();
    	this.o_w.frequency.value = 0;
    	this.o_w.connect(this.g);
    	this.o_w.start();
    	this.g.gain.setTargetAtTime(this.v, audio.currentTime, .05);        
    }
	return this;
};

c_wave.prototype.stop = function() {
	if (this.g !== null) {
    	this.g.gain.setTargetAtTime(0, audio.currentTime, .05);
    	let g = this.g;
    	this.g = null;
    	setTimeout(_ => g.disconnect(), 1000);
    }
	return this;
};

export default c_wave;
