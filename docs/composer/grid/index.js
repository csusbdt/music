import start_home             from "../../home/index.js"      ;
import c_img                  from "../../../global/img.js"   ;
import c_tone                 from "../../../global/tone.js"  ;
import { draw_back_button   } from "../../../global/index.js" ;
import { click_back_button  } from "../../../global/index.js" ;
import { draw_audio_toggle  } from "../../../global/index.js" ;
import { click_audio_toggle } from "../../../global/index.js" ;
import { button             } from "../../../global/index.js" ;

const left   = 150;
const top    = 200;
const width  = 700;
const height = 700;
const min_f  = 60;
const max_f  = 900;

function c_unit(tone, toggle) {
	this.tone = tone;
	this.but  = button("small_yellow", 100, 100);
}

c_unit.prototype.start = function() {
	this.tone.start();
	return this;
};

c_unit.prototype.stop = function() { 
	this.tone.stop();
	return this;
};

c_unit.prototype.draw = function() { this.but.draw(); };

c_unit.prototype.click = function() {
	if (this.but.click()) { }
	if (click_x >= left - 40 && click_x <= left + width  + 40 && 
		click_y >= top  - 40 && click_y <= top  + height + 40
	) {
		let grid_x = click_x;
		let grid_y = click_y;		
		if (grid_x < left        ) grid_x = left;
		if (grid_x > left + width) grid_x = left + width; 
		if (grid_y < top         ) grid_y = top; 
		if (grid_y > top + height) grid_y = top + height;	
		this.but.x = grid_x - this.but.color.cx;
		this.but.y = grid_y - this.but.color.cy;
		const f_percent = Math.pow((grid_y - top) / height, 2);
		const v_percent = (grid_x - left) / width;
		this.tone.set_f(min_f + (max_f - min_f) * f_percent);
		this.tone.set_v(v_percent);
		return true;
	} else return false;
};

const is_silent = _ => !unit.tone.is_playing();
const would_be_silent = _ => true; //unit.toggle.color === unit.toggle.color_0;

const unit = new c_unit(
	new c_tone(108, 3, .5)
);

const stop_audio = _ => {
	assert((window.start_audio === null) !== (window.stop_audio === null));
	window.start_audio = start_audio;
	window.stop_audio = null;
	unit.stop();
};

const start_audio = _ => {
	assert((window.start_audio === null) !== (window.stop_audio === null));
	window.start_audio = null;
	window.stop_audio = stop_audio;
	unit.start();
};

const click_page = _ => {
	if (click_audio_toggle()) {
		restore_previous_audio = false;
		on_resize(); 
	}
	else if (click_back_button()) {
		exit(start_home);
	} 
	else if (unit.click()) {
		restore_previous_audio = false;
		on_resize();
	}
};

const draw_page = _ => {
	bg_blue.draw();
	ctx.fillStyle = rgb_white;
	ctx.fillRect(left, top, width, height);
	draw_back_button();
	draw_audio_toggle();
	unit.draw();
};

let restore_previous_audio = null;
let previous_was_playing   = null;
let previous_start_audio   = null;
let previous_stop_audio    = null;

const exit = next_page => {
	if (restore_previous_audio) {
		stop_audio();
		window.start_audio = previous_start_audio;
		window.stop_audio  = null;
		if (previous_was_playing) {
			window.start_audio();
		}
	}
	else if (window.stop_audio !== null) {
		// audio is started
		if (is_silent()) {
			window.stop_audio();
			window.start_audio = previous_start_audio;
			window.stop_audio  = null;
		} else {
			assert(window.start_audio === null);
			assert(window.stop_audio === stop_audio);
		}
	} else {
		// audio is stopped
		if (would_be_silent()) {
			window.start_audio = previous_start_audio;
			window.stop_audio  = null;
		} else {
			window.start_audio = start_audio;
			window.stop_audio  = null;
		}
	}
	next_page();
};

export default _ => {
	assert((window.start_audio === null) !== (window.stop_audio === null));
	if (audio === null) {
		previous_was_playing = false;
		previous_stop_audio  = stop_audio;
		previous_start_audio = start_audio;
		window.start_audio = start_audio;
		window.stop_audio = null;
	} else {
		restore_previous_audio = true;	
		if (window.stop_audio === stop_audio) {
			restore_previous_audio = false;
		} 
		else if (window.stop_audio !== null) {
			previous_was_playing = true;
			previous_stop_audio  = window.stop_audio;
			window.stop_audio();
			previous_start_audio = window.start_audio;
			start_audio();
		} else {
			previous_was_playing = false;
			previous_start_audio = window.start_audio;
			previous_stop_audio  = null;
			start_audio();
		}
	}
	set_item('page', "./composer/grid/index.js");
	on_resize = draw_page;
	on_click = click_page;
	on_resize();
};
