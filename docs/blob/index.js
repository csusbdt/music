import c_img   from "../../global/img.js"    ;
import c_tone  from "../../global/tone.js"   ;
import xbutton from "../../global/xbutton.js";

const back_button   = xbutton("upper_left_blue");
const audio_blue    = xbutton("upper_right_blue");
const audio_yellow  = xbutton("upper_right_yellow");

const img = n => new c_img("./blob/images/" + n + ".png");

// a

const a_blue   = img("a_blue");
const a_yellow = a_blue.clone_yellow();
const a_border = img("a_border");
const a_tone   = new c_tone(75, 0, 1);
let   a        = 0;
const draw_a   = _ => { 
	if (a === 0) draw(a_blue);
	else draw(a_yellow);
	draw(a_border);
};
const click_a  = _ => {
	if (a_blue.click()) {
		if (window.stop_audio === null) start_audio();
		if (++a === 2) { a = 0; a_tone.stop(); }
		else a_tone.start();
		return true;
	}
	return false;
};
const start_a = _ => a === 1 && a_tone.start();
const stop_a  = _ => a_tone.stop();

// b

const b_blue   = img("b_blue");
const b_yellow = b_blue.clone_yellow();
const b_border = img("b_border");
const b_tone   = new c_tone(3, 0, 1);
let   b        = 0;
const draw_b   = _ => { 
	if (b === 0) draw(b_blue);
	else draw(b_yellow);
	draw(b_border);
};
const click_b  = _ => {
	if (b_blue.click()) {
		if (window.stop_audio === null) start_audio();
		if (++b === 2) { b = 0; b_tone.stop(); }
		else b_tone.start();
		return true;
	}
	return false;
};
const start_b = _ => b === 1 && b_tone.start();
const stop_b  = _ => b_tone.stop();

const p_blue   = img("c_blue");
const p_yellow = p_blue.clone_yellow();
const p_border = img("c_border");
const p_tone   = new c_tone(90 * PHI, 3, 1);
let   p        = 0;
let   p_i      = null;
let   p_id     = null;
const draw_p   = _ => { 
	if (p === 0) draw(p_blue);
	else draw(p_yellow);
	draw(p_border);
};
const click_p  = _ => {
	if (p_blue.click()) {
		if (window.stop_audio === null) start_audio();
		if (++p === 2) {
			p = 0;
			stop_p();
		} else {
			start_p();
		}
		return true;
	}
	return false;
};
const next_p = _ => {
	if (++p_i === 5) {
		p_i = 0;
		p_tone.set_f(90 * PHI);
	} else if (p_i === 1) {
		p_tone.set_f(90 * (PHI + 7) / 8);
	} else if (p_i === 2) {
		p_tone.set_f(90 * (PHI + 7) / 8);
	} else if (p_i === 3) {
		p_tone.set_f(90 * (PHI + 1) / 2);
	} else if (p_i === 4) {
		p_tone.set_f(90 * (PHI + 3) / 4);
	}
	p_id = setTimeout(next_p, 1000);
};
const start_p = _ => {
	p_i = 0;
	p_tone.set_f(90 * PHI);
	p_tone.start();
	p_id = setTimeout(next_p, 1000);
};
const stop_p = _ => {
	if (p_id !== null) {
		clearTimeout(p_id);
		p_i = 0;
		p_id = null;
		p_tone.stop();
	}
};

const start_audio = _ => {
	assert(window.stop_audio === null);
	if (a === 1) start_a();
	if (b === 1) start_b();
	if (p === 1) start_p();
	window.start_audio = null;
	window.stop_audio  = stop_audio;
};

const stop_audio = _ => {
	stop_a();
	stop_b();
	stop_p();
	window.start_audio = start_audio;
	window.stop_audio  = null;
};

const draw_audio = _ => {
	if (window.stop_audio === null) audio_blue.draw();
	else audio_yellow.draw();
};

const click_audio  = _ => {
	if (click(audio_blue)) {
		if (window.stop_audio !== null) window.stop_audio();
		else start_audio();
		return true;
	} else return false;
};

let start_external_audio = null;

const click_page = _ => {
	if (click(back_button)) {
		if (window.stop_audio === null) {
			if (start_external_audio !== null) start_external_audio();
		}
		run("./home/index.js");
	}
	else if (
		click_audio() || click_a() || click_b() || click_p() 
	) on_resize(); 
	start_external_audio = null;
};

const draw_page = _ => {
	draw(bg_green);
	draw_audio();
	draw(back_button);
	draw_a();
	draw_b();
	draw_p();
};

export default _ => {
	if (window.stop_audio !== null && window.stop_audio !== stop_audio) {
		window.stop_audio();
		start_external_audio = window.start_audio;
	} else {
		start_external_audio = null;
	}
	set_item('page', "./blob/index.js");
	on_resize = draw_page;
	on_click = click_page;
	on_resize();
};
