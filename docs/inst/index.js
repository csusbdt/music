import start_home  from "../home/index.js"       ;
import c_tone      from "../global/tone.js"      ;
import xbutton     from "../../global/xbutton.js";

const back_button  = xbutton("upper_left_blue");
const audio_blue   = xbutton("upper_right_blue");
const audio_yellow = xbutton("upper_right_yellow");

function c_unit(tone, d, x, y) {
	this.tone   = tone;
	this.d      = d;
	this.green  = xbutton("small_green" , x, y);
	this.red    = xbutton("small_red"   , x, y);
	this.yellow = xbutton("small_yellow", x, y);
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
	if (this === units[unit_i]) this.red.draw();
	else if (this === units[edit_i]) this.yellow.draw();
	else this.green.draw();
};

c_unit.prototype.click = function() {
	if (this.green.click())	{
		const i = units.indexOf(this);
		if (edit_i !== i) {
			edit_i = i;
		} else if (edit_i === i) {
			edit_i = null;
		}
		return true;
	} else return false;
};

const units = [];
let unit_i  = null;
let unit_id = null;
let edit_i  = null;

const min_f  = 60;
const max_f  = 900;
const grid_x = 200;
const grid_y = 300;
const grid_h = 600;
const grid_w = 600;
const grid_c = Math.log2(max_f - min_f) / grid_h;
const y2f    = y => min_f + Math.pow(2, grid_c * y); // y in grid coords
const f2y    = f => Math.log2(f - min_f) / grid_c; // y in grid coords

const red_but    = xbutton("small_blue"   );
const yellow_but = xbutton("small_yellow");

const grid = {
	draw: function () {
		ctx.fillStyle = rgb_white;
		ctx.fillRect(grid_x, grid_y, grid_w, grid_h);
		if (edit_i === null) {
			const but_x = (units[unit_i].tone.v) * grid_w + grid_x - red_but.color.cx;
			const but_y = f2y(units[unit_i].tone.f) + grid_y - red_but.color.cy;	
			red_but.draw(but_x, but_y);
		} else {
			const but_x = (units[edit_i].tone.v) * grid_w + grid_x - red_but.color.cx;
			const but_y = f2y(units[edit_i].tone.f) + grid_y - red_but.color.cy;	
			yellow_but.draw(but_x, but_y);
		}
	},
	click: function() {
		if (edit_i === null) return false;
		if (click_x >= grid_x - 30 && click_x <= grid_x + grid_w + 30 && 
			click_y >= grid_y - 30 && click_y <= grid_y + grid_h + 30
		) {
			let x = click_x;
			let y = click_y;
			if (x < grid_x) x = grid_x;
			if (x > grid_x + grid_w) x = grid_x + grid_w;
			if (y < grid_y) y = grid_y;
			if (y > grid_y + grid_h) y = grid_y + grid_h;
			units[edit_i].tone.set_v((x - grid_x) / grid_w);
			units[edit_i].tone.set_f(y2f(y - grid_y));
			return true;
		} else return false;
	}
};

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
	//unit_i = null;
	clearTimeout(unit_id);
	unit_id = null;
	window.start_audio = start_audio;
	window.stop_audio  = null;
};

const exit = next_page => {
	if (window.stop_audio !== stop_audio) stop_audio();
	if (start_external_audio !== null) start_external_audio();
	next_page();
};

units.push(new c_unit(new c_tone(100 / PHI, 3,  1), 1000,   0, 0));
units.push(new c_unit(new c_tone(100      , 3,  1), 1000, 100, 0));
units.push(new c_unit(new c_tone(100 * PHI, 3,  1), 1000, 200, 0));
units.push(new c_unit(new c_tone(200      , 3,  1), 1000, 300, 0));
units.push(new c_unit(new c_tone(400      , 3, .5),  500, 400, 0));
units.push(new c_unit(new c_tone(400 / PHI, 3, .5),  500, 500, 0));
units.push(new c_unit(new c_tone(200 * PHI, 3, .5),  500, 600, 0));
units.push(new c_unit(new c_tone(400      , 3, .5),  250, 700, 0));
units.push(new c_unit(new c_tone(400 / PHI, 3, .5),  250, 800, 0));

let start_external_audio = null;

const click_page = _ => {
	if (audio_blue.click()) {
		if (window.stop_audio === null) start_audio();
		else window.stop_audio();
		on_resize();
	}
	if (click(back_button)) return exit(start_home);
	else if (grid.click()) on_resize();
	else if (units.some(o => o.click())) on_resize();
	start_external_audio = null;
};

const draw_page = _ => {
	bg_green.draw();
	draw(back_button);
	units.forEach(o => o.draw());
	grid.draw();
	window.stop_audio === null ? draw(audio_blue) : draw(audio_yellow);
};

export default _ => {
	if (window.stop_audio !== null && window.stop_audio !== stop_audio) {
		window.stop_audio();
		start_external_audio = window.start_audio;
		window.start_audio = start_audio;
	} else {
		start_external_audio = null;
	}
	edit_i = null;
	unit_i = 0;
	set_item('page', "./inst/index.js");
	on_resize = draw_page;
	on_click = click_page;
	on_resize();
};
