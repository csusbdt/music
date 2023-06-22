import start_home             from "../../home/index.js"      ;
import c_tone                 from "../../../global/tone.js"  ;
import c_img                  from "../../../global/img.js"   ;
import c_button               from "../../../global/button.js";
import c_toggle               from "../../../global/toggle.js";
import { back_button        } from "../../../global/index.js" ;
import { draw_audio_toggle  } from "../../../global/index.js" ;
import { click_audio_toggle } from "../../../global/index.js" ;

import { upper_left_green  } from "../../../global/index.js" ;
import { upper_left_border } from "../../../global/index.js" ;

const img = n => new c_img("./away/far_away/images/" + n + ".png");

function c_unit(f, b, green, white, border) {
	this.tone = new c_tone(f, b);
	this.toggle = new c_toggle(
		img(green), img(white), img(border),
		_ => {
			this.tone.start();
		}, 
		_ => {
			this.tone.stop();
		} 
	);
}

c_unit.prototype.is_playing  = function() { return this.tone.is_playing(); }

// -120, -205

// c_unit.prototype.start = function() {
// 	this.tone.start();
// };

// c_unit.prototype.stop = function() {
// 	this.toggle.color = this.toggle.color_0;
// 	this.tones.forEach(o => o.stop());
// };

//c_unit.prototype.draw  = function() { this.toggle.draw(-120, -205); }
c_unit.prototype.draw  = function() { this.toggle.draw(-120, -205); }

c_unit.prototype.click = function() { return this.toggle.click(); }

const units = [];

units.push(new c_unit(PHI             , 1, "white_0", "green_0", "border_0"));
units.push(new c_unit(scale(6, 100, 0), 3, "white_1", "green_1", "border_1"));
units.push(new c_unit(scale(6, 100, 1), 3, "white_2", "green_2", "border_2"));
units.push(new c_unit(scale(6, 100, 2), 3, "white_3", "green_3", "border_3"));
units.push(new c_unit(scale(6, 100, 3), 3, "white_4", "green_4", "border_4"));
units.push(new c_unit(scale(6, 100, 4), 3, "white_5", "green_5", "border_5"));
units.push(new c_unit(scale(6, 100, 5), 3, "white_6", "green_6", "border_6"));

//const state = Array(units.length).fill(0);
//const is_playing = _ => state.some(i => i === 1);
const is_playing = _ => units.some(o => o.is_playing());

// const start_audio = _ => {
// 	if (window.stop_audio !== null) window.stop_audio();
// 	window.start_audio = null;
// 	window.stop_audio = stop_audio;
	
// 	for (let i = 0; i < state.length; ++i) {
// 		if (state[i] === 1) {
// 			tones[i].start();
// 		}
// 	}
// };

// const stop_audio = _ => {
// 	for (let i = 0; i < state.length; ++i) {
// 		if (state[i] === 1) {
// 			tones[i].stop();
// 		}
// 	}
// 	window.start_audio = start_audio;
// 	window.stop_audio = null;
// };

const click_page = _ => {
	if (click_audio_toggle()) {
		on_resize(); 
	}
	else if (back_button.click()) {
		start_home();
	} 
	else if (units.some(o => o.click())) on_resize();
	
	// else for (let i = 0; i < state.length; ++i) {
	// 	if (colors[i][0].click()) {
	// 		if (!is_playing()) {
	// 			if (window.stop_audio !== null) window.stop_audio();
	// 			state[i] = 1;
	// 			start_audio();
	// 		} else if (state[i] === 0) {
	// 			state[i] = 1;
	// 			tones[i].start();				
	// 		} else {
	// 			state[i] = 0;
	// 			tones[i].stop();
	// 			if (!is_playing()) stop_audio();
	// 		}
	// 		on_resize();
	// 	 	return;
	// 	}
	// }
};

const draw_page = _ => {
	bg_blue.draw();
	units.forEach(o => o.draw());
	back_button.draw();
	draw_audio_toggle();
};

export default _ => {
//	if (window.start_audio !== null) window.start_audio = start_audio;	
	set_item('page', "./away/far_away/index.js");
	on_resize = draw_page;
	on_click = click_page;
	on_resize();
};



/*

import start_home             from "../../home/index.js"      ;
import c_tone                 from "../../../global/tone.js"  ;
import c_img                  from "../../../global/img.js"   ;
import c_button               from "../../../global/button.js";
import c_toggle               from "../../../global/toggle.js";
import { back_button        } from "../../../global/index.js" ;
import { draw_audio_toggle  } from "../../../global/index.js" ;
import { click_audio_toggle } from "../../../global/index.js" ;

import { upper_left_green  } from "../../../global/index.js" ;
import { upper_left_border } from "../../../global/index.js" ;

const tones = [
	new c_tone(PHI             , 1),
	new c_tone(scale(6, 100, 0), 3),
	new c_tone(scale(6, 100, 1), 3),
	new c_tone(scale(6, 100, 2), 3),
	new c_tone(scale(6, 100, 3), 3),
	new c_tone(scale(6, 100, 4), 3),
	new c_tone(scale(6, 100, 5), 3)
];

const img = n => new c_img("./away/far_away/images/" + n + ".png");

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
	if (window.stop_audio !== null) window.stop_audio();
	window.start_audio = null;
	window.stop_audio = stop_audio;
	for (let i = 0; i < state.length; ++i) {
		if (state[i] === 1) {
			tones[i].start();
		}
	}
};

const stop_audio = _ => {
	for (let i = 0; i < state.length; ++i) {
		if (state[i] === 1) {
			tones[i].stop();
		}
	}
	window.start_audio = start_audio;
	window.stop_audio = null;
};

const click_page = _ => {
	if (click_audio_toggle()) {
		on_resize(); 
	}
	else if (back_button.click()) {
		start_home();
	} 
	else for (let i = 0; i < state.length; ++i) {
		if (colors[i][0].click()) {
			if (!is_playing()) {
				if (window.stop_audio !== null) window.stop_audio();
				state[i] = 1;
				start_audio();
			} else if (state[i] === 0) {
				state[i] = 1;
				tones[i].start();				
			} else {
				state[i] = 0;
				tones[i].stop();
				if (!is_playing()) stop_audio();
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
	draw_audio_toggle();
};

export default _ => {
	if (window.start_audio !== null) window.start_audio = start_audio;	
	set_item('page', "./away/far_away/index.js");
	on_resize = draw_page;
	on_click = click_page;
	on_resize();
};

*/
