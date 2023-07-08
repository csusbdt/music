import c_img      from "../global/img.js"     ;
import c_tone     from "../global/tone.js"    ;
import c_tone_seq from "../global/tone_seq.js";
import xbutton    from "../global/xbutton.js" ;
import volume     from "../global/volume.js"  ;

const back_button   = xbutton("upper_left_blue"   );
const audio_blue    = xbutton("upper_right_blue"  );
const audio_yellow  = xbutton("upper_right_yellow");

const dur = 1000;
const bf  = 90;


const s_center_f = bf;
const s_center = new c_tone_seq(dur, [ 
	sp1(s_center_f, 0), sp1(s_center_f, 3), sp1(s_center_f, 3), sp1(s_center_f, 1), sp1(s_center_f, 2) 
]);

const s_f_bf = bf * Math.pow(2 * (PHI - 1), 3);
const s_f = new c_tone_seq(dur * 3, [
	sp1(s_f_bf, 0), sp1(s_f_bf, 3), sp1(s_f_bf, 3), sp1(s_f_bf, 1), sp1(s_f_bf, 2) 
]);

const s_e_bf = bf * Math.pow(2 * (1 - PHI), 2);
const s_e = new c_tone_seq(dur * 9, [
	sp1(s_e_bf, 0), sp1(s_e_bf, 3), sp1(s_e_bf, 3), sp1(s_e_bf, 1), sp1(s_e_bf, 2) 
]);

const s_g_bf = bf * Math.pow(2 * (1 - PHI), 5);
const s_g = new c_tone_seq(dur * 6, [
	s_g_bf, s_g_bf * (PHI - 1), s_g_bf * (PHI + 1) / 2, s_g_bf * PHI 
]);

const s_h_bf = bf * Math.pow(2 * (1 - PHI), 3);
const s_h = new c_tone_seq(dur * 12, [
	sp1(s_h_bf, 0), sp1(s_h_bf, 3), sp1(s_h_bf, 3), sp1(s_h_bf, 1), sp1(s_h_bf, 2) 
]);

const s_k_bf = bf;
const s_k = new c_tone_seq(dur * 10, [
	sp2(s_k_bf, 0), sp2(s_k_bf, 3), sp2(s_k_bf, 3), sp2(s_k_bf, 1), sp2(s_k_bf, 2) 
]);

const img = n => new c_img("./blob/images/" + n + ".png");

// beat group toggle TODO

const a_blue   = img("b_blue");
const a_yellow = a_blue.clone_yellow();
const a_border = img("b_border");
const a_tone   = new c_tone(bf, 0, 1);
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

const binaural_blue   = img("c_blue");
const binaural_yellow = binaural_blue.clone_yellow();
const binaural_border = img("c_border");

const binaural = {
	on: false,
	b: bf * Math.pow(PHI, -7),
	draw: function() {
		if (this.on) draw(binaural_yellow); else draw(binaural_blue);
		draw(binaural_border);
	},
	click: function() {
		if (binaural_blue.click()) {
			if (this.on) {
				this.on = false;
				s_center.set_b(0);
				s_f.set_b(0); 
				s_e.set_b(0); 
				s_g.set_b(0); 
				s_h.set_b(0); 
				s_k.set_b(0); 
			} else {
				this.on = true;
				s_center.set_b(this.b);
				s_f.set_b(this.b);
				s_e.set_b(this.b);
				s_g.set_b(this.b);
				s_h.set_b(this.b);
				s_k.set_b(this.b);
			}
			return true;
		}
		return false;		
	},
	start: function() {},
	stop: function() {}
};

// k

const k_blue   = img("h_blue");
const k_yellow = k_blue.clone_yellow();
const k_border = img("h_border");
let   k        = 0;
const draw_k   = _ => { 
	if (k === 0) draw(k_blue);
	else draw(k_yellow);
	draw(k_border);
};
const click_k  = _ => {
	if (k_blue.click()) {
		if (++k === 2) {
			k = 0;
			s_k.set_off();
		} else {
			if (b === 1) { s_center.stop(); s_center.start(); }
			if (f === 1) { s_f.stop(); s_f.start(); }
			if (e === 1) { s_e.stop(); s_e.start(); }
			if (g === 1) { s_g.stop(); s_g.start(); }
			if (h === 1) { s_h.stop(); s_h.start(); }
			s_k.set_on();
		}
		return true;
	}
	return false;
};

// base sequence

const p_blue   = img("a_blue");
const p_yellow = p_blue.clone_yellow();
const p_border = img("a_border");
let   p        = 0;
const draw_p   = _ => { 
	if (p === 0) draw(p_blue);
	else draw(p_yellow);
	draw(p_border);
};
const click_p  = _ => {
	if (p_blue.click()) {
		if (++p === 2) {
			p = 0;
			s_center.set_off();
		} else {
			if (f === 1) { s_f.stop(); s_f.start(); }
			if (e === 1) { s_e.stop(); s_e.start(); }
			if (g === 1) { s_g.stop(); s_g.start(); }
			if (h === 1) { s_h.stop(); s_h.start(); }
			if (k === 1) { s_k.stop(); s_k.start(); }
			s_center.set_on();
		}
		return true;
	}
	return false;
};

// overlay 1

const f_blue   = img("f_blue");
const f_yellow = f_blue.clone_yellow();
const f_border = img("f_border");
let   f        = 0;
const draw_f   = _ => { 
	if (f === 0) draw(f_blue);
	else draw(f_yellow);
	draw(f_border);
};
const click_f  = _ => {
	if (f_blue.click()) {
		if (++f === 2) { 
			f = 0; 
			s_f.set_off(); 
		} else {
			if (p === 1) { s_center.stop(); s_center.start(); }
			if (e === 1) { s_e.stop(); s_e.start(); }
			if (g === 1) { s_g.stop(); s_g.start(); }
			if (h === 1) { s_h.stop(); s_h.start(); }
			if (k === 1) { s_k.stop(); s_k.start(); }
			s_f.set_on(); 
		}
		return true;
	}
	return false;
};

// overlay 2

const e_blue   = img("e_blue");
const e_yellow = e_blue.clone_yellow();
const e_border = img("e_border");
let   e        = 0;
const draw_e   = _ => { 
	if (e === 0) draw(e_blue);
	else draw(e_yellow);
	draw(e_border);
};
const click_e  = _ => {
	if (e_blue.click()) {
		if (++e === 2) { 
			e = 0;
			s_e.set_off();
		} else {
			if (p === 1) { s_center.stop(); s_center.start(); }
			if (f === 1) { s_f.stop(); s_f.start(); }
			if (g === 1) { s_g.stop(); s_g.start(); }
			if (h === 1) { s_h.stop(); s_h.start(); }
			if (k === 1) { s_k.stop(); s_k.start(); }
			s_e.set_on();
		}
		return true;
	}
	return false;
};

// overlay 3

const g_blue   = img("g_blue");
const g_yellow = g_blue.clone_yellow();
const g_border = img("g_border");
let   g        = 0;
const draw_g   = _ => { 
	if (g === 0) draw(g_blue);
	else draw(g_yellow);
	draw(g_border);
};
const click_g  = _ => {
	if (g_blue.click()) {
		if (++g === 2) { 
			g = 0; 
			s_g.set_off(); 
		} else {
			if (p === 1) { s_center.stop(); s_center.start(); }
			if (f === 1) { s_f.stop(); s_f.start(); }
			if (e === 1) { s_e.stop(); s_e.start(); }
			if (h === 1) { s_h.stop(); s_h.start(); }
			if (k === 1) { s_k.stop(); s_k.start(); }
			s_g.set_on(); 
		}
		return true;
	}
	return false;
};

// overlay 4

const h_blue   = img("d_blue");
const h_yellow = h_blue.clone_yellow();
const h_border = img("d_border");
let   h        = 0;
const draw_h   = _ => { 
	if (h === 0) draw(h_blue);
	else draw(h_yellow);
	draw(h_border);
};
const click_h  = _ => {
	if (h_blue.click()) {
		if (++h === 2) { 
			h = 0; 
			s_h.set_off();
		} else {
			if (p === 1) { s_center.stop(); s_center.start(); }
			if (f === 1) { s_f.stop(); s_f.start(); }
			if (e === 1) { s_e.stop(); s_e.start(); }
			if (g === 1) { s_g.stop(); s_g.start(); }
			if (k === 1) { s_k.stop(); s_k.start(); }
			s_h.set_on();
		}
		return true;
	}
	return false;
};

const start_group = [ s_center, s_f, s_e, s_g, s_h, s_k ];

const start_audio = _ => {
	window.start_audio = null;
	window.stop_audio  = stop_audio;
	start(start_group);
};

const stop_audio = _ => {
	window.start_audio = start_audio;
	window.stop_audio  = null;
	stop(start_group);
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
		on_click = null;
		if (start_external_audio !== null) start_external_audio();
		run("./home/index.js");
		return;	
	}
	click_audio() || click(binaural) || click_a() || click_p() || click_k() ||
	click_f()     || click_e()       || click_g() || click_h() || volume.click();
	on_resize(); 
	start_external_audio = null;
};

const draw_page = _ => {
	draw(bg_green);
	draw_audio();
	draw(back_button);
	volume.draw_blue();
	draw_a();
	draw(binaural);
	draw_p();
	draw_k();
	draw_e();
	draw_f();
	draw_g();
	draw_h();
}; 

export default _ => {
	if (window.stop_audio !== null && window.stop_audio !== stop_audio) {
		window.stop_audio();
		start_external_audio = window.start_audio;
	}
	set_item('page', "./blob/index.js");
	on_resize = draw_page;
	on_click = click_page;
	on_resize();
};
