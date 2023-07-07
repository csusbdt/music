import start_scaled_6 from "../index.js"               ;
import c_tone         from "../../../global/tone.js"   ;
import xbutton        from "../../../global/xbutton.js";

const back_button = xbutton("upper_left_green" );
const audio_green = xbutton("upper_right_green");
const audio_red   = xbutton("upper_right_red"  );
const green       = xbutton("small_green"      );
const red         = xbutton("small_red"        );

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

const ots = 6;
const f  = 100;
const b  = 0;
const d  = 1000;
let x    = 100;
const dx = 100;

const tone = steps => new c_tone(ots, freq(ot, f, steps), b);
const phi  = new c_tone(PHI, b);

units.push(new c_unit([
	new c_tone(freq(6, 100, 0), 3),
	phi
], d * 3, x +=  0, 400));

units.push(new c_unit([
	new c_tone(freq(6, 100, 2), 3),
	new c_tone(freq(6, 100, 4), 3)
], d, x += dx, 400));

const click_page = _ => {
	if (click(back_button)) {
		if (start_external_audio !== null) start_external_audio();
		start_scaled_6();
		return;
	}
	else if (click(audio_green)) {
		window.stop_audio === null ? start_audio() : window.stop_audio();
		on_resize();
	}
	start_external_audio = null;
};

const draw_page = _ => {
	bg_blue.draw();
	draw(back_button);
	window.stop_audio === null ? draw(audio_green) : draw(audio_red);
	units.forEach(o => o.draw());
};

let start_external_audio = null;

const start = _ => {
	if (window.stop_audio !== null && window.stop_audio !== stop_audio) {
		window.stop_audio();
		start_external_audio = window.start_audio;
		window.start_audio = start_audio;
	} else {
		start_external_audio = null;
	}
	set_item('page', "./scaled/6/1/index.js");
    on_click  = click_page;
    on_resize = draw_page;
    on_resize();
};

export default start;
