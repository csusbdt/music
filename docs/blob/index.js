import c_img   from "../global/img.js"    ;
import c_tone  from "../global/tone.js"   ;
import xbutton from "../global/xbutton.js";
import volume  from "../global/volume.js" ;

const back_button   = xbutton("upper_left_blue");
const audio_blue    = xbutton("upper_right_blue");
const audio_yellow  = xbutton("upper_right_yellow");

const img = n => new c_img("./blob/images/" + n + ".png");

// waver

const a_blue   = img("b_blue");
const a_yellow = a_blue.clone_yellow();
const a_border = img("b_border");
const a_tone   = new c_tone(3, 0, 1);
let   a        = 0;
const draw_a   = _ => { 
	if (a === 0) draw(a_blue);
	else draw(a_yellow);
	draw(a_border);
};
const click_a  = _ => {
	if (a_blue.click()) {
		if (++a === 2) { 
			a = 0; 
			a_tone.stop(); 
		} else if (window.stop_audio !== null) {
			a_tone.start();
		}
		return true;
	}
	return false;
};
const start_a = _ => a === 1 && a_tone.start();
const stop_a  = _ => a_tone.stop();

// binaural

const b_blue   = img("c_blue");
const b_yellow = b_blue.clone_yellow();
const b_border = img("c_border");
let   b        = 0;
const draw_b   = _ => { 
	if (b === 0) draw(b_blue);
	else draw(b_yellow);
	draw(b_border);
};
const click_b  = _ => {
	if (b_blue.click()) {
		if (++b === 2) { 
			b = 0; 
			p_tone.set_b(0); 
			f_tone.set_b(0); 
			e_tone.set_b(0); 
			g_tone.set_b(0); 
			h_tone.set_b(0); 
		} else {
			p_tone.set_b(3); 
			f_tone.set_b(3);
			e_tone.set_b(3);
			g_tone.set_b(3);
			h_tone.set_b(3);
		}
		return true;
	}
	return false;
};
const start_b = _ => {};
const stop_b  = _ => {};

// 1/2 

const d_blue   = img("h_blue");
const d_yellow = d_blue.clone_yellow();
const d_border = img("h_border");
const d_tone   = new c_tone(1/2, 0, 1);
let   d        = 0;
const draw_d   = _ => { 
	if (d === 0) draw(d_blue);
	else draw(d_yellow);
	draw(d_border);
};
const click_d  = _ => {
	if (d_blue.click()) {
		if (window.stop_audio === null) start_audio();
		if (++d === 2) { d = 0; d_tone.stop(); }
		else d_tone.start();
		return true;
	}
	return false;
};
const start_d = _ => d === 1 && d_tone.start();
const stop_d  = _ => d_tone.stop();

// base sequence

const p_blue   = img("a_blue");
const p_yellow = p_blue.clone_yellow();
const p_border = img("a_border");
const p_dur    = 1000;
const p_f      = 90;
const p_tone   = new c_tone(p_f * PHI, 0, 1);
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
		if (++p === 2) {
			p = 0;
			stop_p();
		} else if (window.stop_audio === null) {
			start_audio();
		} else {
			if (f === 1) { stop_f(); start_f(); }
			if (e === 1) { stop_e(); start_e(); }
			if (g === 1) { stop_g(); start_g(); }
			if (h === 1) { stop_h(); start_h(); }
			start_p();
		}
		return true;
	}
	return false;
};
const next_p = _ => {
	if (++p_i === 5) {
		p_i = 0;
		p_tone.set_f(p_f * (PHI + 0));
	} else if (p_i === 1) {
		p_tone.set_f(p_f * (PHI + 7) / 8);
	} else if (p_i === 2) {
		p_tone.set_f(p_f * (PHI + 7) / 8);
	} else if (p_i === 3) {
		p_tone.set_f(p_f * (PHI + 1) / 2);
	} else if (p_i === 4) {
		p_tone.set_f(p_f * (PHI + 3) / 4);
	}
	p_id = setTimeout(next_p, p_dur);
};
const start_p = _ => {
	p_i = 4;
	p_tone.start();
	next_p();
};
const stop_p = _ => {
	if (p_id !== null) {
		clearTimeout(p_id);
		p_i = 0;
		p_id = null;
		p_tone.stop();
	}
};

// overlay 1

const f_blue   = img("f_blue");
const f_yellow = f_blue.clone_yellow();
const f_border = img("f_border");
const f_tone   = new c_tone(0, 0, .7); 
const f_dur    = p_dur * 3;
const f_f      = p_f * Math.pow(2 * (1 - PHI), 3); 
let   f        = 0;
let   f_i      = null;
let   f_id     = null;
const draw_f   = _ => { 
	if (f === 0) draw(f_blue);
	else draw(f_yellow);
	draw(f_border);
};
const click_f  = _ => {
	if (f_blue.click()) {
		if (++f === 2) { 
			f = 0; 
			stop_f(); 
		} else if (window.stop_audio === null) {
			start_audio();
		} else {
			if (p === 1) { stop_p(); start_p(); }
			if (e === 1) { stop_e(); start_e(); }
			if (g === 1) { stop_g(); start_g(); }
			if (h === 1) { stop_h(); start_h(); }
			start_f();
		}
		return true;
	}
	return false;
};
const next_f = _ => {
	if (++f_i === 5) {
		f_i = 0;
		f_tone.set_f(f_f * (PHI + 0));
	} else if (f_i === 1) {
		f_tone.set_f(f_f * (PHI + 7) / 8);
	} else if (f_i === 2) {
		f_tone.set_f(f_f * (PHI + 7) / 8);
	} else if (f_i === 3) {
		f_tone.set_f(f_f * (PHI + 1) / 2);
	} else if (f_i === 4) {
		f_tone.set_f(f_f * (PHI + 3) / 4);
	}
	f_id = setTimeout(next_f, f_dur);
};
const start_f = _ => {
	f_i = 4;
	f_tone.start();
	next_f();
};
const stop_f = _ => {
	if (f_id !== null) {
		clearTimeout(f_id);
		f_id = null;
		f_tone.stop();
	}
};

// overlay 2

const e_blue   = img("e_blue");
const e_yellow = e_blue.clone_yellow();
const e_border = img("e_border");
const e_tone   = new c_tone(0, 0, .7); 
const e_f      = p_f * Math.pow(2 * (1 - PHI), 2);
const e_dur    = p_dur * 9;
let   e        = 0;
let   e_i      = null;
let   e_id     = null;
const draw_e   = _ => { 
	if (e === 0) draw(e_blue);
	else draw(e_yellow);
	draw(e_border);
};
const click_e  = _ => {
	if (e_blue.click()) {
		if (++e === 2) { 
			e = 0; 
			stop_e(); 
		} else if (window.stop_audio === null) {
			start_audio();
		} else {
			if (p === 1) { stop_p(); start_p(); }
			if (f === 1) { stop_f(); start_f(); }
			if (g === 1) { stop_g(); start_g(); }
			if (h === 1) { stop_h(); start_h(); }
			start_e();
		}
		return true;
	}
	return false;
};
const next_e = _ => {
	if (++e_i === 5) {
		e_i = 0;
		e_tone.set_f(e_f * (PHI + 0));
	} else if (e_i === 1) {
		e_tone.set_f(e_f * (PHI + 7) / 8);
	} else if (e_i === 2) {
		e_tone.set_f(e_f * (PHI + 7) / 8);
	} else if (e_i === 3) {
		e_tone.set_f(e_f * (PHI + 1) / 2);
	} else if (e_i === 4) {
		e_tone.set_f(e_f * (PHI + 3) / 4);
	}
	e_id = setTimeout(next_e, e_dur);
};
const start_e = _ => {
	e_i = 4;
	e_tone.start();
	next_e();
};
const stop_e = _ => {
	if (e_id !== null) {
		clearTimeout(e_id);
		e_id = null;
		e_tone.stop();
	}
};

// overlay 3

const g_blue   = img("g_blue");
const g_yellow = g_blue.clone_yellow();
const g_border = img("g_border");
const g_tone   = new c_tone(0, 0, .5); 
const g_f      = p_f * Math.pow(2 * (1 - PHI), 3);
const g_dur    = p_dur * 5;
let   g        = 0;
let   g_i      = null;
let   g_id     = null;
const draw_g   = _ => { 
	if (g === 0) draw(g_blue);
	else draw(g_yellow);
	draw(g_border);
};
const click_g  = _ => {
	if (g_blue.click()) {
		if (++g === 2) { 
			g = 0; 
			stop_g(); 
		} else if (window.stop_audio === null) {
			start_audio();
		} else {
			if (p === 1) { stop_p(); start_p(); }
			if (f === 1) { stop_f(); start_f(); }
			if (e === 1) { stop_e(); start_e(); }
			if (h === 1) { stop_h(); start_h(); }
			start_g();
		}
		return true;
	}
	return false;
};
const next_g = _ => {
	if (++g_i === 5) {
		g_i = 0;
		g_tone.set_f(g_f * (PHI + 0));
	} else if (g_i === 1) {
		g_tone.set_f(g_f * (PHI + 7) / 8);
	} else if (g_i === 2) {
		e_tone.set_f(g_f * (PHI + 7) / 8);
	} else if (g_i === 3) {
		g_tone.set_f(g_f * (PHI + 1) / 2);
	} else if (g_i === 4) {
		g_tone.set_f(g_f * (PHI + 3) / 4);
	}
	g_id = setTimeout(next_g, g_dur);
};
const start_g = _ => {
	g_i = 4;
	g_tone.start();
	next_g();
};
const stop_g = _ => {
	if (g_id !== null) {
		clearTimeout(g_id);
		g_id = null;
		g_tone.stop();
	}
};

// overlay 4

const h_blue   = img("d_blue");
const h_yellow = h_blue.clone_yellow();
const h_border = img("d_border");
const h_tone   = new c_tone(0, 0, .5); 
const h_f      = p_f * Math.pow(2 * (1 - PHI), 3);
const h_dur    = p_dur * 3;
let   h        = 0;
let   h_i      = null;
let   h_id     = null;
const draw_h   = _ => { 
	if (h === 0) draw(h_blue);
	else draw(h_yellow);
	draw(h_border);
};
const click_h  = _ => {
	if (h_blue.click()) {
		if (++h === 2) { 
			h = 0; 
			stop_h(); 
		} else if (window.stop_audio === null) {
			start_audio();
		} else {
			if (p === 1) { stop_p(); start_p(); }
			if (f === 1) { stop_f(); start_f(); }
			if (e === 1) { stop_e(); start_e(); }
			if (g === 1) { stop_g(); start_g(); }
			start_h();
		}
		return true;
	}
	return false;
};
const next_h = _ => {
	if (++h_i === 5) {
		h_i = 0;
		h_tone.set_f(h_f * (PHI + 0));
	} else if (g_i === 1) {
		h_tone.set_f(h_f * (PHI + 7) / 8);
	} else if (h_i === 2) {
		h_tone.set_f(h_f * (PHI + 7) / 8);
	} else if (h_i === 3) {
		h_tone.set_f(h_f * (PHI + 1) / 2);
	} else if (h_i === 4) {
		h_tone.set_f(h_f * (PHI + 3) / 4);
	}
	h_id = setTimeout(next_h, h_dur);
};
const start_h = _ => {
	h_i = 4;
	h_tone.start();
	next_h();
};
const stop_h = _ => {
	if (h_id !== null) {
		clearTimeout(h_id);
		h_id = null;
		h_tone.stop();
	}
};

const start_audio = _ => {
	assert(window.stop_audio === null);
	if (a === 1) start_a();
	if (b === 1) start_b();
	if (p === 1) start_p();
	if (d === 1) start_d();
	if (e === 1) start_e();
	if (f === 1) start_f();
	if (g === 1) start_g();
	if (h === 1) start_h();
	window.start_audio = null;
	window.stop_audio  = stop_audio;
};

const stop_audio = _ => {
	stop_a();
	stop_b();
	stop_p();
	stop_d();
	stop_e();
	stop_f();
	stop_g();
	stop_h();
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
		click_audio() || click_a() || click_b() || click_p() || click_d() ||
		click_f()     || click_e() || click_g() || click_h() || volume.click()
	) on_resize(); 
	start_external_audio = null;
};

const draw_page = _ => {
	draw(bg_green);
	draw_audio();
	draw(back_button);
	volume.draw_blue();
	draw_a();
	draw_b();
	draw_p();
	draw_d();
	draw_e();
	draw_f();
	draw_g();
	draw_h();
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
