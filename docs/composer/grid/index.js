import start_composer from "../index.js"            ;
import c_img          from "../../global/img.js"    ;
import c_tone         from "../../global/tone.js"   ;
import xbutton        from "../../global/xbutton.js";

const back_button   = xbutton("upper_left_blue");
const audio_blue    = xbutton("upper_right_blue");
const audio_yellow  = xbutton("upper_right_yellow");
const record_blue   = xbutton("upper_right_blue"  , 0, 150);
const record_yellow = xbutton("upper_right_yellow", 0, 150);

const min_f     = 60;
const max_f     = 900;
const grid_left = 200;
const grid_top  = 160;
const grid_w    = 600;
const grid_h    = 600;

const y2f = y => {
	return min_f + (y - grid_top) / grid_h * (max_f - min_f);
};
const f2y = f => {
	return grid_top + (f - min_f) / (max_f - min_f) * grid_h;
};
const x2v = x => (x - grid_left) / grid_w;
const v2x = v => grid_left + v * grid_w;

const grid_dot      = xbutton("small_yellow", v2x(.5), f2y(80));

const silence   = 0;
const playback  = 1;
const recording = 2;
let   state     = silence; 

const tones = [];
const durs  = [];
const tone  = new c_tone(100, 3, 1); 
let id      = null;
let i       = null;
let t       = null;

const draw_record = _ => {
	if (state === recording) record_yellow.draw();
	else record_blue.draw();
};

// const y2f = y => min_f + (max_f - min_f) * Math.pow((y - grid_top) / grid_h, 2);
// const x2v = x => (x - grid_left) / grid_w;
// const f2y = f => grid_top + 1 / grid_h * Math.log2((f - min_f) / (max_f - min_f));
// const v2x = v => grid_left + grid_w * v;
	
const draw_grid = _ => {
	ctx.fillStyle = rgb_white;
	ctx.fillRect(grid_left, grid_top, grid_w, grid_h);
	grid_dot.draw(-grid_dot.color.cx, -grid_dot.color.cy);
};

const draw_audio = _ => {
	if (state === playback) audio_yellow.draw();
	else audio_blue.draw();
};

const click_grid = _ => {
	if (click_x >= grid_left - 40           && 
		click_x <= grid_left + grid_w + 40  && 
		click_y >= grid_top  - 40           && 
		click_y <= grid_top  + grid_h + 40
	) {
		let x = clamp(click_x, grid_left, grid_left + grid_w);
		let y = clamp(click_y, grid_top , grid_top  + grid_h);
		grid_dot.x = x;
		grid_dot.y = y;
		tone.set_f(y2f(y));
		tone.set_v(x2v(x));
		if (state === silence) {
			start_recording();
		} else if (state === playback) {
			stop_playback();
			start_recording();
		} else {
			push_tone();
		}
		return true;
	} else return false;
};

const next = _ => {
	if (++i === tones.length) i = 0;
 	tone.set_f(tones[i].f);
 	tone.set_v(tones[i].v);
	grid_dot.x = v2x(tones[i].v);
	grid_dot.y = f2y(tones[i].f);
	id = setTimeout(next, durs[i]);
	on_resize();
};

const start_playback = _ => {
	i = 0;
 	tone.set_f(tones[i].f);
 	tone.set_v(tones[i].v);
	grid_dot.x = v2x(tones[i].v);
	grid_dot.y = f2y(tones[i].f);
	tone.start();
	id = setTimeout(next, durs[i]);
	state = playback;
};

const stop_playback = _ => {
	tone.stop();
	clearTimeout(id);
	id = null;
	state = silence;
};

const push_tone = _ => {
	const prev_t = t;
	t = new Date().getTime();
	const dt = t - prev_t;
	durs.push(dt);
	tones.push(tone.clone());
};

const start_recording = _ => {
	tones.length = 0;
	durs.length = 0;
	t = new Date().getTime();
	tone.start();
	state = recording;
};

const stop_recording = _ => {
	push_tone();
	tone.stop();
	state = silence;
};

const click_record = _ => {
	if (click(record_blue)) {
		if (state === recording) {
			stop_recording();
		} else if (state === playback) {
			stop_playback();
			start_recording();
		} else {
			start_recording();
		}
		return true;
	} else return false;
};

const click_audio  = _ => {
	if (click(audio_blue)) {
		if (state === silence) {
			start_playback();
		} else if (state === playback) {
			stop_playback();
		} else {
			stop_recording();
			start_playback();
		}
		return true;
	} else return false;
};

let start_external_audio = null;

const click_page = _ => {
	if (click(back_button)) {
		if (state === silence) {
			if (start_external_audio !== null) start_external_audio();
		} else if (state === recording) {
			stop_recording();
			state = silence;
		} else {
			window.start_audio = null;
			window.stop_audio = stop_audio;
		}
		start_composer();
	}
	else if (click_audio() || click_record() || click_grid()) on_resize(); 
	start_external_audio = null;
};

const draw_page = _ => {
	draw(bg_green);
	draw_grid();
	draw_audio();
	draw_record();
	draw(back_button);
};

const start_audio = _ => {
	start_playback();
	window.start_audio = null;
	window.stop_audio = stop_audio;
};

const stop_audio = _ => {
	stop_playback();
	window.start_audio = start_audio;
	window.stop_audio = null;
};

export default _ => {
	if (window.stop_audio !== null && window.stop_audio !== stop_audio) {
		window.stop_audio();
		start_external_audio = window.start_audio;
	} else {
		start_external_audio = null;
	}
	if (window.stop_audio === stop_audio) {
		state = playback;
	} else {
		state = silence;
	}
	set_item('page', "./composer/grid/index.js");
	on_resize = draw_page;
	on_click = click_page;
	on_resize();
};



//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

/*
const units = [];
let unit_i = null;

const push_unit = _ => {
	const prev_t = t;
	t = new Date().getTime();
	const dt = t - prev_t;
	units.push([tone.clone(), dt]);
};

const min_f  = 60;
const max_f  = 900;

const tone = new c_tone(108, 3, .5); 

const grid_left = 200;
const grid_top  = 160;
const grid_w    = 600;
const grid_h    = 600;



const click_grid = _ => {
	if (click_x >= grid_left - 40 && click_x <= grid_left + grid_w + 40 && 
		click_y >= grid_top  - 40 && click_y <= grid_top  + grid_h + 40
	) {
		if (record_i === 1) {
			push_unit();
		}
		let x = click_x;
		let y = click_y;
		if (x < grid_left) x = grid_left;
		if (x > grid_left + grid_w) x = grid_left + grid_w;
		if (y < grid_top) y = grid_top;
		if (y > grid_top + grid_h) y = grid_top + grid_h;
		grid_dot.x = x - grid_dot.color.cx;
		grid_dot.y = y - grid_dot.color.cy;
		const f_percent = Math.pow((y - grid_top) / grid_h, 2);
		const v_percent = (x - grid_left) / grid_w;			
		tone.set_f(min_f + (max_f - min_f) * f_percent);
		tone.set_v(v_percent);
		return true;
	} else return false;
};

const start_grid = _ => {
	t = new Date().getTime();
	tone.f = units[units.length - 1][0].f;
	tone.v = units[units.length - 1][0].v;
	tone.b = units[units.length - 1][0].b;
	units.length = 0;
	tone.start();
};

const stop_grid = _ => {
	tone.stop();
	push_unit();
};

let id = null;

const next = _ => {
	unit[unit_i][0].stop();
	if (++unit_i === unit.length) unit_i = 0;
	unit[unit_i][0].start();
	id = setTimeout(next, unit[unit_i][1]);
};

const stop_audio = _ => {
	window.start_audio = start_audio;
	window.stop_audio = null;
	if (record_i === 1) {
		// abandon recording
		assert(id === null);
		assert(unit_i === null);
		tone.stop();
		unit.length = 0;
		unit_i = null;
		record_i = 0;
	} else if (id === null) {
		assert(unit_i === null);
		tone.stop(); 
	} else {
		assert(unit_i !== null);
		assert(!tone.is_playing());
		assert(unit.length > 0);
		clearTimeout(id);
		id = null;
		unit[unit_i][0].stop();
		unit_i = null;
	}
};

const start_audio = _ => {
	window.start_audio = null;
	window.stop_audio = stop_audio;
	

	if (record_i === 0 || tones.length === 0) {
		tone.start();
	} else {
		tone.stop();
		unit_i = 0;
		unit[unit_i][0].start();
		id = setTimeout(next, unit[unit_i][1]);
	}
};
*/

//const grid = {
// 	x: 200, y: 160, w: 600, h: 600,
// 	but: xbutton("small_yellow", 200 + 600 / 2 - 120, 160 + 600 / 2 - 200),
// 	draw: function() {
// 		ctx.fillStyle = rgb_white;
// 		ctx.fillRect(this.x, this.y, this.w, this.h);
// 		this.but.draw();
// 	},
// 	click: function() {
// 		if (click_x >= this.x - 40 && click_x <= this.x + this.w + 40 && 
// 			click_y >= this.y - 40 && click_y <= this.y + this.h + 40
// 		) {
// 			if (record_i === 1) {
// 				push_unit();
// 			}
// 			let x = click_x;
// 			let y = click_y;
// 			if (x < this.x) x = this.x;
// 			if (x > this.x + this.w) x = this.x + this.w;
// 			if (y < this.y) y = this.y;
// 			if (y > this.y + this.h) y = this.y + this.h;
// 			this.but.x = x - this.but.color.cx;
// 			this.but.y = y - this.but.color.cy;
// 			const f_percent = Math.pow((y - this.y) / this.h, 2);
// 			const v_percent = (x - this.x) / this.w;			
// 			tone.set_f(min_f + (max_f - min_f) * f_percent);
// 			tone.set_v(v_percent);
// 			return true;
// 		} else return false;
// 	},
// 	start: function() {
// 		t = new Date().getTime();
// 		tone.f = units[units.length - 1][0].f;
// 		tone.v = units[units.length - 1][0].v;
// 		tone.b = units[units.length - 1][0].b;
// 		units.length = 0;
// 		tone.start();
// 	},
// 	stop: function() {
// 		tone.stop();
// 		push_unit();
// 	}
// };
