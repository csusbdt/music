import start_composer         from "../index.js"           ;
import start_edit_tone        from "./edit_tone/index.js"  ;
import c_tone                 from "../../global/tone.js"  ;
import { draw_back_button   } from "../../global/index.js" ;
import { click_back_button  } from "../../global/index.js" ;
import { button             } from "../../global/index.js" ;
import { audio_toggle       } from "../../global/index.js" ;

function c_unit(tone, d, x, y) {
	this.tone       = tone;
	this.d          = d;
	this.off_button = button("small_green", x, y);
	this.on_button  = button("small_red"  , x, y);
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
	if (this.on_button.click())	return true;
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

const audio = audio_toggle(start_audio, stop_audio);

const exit = next_page => {
	if (is_playing()) {
		window.start_audio = null;
		window.stop_audio  = stop_audio;
	}
	next_page();
};

units.push(new c_unit(new c_tone(100      , 3, .5), 1000, 300, 300));
units.push(new c_unit(new c_tone(100 * PHI, 3, .5), 1000, 400, 300));

const click_page = _ => {
	if (click_back_button()) return exit(start_composer);
	else if (audio.click()) on_resize();
	else if (units.some(o => o.click())) {
		log("unit clicked");
		on_resize();
	}
};

const draw_page = _ => {
	bg_blue.draw();
	draw_back_button();
	units.forEach(o => o.draw());
	audio.draw();
};

export default _ => {
	assert((window.start_audio === null) !== (window.stop_audio === null));
	if (window.stop_audio !== stop_audio && window.stop_audio !== null) {
		window.stop_audio();
	}
	set_item('page', "./composer/template/index.js");
	on_resize = draw_page;
	on_click = click_page;
	on_resize();
};
