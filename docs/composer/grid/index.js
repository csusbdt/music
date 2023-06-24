import start_composer         from "../index.js"      ;
import c_img                  from "../../../global/img.js"   ;
import c_tone                 from "../../../global/tone.js"  ;
import { draw_back_button   } from "../../../global/index.js" ;
import { click_back_button  } from "../../../global/index.js" ;
import { draw_audio_toggle  } from "../../../global/index.js" ;
import { click_audio_toggle } from "../../../global/index.js" ;
import { button             } from "../../../global/index.js" ;

const min_f  = 60;
const max_f  = 900;

const tone = new c_tone(108, 3, .5); // init better!!!!!!!!!!!!!
//let silent = null;

const grid = {
	x: 200, y: 160, w: 600, h: 600,
	but: button("small_yellow", 200 + 600 / 2 - 120, 160 + 600 / 2 - 200),
	draw: function() {
		ctx.fillStyle = rgb_white;
		ctx.fillRect(this.x, this.y, this.w, this.h);
		this.but.draw();
	},
	click: function() {
		if (click_x >= this.x - 40 && click_x <= this.x + this.w + 40 && 
			click_y >= this.y - 40 && click_y <= this.y + this.h + 40
		) {
			let x = click_x;
			let y = click_y;
			if (x < this.x) x = this.x;
			if (x > this.x + this.w) x = this.x + this.w;
			if (y < this.y) y = this.y;
			if (y > this.y + this.h) y = this.y + this.h;
			this.but.x = x - this.but.color.cx;
			this.but.y = y - this.but.color.cy;
			const f_percent = Math.pow((y - this.y) / this.h, 2);
			const v_percent = (x - this.x) / this.w;			
			tone.set_f(min_f + (max_f - min_f) * f_percent);
			tone.set_v(v_percent);
			return true;
		} else return false;
	}
};

const is_silent = _ => !tone.is_playing();
const would_be_silent = _ => false;

const stop_audio = _ => {
	assert((window.start_audio === null) !== (window.stop_audio === null));
	window.start_audio = start_audio;
	window.stop_audio = null;
	tone.stop();
	//silent = true;
};

const start_audio = _ => {
	assert((window.start_audio === null) !== (window.stop_audio === null));
	window.start_audio = null;
	window.stop_audio = stop_audio;
	tone.start();
	//silent = false;
};

const click_page = _ => {
	if (click_audio_toggle()) {
		restore_previous_audio = false;
		on_resize(); 
	}
	else if (click_back_button()) {
		exit(start_composer);
	} 
	else if (grid.click()) {
		restore_previous_audio = false;
		on_resize();
	}
};

const draw_page = _ => {
	bg_blue.draw();
	grid.draw();
	draw_back_button();
	draw_audio_toggle();
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
