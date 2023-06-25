import start_composer         from "../home/index.js"      ;
import c_tone                 from "../global/tone.js"  ;
import { draw_back_button   } from "../global/index.js" ;
import { click_back_button  } from "../global/index.js" ;
import { button             } from "../global/index.js" ;
import { audio_toggle       } from "../global/index.js" ;

function c_unit(tone, d, x, y) {
	this.tone   = tone;
	this.d      = d;
	this.green  = button("small_green" , x, y);
	this.red    = button("small_red"   , x, y);
	this.yellow = button("small_yellow", x, y);
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

const red_but    = button("small_red"   );
const yellow_but = button("small_yellow");

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

const audio = audio_toggle(start_audio, stop_audio);

const exit = next_page => {
	if (is_playing()) {
		window.start_audio = null;
		window.stop_audio  = stop_audio;
	}
	next_page(units[unit_i].tone);
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

const click_page = _ => {
	if (click_back_button()) return exit(start_composer);
	else if (audio.click() || grid.click()) on_resize();
	else if (units.some(o => o.click())) on_resize();
};

const draw_page = _ => {
	bg_blue.draw();
	draw_back_button();
	units.forEach(o => o.draw());
	grid.draw();
	audio.draw();
};

export default _ => {
	assert((window.start_audio === null) !== (window.stop_audio === null));
	if (window.stop_audio === null) {
		audio.color = audio.color_0;
		edit_i = null;
		unit_i = 0;
	} else if (window.stop_audio !== stop_audio) {
		window.stop_audio();
		audio.color = audio.color_0;
		edit_i = null;
		unit_i = 0;
	} else {
		audio.color = audio.color_1;
	}
	set_item('page', "./inst/index.js");
	on_resize = draw_page;
	on_click = click_page;
	on_resize();
};

/*

import start_home                            from "../index.js"       ;
import { start_freq as binaural_start_freq } from "../../binaural.js" ;
import { stop       as binaural_stop       } from "../../binaural.js" ;
import { start_loop as binaural_start_loop } from "../../binaural.js" ;
import { reset_play_buttons                } from "../songs/index.js" ;
import { set_play_capture_button           } from "../songs/index.js" ;

const i_ship_left   = image("/space_shooter/images/ship_left.png"  );
const i_ship_middle = image("/space_shooter/images/ship_middle.png");
const i_ship_right  = image("/space_shooter/images/ship_right.png" );

const ship = [ 
	[ i_ship_left  ,  -78, -46 ], 
	[ i_ship_middle, -187, -45 ],
	[ i_ship_right , -306, -39 ]
];

const back   = O(image("/home/capture/back.png"), rect(  0,   0, 150, 150)          );
const cancel = O(image("/space_shooter/images/blue_dot.png"  ), rect(250, -15, 400, 135), 600, 865);

let update_id               = null ;
let ship_i                  = 0    ;
let x                       = 250  ;
let y                       = 350  ;
let dest_x                  = x    ;
let dest_y                  = y    ;
const speed                 = 180  ;
let notes                   = null ;
let current_note_start_time = null ;

const freq = y => {
	return 40 + y * y / 1400;
};

const vol = x => {
	return x / 1000;
};

const exit = start_func => {
	x = dest_x;
	y = dest_y;
	canvas.removeEventListener('click', click);
	clearInterval(update_id);
	start_func();
};

const click = e => {
	const p = design_coords(e);
	if (back.click(p)) {
		const t = audio.currentTime - current_note_start_time;
		notes[notes.length - 1][2] = t;
		set_item("home_capture", { x: x, y: y, notes: notes });
		play_capture_notes();
		exit(start_home);
	} else if (cancel.click(p)) {
		binaural_stop();
		exit(start_home);
	} else {
		const t = audio.currentTime - current_note_start_time;
		current_note_start_time = audio.currentTime;
		notes[notes.length - 1][2] = t;		
		dest_x  = p.x;
		dest_y  = p.y;
		const f = freq(dest_y);
		const v = vol (dest_y);
		notes.push([f, v, null]);
		binaural_start_freq(f, 3, v);
	}
};

const update = _ => {
	if (++ship_i === 3) ship_i = 0;
	let dx   = dest_x - x;
	let dy   = dest_y - y;
	let dist = Math.sqrt(dx * dx + dy * dy);
	if (dist < speed) dist = speed;
	dx = dx / dist * speed;
	dy = dy / dist * speed;
	x += dx;
	y += dy;
	
	bg_blue();
	if (ship_i !== null) {
		const i        = ship[ship_i][0];
		const offset_x = ship[ship_i][1];
		const offset_y = ship[ship_i][2];
		ctx.drawImage(i, x + offset_x, y + offset_y);
	}
	back.draw();
	cancel.draw();
};

const play_capture_notes = _ => {
	let o = get_item("home_capture", { x: x, y: y, notes: [[freq(y), vol(x), 1]] });
	binaural_start_loop(o.notes, 3);
	reset_play_buttons();
	set_play_capture_button();
};

const start = _ => {
	let o  = get_item("home_capture", { x: x, y: y, notes: [[freq(y), vol(x), 1]] });
	x      = o.x;
	y      = o.y;
	dest_x = o.x;
	dest_y = o.y;
	notes  = o.notes;
	reset_play_buttons();
	binaural_start_freq(freq(y), 3, vol(x));
	notes = [];
	notes.push([freq(y), vol(x), null]);
	current_note_start_time = audio.currentTime;
	canvas.addEventListener('click', click);
	update();
	update_id = setInterval(update, 100);
};

export { start, play_capture_notes };


*/
