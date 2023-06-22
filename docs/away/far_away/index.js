import start_away from "../index.js"           ;
import c_img      from "../../global/img.js"   ;
import c_button   from "../../global/button.js";
import c_toggle   from "../../global/toggle.js";

let img = n => new c_img("./global/images/" + n + ".png");
const upper_left_green  = img("upper_left_green"  , 100, 70, 50);
const upper_left_border = img("upper_left_border" , 100, 70, 50);
const audio_red         = img("upper_right_red"   , 900, 60, 50);
const audio_green       = img("upper_right_green" , 900, 60, 50);
const audio_border      = img("upper_right_border", 900, 60, 50);

const back_button  = new c_button(upper_left_green ,upper_left_border);
const audio_toggle = new c_toggle(audio_green, audio_red, audio_border);

function c_tone(f, b = 0) {
	this.f = f   ;
	this.b = b   ;
	this.g = null;
}

c_tone.prototype.start = function() {
	assert(this.g === null);
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
	this.g.gain.setTargetAtTime(1, audio.currentTime, .1);
	return this;
};

c_tone.prototype.stop = function() {
	assert(this.g !== null);
	this.g.gain.setTargetAtTime(0, audio.currentTime, .05);
	let g = this.g;
	this.g = null;
	setTimeout(_ => g.disconnect(), 1000);
};

const tone = (f, b = 0) => new c_tone(f, b);

const tones = [
	tone(PHI             , 1),
	tone(scale(6, 100, 0), 3),
	tone(scale(6, 100, 1), 3),
	tone(scale(6, 100, 2), 3),
	tone(scale(6, 100, 3), 3),
	tone(scale(6, 100, 4), 3),
	tone(scale(6, 100, 5), 3)
];

img = n => new c_img("./away/far_away/images/" + n + ".png");
const click = img => click_test(img.image);

const borders = [
	img("border_0"),
	img("border_1"),
	img("border_2"),
	img("border_3"),
	img("border_4"),
	img("border_5"),
	img("border_6")
];

const colors = [
	[ img("white_0"), img("green_0") ],
	[ img("white_1"), img("green_1") ],
	[ img("white_2"), img("green_2") ],
	[ img("white_3"), img("green_3") ],
	[ img("white_4"), img("green_4") ],
	[ img("white_5"), img("green_5") ],
	[ img("white_6"), img("green_6") ]
];

const state = Array(borders.length).fill(0);

const is_playing = _ => state.some(i => i === 1);

const start_audio = _ => {
	for (let i = 0; i < state.length; ++i) {
		if (state[i] === 1) {
//			state[i] = 0;
			tones[i].start();
		}
	}	
	audio_toggle.color = audio_toggle.color_1;
	window.start_audio = null;
	window.stop_audio = stop_audio;
};

const stop_audio = _ => {
	for (let i = 0; i < state.length; ++i) {
		if (state[i] === 1) {
//			state[i] = 0;
			tones[i].stop();
		}
	}	
	audio_toggle.color = audio_toggle.color_0;
	window.stop_audio = null;
	window.start_audio = start_audio;
};

const click_page = _ => {
	if (audio_toggle.click()) {
		if (audio_toggle.color === audio_toggle.color_0) {
			if (window.stop_audio !== null) {
				window.stop_audio();
				window.stop_audio = null;
			} else {
				songs[song_i].stop();
				song_toggles[song_i].color = song_toggles[song_i].color_0;
			}
		} else {
			if (window.start_audio !== null) {
				window.start_audio();
				window.start_audio = null;
			} else {
				songs[song_i].start();
				song_toggles[song_i].color = song_toggles[song_i].color_1;
			}			
		}
		on_resize(); 
	}
	else if (back_button.click()) {
		on_click = null;
		if (is_playing()) {
			window.stop_page_audio = stop_page_audio;
		} 
		start_away();
	} 
	else if (silence_button.click()) { 
		return on_resize();
	} 
	else for (let i = 0; i < state.length; ++i) {
		if (click(colors[i][0])) {
			if (!is_playing()) {
				if (window.stop_page_audio !== null) {
					window.stop_page_audio();
				}
			}
			if (state[i] === 0) {
				state[i] = 1;
				tones[i].start();
			} else {
				state[i] = 0;
				tones[i].stop();
			}
			on_resize();
			return;
		}
	}
};

const draw_page = _ => {
	bg_blue.draw();
	for (let i = 0; i < state.length; ++i) {
		colors[i][state[i]].draw();
		borders[i].draw();
	}
	back_button.draw();
	audio_toggle.draw();
};

export default _ => {
	if (is_playing()) {
		assert(window.stop_page_audio === stop_page_audio);
		window.stop_page_audio = null;
	}

	if (songs[song_i].is_playing()) {
		assert(window.stop_audio === stop_audio);
		audio_toggle.color = audio_toggle.color_1;
		song_toggles[song_i].color = song_toggles[song_i].color_1;
	} else if (window.stop_audio !== null) {
		assert(window.start_audio === null);
		audio_toggle.color = audio_toggle.color_1;
		song_toggles[song_i].color = song_toggles[song_i].color_0;
	} else if (window.start_audio !== null) {
		audio_toggle.color = audio_toggle.color_0;
		song_toggles[song_i].color = song_toggles[song_i].color_0;		
	} else {
		// no audio has yet been played
		audio_toggle.color = audio_toggle.color_0;
		song_toggles[song_i].color = song_toggles[song_i].color_0;				
	}
	
	set_item('page', "./away/far_away/index.js");
	on_resize = draw_page;
	on_click = click_page;
	on_resize();
};
