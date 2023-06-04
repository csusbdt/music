let gain      = null;
let o_left    = null;
let o_right   = null;
let beat_freq = 3;
let ramp_up   = 0;
let ramp_down = 0;
let loop_id   = null;

const setup_graph = _ => {
    assert(gain === null);
    gain = audio.createGain();
	gain.gain.value = 0;
	gain.connect(audio.destination);
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
    // not sure if these are needed if no delay used to change gain to 0
    o_left.frequency.cancelScheduledValues(audio.currentTime);
	o_right.frequency.cancelScheduledValues(audio.currentTime);
	gain.gain.cancelScheduledValues(audio.currentTime);
	gain.gain.setTargetAtTime(0, audio.currentTime, .01);
//	gain.gain.setTargetAtTime(0, audio.currentTime + .02, .1); // ramp-down if delay used

// delay could result in race condition
// avoid for now, listen for artifacts
//
//    setTimeout(_ => {
        gain.disconnect();
        gain    = null;
        o_left  = null;
        o_right = null;
//    }, 26);
};

const play_notes = (notes) => {
    setup_graph();
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
		gain.gain.setTargetAtTime(v, audio.currentTime + t + ramp_up, .1);
		gain.gain.setTargetAtTime(0, audio.currentTime + t + d - ramp_down, .1);
		t += d;
	}
	return t;
};

const stop_play = () => {
    teardown_graph();
};

function c_song(notes) {
    this.notes = notes;
}

c_song.prototype.start = function() {
    if (loop_id !== null) this.stop();
	let duration = play_notes(this.notes);
	loop_id = setInterval(play_notes.bind(null, this.notes), duration * 1000);
};

c_song.prototype.stop = function() {
    clearInterval(loop_id);
    loop_id = null;
    stop_play();
};

const song = (notes) => { return new c_song(notes); }

export default song;
