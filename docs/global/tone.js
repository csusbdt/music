function c_tone(f, b = 0, v = 1) {
	this.f = f   ;
	this.b = b   ;
	this.v = v   ;
	this.g = null;
}

c_tone.prototype.is_playing = function() { return this.g !== null; }

c_tone.prototype.start = function() {
	if (this.g === null) {
    	this.g = audio.createGain();
    	this.g.connect(gain);
    	this.g.gain.value = 0;
    	const merger = new ChannelMergerNode(audio);
    	merger.connect(this.g);
    	const o_left  = audio.createOscillator();
    	const o_right = audio.createOscillator();
    	o_left.connect(merger, 0, 0);
    	o_right.connect(merger, 0, 1);
    	o_left.frequency.value = this.f; 
    	o_right.frequency.value = this.f + this.b;
    	o_left.start();
    	o_right.start();
    	this.g.gain.setTargetAtTime(this.v, audio.currentTime, .05);
    }
	return this;
};

c_tone.prototype.stop = function() {
	if (this.g !== null) {
    	this.g.gain.setTargetAtTime(0, audio.currentTime, .05);
    	let g = this.g;
    	this.g = null;
    	setTimeout(_ => g.disconnect(), 1000);
    }
};

export default c_tone;
