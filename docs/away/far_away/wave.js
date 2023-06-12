let audio_started = false;

const start_audio = _ => {
	if (gain !== null) gain.disconnect();
    gain = audio.createGain();
	gain.connect(main_gain);
	audio_started = true;
};

const stop_audio = _ => { 
	gain.disconnect(); 
	gain = null; 
};

function c_wave(f, w) {
	this.f = f;
	this.g = null;
}

c_wave.prototype.start = function() {
	if (this.g === null) {
		if (!audio_started) start_audio();
		this.g = audio.createGain();
		this.g.connect(main_gain);
		this.g.gain.value = 0;
		this.o = audio.createOscillator();
		this.o.frequency.value = this.f;
		this.o.start();
		this.o.connect(this.g);		
	}
	this.g.gain.setTargetAtTime(1, audio.currentTime, .1);
};

c_wave.prototype.stop = function() {
	this.g.gain.setTargetAtTime(0, audio.currentTime, .1);
};

const wave = (f) => {
	return new c_wave(f);
};

export { wave };


/*

let o_left      = null;
let o_right     = null;
let beat_freq   = 3;
let ramp_up     = 0;
let ramp_down   = 0;
let loop_id     = null;

const setup_graph = _ => {
	if (gain !== null) gain.disconnect();
    gain = audio.createGain();
	gain.gain.value = 0;
	gain.connect(main_gain);
	const merger = new ChannelMergerNode(audio);
	merger.connect(gain);
	o_left  = audio.createOscillator();
	o_right = audio.createOscillator();
	o_left.connect(merger, 0, 0);
	o_right.connect(merger, 0, 1);
	o_left.frequency.value = 0; 
	o_right.frequency.value = 0;
	o_left.start();
	o_right.start();    
};

const teardown_graph = _ => {
        gain.disconnect();
        gain        = null;
        o_left      = null;
        o_right     = null;
};

const play_notes = (notes, ramp_up = 0, ramp_down = 0) => {
	ramp_up = ramp_up;
	ramp_down = ramp_down;
    let duration = 0;
	notes.forEach(note => {
		duration += note[2];
	});

	let t = 0;
	for (let i = 0; i < notes.length; ++i) {
		const note = notes[i] ;
		const f    = note[0]  ;
		const v    = note[1]  ;
		const d    = note[2]  ; // duration in seconds
		o_left .frequency.setValueAtTime(f            , audio.currentTime + t);
		o_right.frequency.setValueAtTime(f + beat_freq, audio.currentTime + t);
        if (ramp_up > 0 || ramp_down > 0) {
    		gain.gain.setTargetAtTime(v, audio.currentTime + t + ramp_up, .1);
    		gain.gain.setTargetAtTime(0, audio.currentTime + t + d - ramp_down, .1);
        } else {
    		gain.gain.setTargetAtTime(v, audio.currentTime + t, .1);
        }
		t += d;
	}
	return t;
};

const cancel_notes = () => {
    o_left.frequency.cancelScheduledValues(audio.currentTime);
	o_right.frequency.cancelScheduledValues(audio.currentTime);
	gain.gain.cancelScheduledValues(audio.currentTime);
};

function c_song(notes) {
    this.notes = notes;
}

c_song.prototype.start = function(ramp_up = 0, ramp_down = 0) {
    if (loop_id !== null) {
        clearInterval(loop_id);
        cancel_notes();
    } else {
        setup_graph();
    }
	let duration = play_notes(this.notes, ramp_up, ramp_down);
	loop_id = setInterval(play_notes.bind(null, this.notes), duration * 1000 + 10);
};

c_song.prototype.stop = function() {
    clearInterval(loop_id);
    loop_id = null;
    teardown_graph();
};

c_song.prototype.start_func = function() {
	return this.start.bind(this);
};

c_song.prototype.stop_func = function() {
	return this.stop.bind(this);
};

const song = (notes) => { return new c_song(notes); }

export default song;
*/
