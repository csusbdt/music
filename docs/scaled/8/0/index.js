import start_scaled_8         from "../index.js"              ;
import c_tone                 from "../../../global/tone.js"  ;
import { draw_back_button   } from "../../../global/index.js" ;
import { click_back_button  } from "../../../global/index.js" ;
import { draw_audio_toggle  } from "../../../global/index.js" ;
import { click_audio_toggle } from "../../../global/index.js" ;

import { button } from "../../../global/index.js" ;

const green  = button("small_green");
const red    = button("small_red");

function c_unit(tones, d, x, y) {
	if (!Array.isArray(tones)) tones = [tones];
	this.tones = tones;
	this.d = d;
	this.x = x;
	this.y = y;
}

c_unit.prototype.start = function() {
	this.tones.forEach(o => o.start());
};

c_unit.prototype.stop = function() {
	this.tones.forEach(o => o.stop());
};

c_unit.prototype.draw  = function() {
	if (units.indexOf(this) === unit_i) red.draw(this.x - red.color.cx, this.y - red.color.cy);
	else green.draw(this.x - red.color.cx, this.y - red.color.cy);
};

c_unit.prototype.click = function() { return red.click(this.x - red.color.cx, this.y - red.color.cy); }

const units = [];
let unit_i  = null;
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
	window.stop_audio = stop_audio;
};

const stop_audio = _ => {
	units[unit_i].stop();
	unit_i = null;
	clearTimeout(unit_id);
	window.start_audio = start_audio;
	window.stop_audio = null;
};

let saved_audio_start = null;

const ot = 6;
const f  = 100;
const b  = 0;
const d  = 2000;
let x    = 100;
const dx = 100;

const tone = half_steps => new c_tone(ot, scale(ot, f, half_steps), b);
const phi  = new c_tone(PHI, b);

units.push(new c_unit([ new c_tone(scale(8, f,  0), 3), phi ],   d, x +=  0, 400));
units.push(new c_unit([ new c_tone(scale(8, f,  2), 3), phi ],   d, x += dx, 400));
units.push(new c_unit([ new c_tone(scale(8, f, 14), 3) ], d/4, x += dx, 400));
units.push(new c_unit([ new c_tone(scale(8, f, 11), 3), new c_tone(1, 0) ], d/4, x += dx, 400));
units.push(new c_unit([ new c_tone(scale(8, f, 12), 3), new c_tone(1, 0) ], d/4, x += dx, 400));
units.push(new c_unit([ new c_tone(scale(8, f,  9), 3) ], d/4, x += dx, 400));

const click = _ => {
	if (click_back_button()) {
		if (saved_audio_start !== null) saved_audio_start();
		start_scaled_8();
		return;
	}
	else if (click_audio_toggle()) {
		saved_audio_start = null;
		on_resize();
	}
};

const draw = _ => {
	bg_blue.draw();
	draw_back_button();
	draw_audio_toggle();
	units.forEach(o => o.draw());
};

const start = _ => {
	if (window.stop_audio !== stop_audio) {
		if (window.stop_audio !== null) window.stop_audio();
		saved_audio_start = window.start_audio;
		window.start_audio = start_audio;
	}
	set_item('page', "./scaled/8/0/index.js");
    on_click  = click;
    on_resize = draw;
    on_resize();
};

export default start;
