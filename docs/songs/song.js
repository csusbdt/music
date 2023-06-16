///////////////////////////////////////////////////////////////////////////////
//
// song
//
///////////////////////////////////////////////////////////////////////////////

function c_song(notes, ramp_up = 0, ramp_down = 0, binaural = 0) {
    this.notes     = notes    ;
	this.ramp_up   = ramp_up  ;
	this.ramp_down = ramp_down;
	this.binaural  = binaural ;
	this.g         = null     ;
	this.merger    = null     ;
	this.o_left    = null     ;
	this.o_right   = null     ;
	this.loop_id   = null     ;
	this.duration  = 0        ;
	notes.forEach(note => {
		this.duration += note[2];
	});
}

c_song.prototype.play_notes = function() {
	let t = 0;
	for (let i = 0; i < this.notes.length; ++i) {
		const note = this.notes[i] ;
		const f    = note[0]  ;
		const v    = note[1]  ;
		const d    = note[2]  ; // duration in seconds
		this.o_left .frequency.setValueAtTime(f                , audio.currentTime + t);
		this.o_right.frequency.setValueAtTime(f + this.binaural, audio.currentTime + t);
        if (this.ramp_up > 0 || this.ramp_down > 0) {
    		this.g.gain.setTargetAtTime(v, audio.currentTime + t +     this.ramp_up  , .1);
    		this.g.gain.setTargetAtTime(0, audio.currentTime + t + d - this.ramp_down, .1);
        } else {
    		this.g.gain.setTargetAtTime(v, audio.currentTime + t, .1);
        }
		t += d;
	}
};

c_song.prototype.start = function() {
	assert(this.loop_id === null);
	assert(gain !== null);
	this.g = audio.createGain();
	this.g.gain.value = 0;
	this.g.gain.setTargetAtTime(1, audio.currentTime, .05);
	this.g.connect(gain);
	this.merger = new ChannelMergerNode(audio);
	this.merger.connect(this.g);
	this.o_left  = audio.createOscillator();
	this.o_right = audio.createOscillator();
	this.o_left.connect(this.merger, 0, 0);
	this.o_right.connect(this.merger, 0, 1);
	this.o_left.frequency.value = 0; 
	this.o_right.frequency.value = 0;
	this.o_left.start();
	this.o_right.start();
	this.loop_id = setInterval(this.play_notes.bind(this), this.duration * 1000 + 10);
	this.play_notes();
};

c_song.prototype.stop = function() {
	assert(this.loop_id !== null);
	this.o_left.frequency.cancelScheduledValues(audio.currentTime);
	this.o_right.frequency.cancelScheduledValues(audio.currentTime);
	this.g.gain.cancelScheduledValues(audio.currentTime);	
	clearInterval(this.loop_id);
	this.g.gain.setTargetAtTime(0, audio.currentTime, .05);
	let g = this.g;
	setTimeout(_ => g.disconnect(), 1000);
	this.loop_id = null;
	this.g       = null;
	this.merger  = null;
	this.o_left  = null;
	this.o_right = null;
};

const song = (notes, ramp_up = 0, ramp_down = 0, binaural = 0) => {
	return new c_song(notes, ramp_up, ramp_down, binaural);
};

export default song;
