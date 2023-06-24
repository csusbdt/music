import start_composer         from "../index.js"              ;
import c_tone                 from "../../../global/tone.js"  ;
import c_toggle               from "../../../global/toggle.js";
import { draw_back_button   } from "../../../global/index.js" ;
import { click_back_button  } from "../../../global/index.js" ;
import { draw_audio_toggle  } from "../../../global/index.js" ;
import { click_audio_toggle } from "../../../global/index.js" ;
import { gigantic_green     } from "../../../global/index.js" ;
import { gigantic_red       } from "../../../global/index.js" ;
import { gigantic_border    } from "../../../global/index.js" ;

function c_unit(tone, toggle) {
	this.tone = tone;
	this.toggle = toggle;
}

c_unit.prototype.start = function() {
	if (this.toggle.color === this.toggle.color_1) this.tone.start();
	return this;
};

c_unit.prototype.stop = function() { 
	if (this.toggle.color === this.toggle.color_1) this.tone.stop();
	return this;
};

c_unit.prototype.draw = function() { this.toggle.draw(); };

c_unit.prototype.click = function() {
	if (this.toggle.click()) {
		if (this.toggle.color === this.toggle.color_0) {
			this.tone.stop();
		} else {
			if (window.stop_audio === stop_audio) this.tone.start();	
		}
		return true;
	} return false;
};

const is_silent = _ => !unit.tone.is_playing();
const would_be_silent = _ => unit.toggle.color === unit.toggle.color_0;

const unit = new c_unit(
	new c_tone(120, 3), 
	new c_toggle(gigantic_green, gigantic_red, gigantic_border)
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
		exit(start_composer);
	} 
	else if (unit.click()) {
		restore_previous_audio = false;
		on_resize();
	}
};

const draw_page = _ => {
	bg_blue.draw();
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
	set_item('page', "./composer/template/index.js");
	on_resize = draw_page;
	on_click = click_page;
	on_resize();
};
