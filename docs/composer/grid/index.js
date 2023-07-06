import start_composer from "../index.js"            ;
import c_img          from "../../global/img.js"    ;
import c_tone         from "../../global/tone.js"   ;
import xbutton        from "../../global/xbutton.js";
import volume         from "../../global/volume.js" ;

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
	return min_f + (max_f - min_f) * Math.pow((y - grid_top)/grid_h, 3);
};

const f2y = f => {
	return grid_top + Math.pow( (f - min_f)/(max_f - min_f), 1 / 3) * grid_h;
};

const x2v = x => (x - grid_left) / grid_w;
const v2x = v => grid_left + v * grid_w;

const silence   = 0;
const playback  = 1;
const recording = 2;
let   state     = silence; 

const tones     = [];
const durs      = [];
const tone      = new c_tone(200, 3, .7); 
let id          = null;
let i           = null;
let t           = null;
const grid_dot  = xbutton("small_yellow", v2x(tone.v), f2y(tone.f));

const draw_record = _ => {
	if (state === recording) record_yellow.draw();
	else record_blue.draw();
};

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
		if (state === recording) push_tone();
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
	grid_dot.x = v2x(tone.v);
	grid_dot.y = f2y(tone.f);
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
	else if (click_audio() || click_record() || click_grid() || volume.click()) on_resize(); 
	start_external_audio = null;
};

const draw_page = _ => {
	draw(bg_green);
	draw_grid();
	draw_audio();
	draw_record();
	volume.draw_blue();
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
