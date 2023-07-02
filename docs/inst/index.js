import c_img   from "../global/img.js"    ;
import c_tone  from "../global/tone.js"   ;
import xbutton from "../global/xbutton.js";

const back_button   = xbutton("upper_left_blue");
const audio_blue    = xbutton("upper_right_blue");
const audio_yellow  = xbutton("upper_right_yellow");
const record_blue   = xbutton("upper_right_blue"  , 0, 120);
const record_yellow = xbutton("upper_right_yellow", 0, 120);

const silence   = 0;
const playback  = 1;
const recording = 2;
let   state     = silence; 

const blues = [];
const yellows = [];

for (let i = 0; i < 6; ++i) {
	blues.push(xbutton("upper_right_blue", -810 + i * 150, 500));
	blues.push(xbutton("small_blue"   , 20 + i * 150, 260));
	yellows.push(xbutton("upper_right_yellow", -810 + i * 150, 500));
	yellows.push(xbutton("small_yellow"   , 20 + i * 150, 260));
}

const freq      = i => scale(6, 80, i);

let t           = null; // time in seconds
let note        = 0   ; // index into blues and yellows and argument to freq()
let id          = null; // timeout id
const durs      = [];   // captured durations
const notes     = [];   // captured note index
let dur_i       = null; // index into durs and notes, for playback

const tone      = new c_tone(freq(note), 3, 1);  // playing tone
const waver     = new c_tone(3, 0, 1); 

const draw_record = _ => {
	if (state === recording) record_yellow.draw();
	else record_blue.draw();
};

const draw_notes = _ => {
	for (let i = 0; i < blues.length; ++i) {
		if (state !== silence && i === note) yellows[i].draw();
		else blues[i].draw();
	}
};

const draw_audio = _ => {
	if (state === playback) audio_yellow.draw();
	else audio_blue.draw();
};

const click_notes = _ => {
	for (let i = 0; i < blues.length; ++i) {
		if (click(blues[i])) {
			if (state === recording) capture();
			note = i;
			tone.set_f(freq(note));
			if (state === silence) {
				start_recording();
			} else if (state === playback) {
				stop_playback();
				start_recording();
			}
			return true;
		}
	} 
	return false;
};

const next = _ => {
	if (++dur_i === durs.length) dur_i = 0;
	note = notes[dur_i];
 	tone.set_f(freq(notes[dur_i]));
	id = setTimeout(next, durs[dur_i]);
	on_resize();
};

const start_playback = _ => {
	dur_i = 0;
	note = notes[dur_i];
 	tone.set_f(freq(note));
	tone.start();
	waver.start();
	id = setTimeout(next, durs[dur_i]);
	state = playback;
};

const stop_playback = _ => {
	tone.stop();
	clearTimeout(id);
	id = null;
	state = silence;
};

const capture = _ => {
	const prev_t = t;
	t = new Date().getTime();
	const dt = t - prev_t;
	durs.push(dt);
	notes.push(note);
};

const start_recording = _ => {
	durs.length = 0;
	notes.length = 0;
	t = new Date().getTime();
	tone.start();
	waver.start();
	state = recording;
};

const stop_recording = _ => {
	capture();
	tone.stop();
	waver.stop();
	state = silence;
};

const click_record = _ => {
	if (click(record_blue)) {
		if (state === recording) {
			stop_recording();
		} else if (state === playback) {
			stop_playback();
			start_recording();
		} else {
			start_recording();
		}
		return true;
	} else return false;
};

const click_audio  = _ => {
	if (click(audio_blue)) {
		if (state === silence) {
			start_playback();
		} else if (state === playback) {
			stop_playback();
		} else {
			stop_recording();
			start_playback();
		}
		return true;
	} else return false;
};

let start_external_audio = null;

const click_page = _ => {
	if (click(back_button)) {
		if (state === silence) {
			if (start_external_audio !== null) start_external_audio();
		} else if (state === recording) {
			stop_recording();
			state = silence;
		} else {
			window.start_audio = null;
			window.stop_audio = stop_audio;
		}
		run("../home/index.js");
	}
	else if (click_audio() || click_record() || click_notes()) on_resize(); 
	start_external_audio = null;
};

const draw_page = _ => {
	draw(bg_green);
	draw_notes();
	draw_audio();
	draw_record();
	draw(back_button);
};

const start_audio = _ => {
	start_playback();
	window.start_audio = null;
	window.stop_audio = stop_audio;
};

const stop_audio = _ => {
	stop_playback();
	window.start_audio = start_audio;
	window.stop_audio = null;
};

export default _ => {
	if (window.stop_audio !== null && window.stop_audio !== stop_audio) {
		window.stop_audio();
		start_external_audio = window.start_audio;
	} else {
		start_external_audio = null;
	}
	if (window.stop_audio === stop_audio) {
		state = playback;
	} else {
		state = silence;
	}
	set_item('page', "./inst/index.js");
	on_resize = draw_page;
	on_click = click_page;
	on_resize();
};