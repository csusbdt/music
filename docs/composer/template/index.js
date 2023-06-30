import start_composer         from "../index.js"           ;
import start_edit_tone        from "./edit_tone/index.js"  ;
import c_tone                 from "../../global/tone.js"  ;

// import { draw_back_button   } from "../../global/index.js" ;
// import { click_back_button  } from "../../global/index.js" ;
// import { button             } from "../../global/index.js" ;
// import { audio_toggle       } from "../../global/index.js" ;

import xbutton from "../../global/xbutton.js";

const back_button     = xbutton("upper_left_blue");
const audio_blue      = xbutton("upper_right_blue");
const audio_yellow    = xbutton("upper_right_yellow");

function c_unit(tone, d, x, y) {
	this.tone       = tone;
	this.d          = d;
	this.off_button = xbutton("small_blue", x, y);
	this.on_button  = xbutton("small_yellow"  , x, y);
}

c_unit.prototype.start = function() {
	this.tone.start();
	return this;
};

c_unit.prototype.stop = function() { 
	this.tone.stop();
	return this;
};

c_unit.prototype.draw = function() {
	if (this.tone.is_playing()) this.on_button.draw(); 
	else this.off_button.draw();
};

c_unit.prototype.click = function() {
	if (this.on_button.click())	{
		if (is_playing()) stop_audio();
		start_edit_tone(this.tone);
		return true;
	}
	else return false;
};

const units = [];
let unit_i  = 0;
let unit_id = null;

const is_playing = _ => unit_id !== null;

const next_unit = _ => {
	units[unit_i].stop();
	if (++unit_i === units.length) unit_i = 0;
	units[unit_i].start();
	unit_id = setTimeout(next_unit, units[unit_i].d);
	on_resize();
};

const start_audio = _ => {
	unit_i = 0;
	units[unit_i].start();
	unit_id = setTimeout(next_unit, units[unit_i].d);
	window.start_audio = null;
	window.stop_audio  = stop_audio;
};

const stop_audio = _ => {
	units[unit_i].stop();
	unit_i = 0;
	clearTimeout(unit_id);
	unit_id = null;
	window.start_audio = start_audio;
	window.stop_audio  = null;
};

const exit = next_page => {
	if (is_playing()) {
		window.start_audio = null;
		window.stop_audio  = stop_audio;
	}
	next_page(units[unit_i].tone);
};

units.push(new c_unit(new c_tone(100      , 3, .5), 1000, 300, 300));
units.push(new c_unit(new c_tone(100 * PHI, 3, .5), 1000, 400, 300));

const click_page = _ => {
	if (click(back_button)) return exit(start_composer);
	else if (audio_blue.click()) {
		if (window.stop_audio === null) start_audio();
		else window.stop_audio();
		on_resize();
	}
	else if (units.some(o => o.click())) on_resize();
	start_external_audio = null;
};

const draw_page = _ => {
	draw(bg_green);
	draw(back_button);
	draw(units);
	window.stop_audio === null ? draw(audio_blue) : draw(audio_yellow);
};

let start_external_audio = null;

export default _ => {
	if (window.stop_audio !== null && window.stop_audio !== stop_audio) {
		window.stop_audio();
		start_external_audio = window.start_audio;
		window.start_audio = start_audio;
	} else {
		start_external_audio = null;
	}
	set_item('page', "./composer/template/index.js");
	on_resize = draw_page;
	on_click = click_page;
	on_resize();
};
