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

const img = n => new c_img("./blob/images/" + n + ".png");

//////////////////////////////////////////////////////////////////////////////
//
// c_tone_seq_controller
//
//////////////////////////////////////////////////////////////////////////////

function c_tone_seq_controller(blue, yellow, border, seq, start_group = null) {
	this.blue        = blue;
	this.yellow      = yellow;
	this.border      = border;
	this.seq         = seq;
	this.start_group = start_group;
	if (start_group !== null && start_group.indexOf(this) === -1) start_group.push(this.seq);
}

c_tone_seq_controller.prototype.draw = function() {
	if (this.seq.on) draw(this.yellow); else draw(this.blue);
	draw(this.border);
};

c_tone_seq_controller.prototype.click = function() {
	if (this.blue.click()) {
		if (this.seq.on) {
			this.seq.set_off();
		} else {
			if (this.start_group !== null) {
				stop(this.start_group);
				start(this.start_group);
			}
			this.seq.set_on();
		}
		return true;
	}
	return false;
};

const start_group = [];

// beat  

const beat_blue   = img("b_blue");
const beat_yellow = beat_blue.clone_yellow();
const beat_border = img("b_border");

const beat = {
	on: false,
	draw: function() {
		if (this.on) draw(beat_yellow); else draw(beat_blue);
		draw(beat_border);
	},
	click: function() {
		if (beat_blue.click()) {
			if (this.on) {
				this.on = false;
			} else {
				this.on = true;
			}
			return true;
		}
		return false;		
	}
};

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
				center_seq.set_b(0);
				o1_seq.set_b(0); 
				o2_seq.set_b(0); 
				o3_seq.set_b(0); 
				o4_seq.set_b(0); 
				o5_seq.set_b(0); 
			} else {
				this.on = true;
				center_seq.set_b(this.b);
				o1_seq.set_b(this.b); 
				o2_seq.set_b(this.b); 
				o3_seq.set_b(this.b);
				o4_seq.set_b(this.b);
				o5_seq.set_b(this.b);
			}
			return true;
		}
		return false;		
	}
};

// center

const center_blue   = img("a_blue");
const center_yellow = center_blue.clone_yellow();
const center_border = img("a_border");
const center_f      = bf;
const center_seq    = new c_tone_seq(dur, [ 
	sp1(center_f, 0), sp1(center_f, 3), sp1(center_f, 3), sp1(center_f, 1), sp1(center_f, 2) 
]);
const center_controller = new c_tone_seq_controller(
	center_blue, center_yellow, center_border, center_seq, start_group
);

const o1_blue   = img("f_blue");
const o1_yellow = o1_blue.clone_yellow();
const o1_border = img("f_border");
const o1_f      = bf * Math.pow(2 * (PHI - 1), 3);  
const o1_seq    = new c_tone_seq(dur * 3, [ 
	sp1(o1_f, 0), sp1(o1_f, 3), sp1(o1_f, 3), sp1(o1_f, 1), sp1(o1_f, 2) 
]);
const o1_controller = new c_tone_seq_controller(
	o1_blue, o1_yellow, o1_border, o1_seq, start_group
);

const o2_blue   = img("e_blue");
const o2_yellow = o2_blue.clone_yellow();
const o2_border = img("e_border");
const o2_f      = bf * Math.pow(2 * (PHI - 1), 2);
const o2_seq    = new c_tone_seq(dur * 9, [ 
	sp1(o2_f, 0), sp1(o2_f, 3), sp1(o2_f, 3), sp1(o2_f, 1), sp1(o2_f, 2) 
]);
const o2_controller = new c_tone_seq_controller(
	o2_blue, o2_yellow, o2_border, o2_seq, start_group
);

const o3_blue   = img("g_blue");
const o3_yellow = o3_blue.clone_yellow();
const o3_border = img("g_border");
const o3_f      = bf * Math.pow(2 * (1 - PHI), 5);
const o3_seq    = new c_tone_seq(dur * 6, [ 
	o3_f, o3_f * (PHI - 1), o3_f * (PHI + 1) / 2, o3_f * PHI
]);
const o3_controller = new c_tone_seq_controller(
	o3_blue, o3_yellow, o3_border, o3_seq, start_group
);

const o4_blue   = img("d_blue");
const o4_yellow = o4_blue.clone_yellow();
const o4_border = img("d_border");
const o4_f      = sp1(bf * PHI, 3); 
const o4_seq    = new c_tone_seq(dur * 9, [ 
	sp1(o4_f, 0), sp1(o4_f, 3), sp1(o4_f, 3), sp1(o4_f, 1), sp1(o4_f, 2)
]);
const o4_controller = new c_tone_seq_controller(
	o4_blue, o4_yellow, o4_border, o4_seq, start_group
);

const o5_blue   = img("h_blue");
const o5_yellow = o5_blue.clone_yellow();
const o5_border = img("h_border");
const o5_f      = bf * 2;
const o5_seq    = new c_tone_seq(dur * 9, [ 
	sp1(o5_f, 0), sp1(o5_f, 3), sp1(o5_f, 1), sp1(o5_f, 2), sp1(o5_f, 4)
]);
const o5_controller = new c_tone_seq_controller(
	o5_blue, o5_yellow, o5_border, o5_seq, start_group
);

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
	click_audio() || volume.click() || click(binaural) || click(beat) || 
	click(center_controller) || click(o1_controller) || click(o2_controller) ||
	click(o3_controller) || click(o4_controller) || click(o5_controller);		
	on_resize(); 
	start_external_audio = null;
};

const draw_page = _ => {
	draw(bg_green);
	volume.draw_blue();
	draw_audio();
	draw(back_button);
	draw(beat);
	draw(binaural);
	draw(center_controller);
	draw(o1_controller);
	draw(o2_controller);
	draw(o3_controller);
	draw(o4_controller);
	draw(o5_controller);
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




// const a_blue   = img("b_blue");
// const a_yellow = a_blue.clone_yellow();
// const a_border = img("b_border");
// const a_tone   = new c_tone(bf, 0, 1);
// let   a        = 0;
// const draw_a   = _ => { 
// 	if (a === 0) draw(a_blue);
// 	else draw(a_yellow);
// 	draw(a_border);
// };
// const click_a  = _ => {
// 	if (a_blue.click()) {
// 		if (++a === 2) { 
// 			a = 0; 
// 			a_tone.stop(); 
// 		} else if (window.stop_audio !== null) {
// 			a_tone.start();
// 		}
// 		return true;
// 	}
// 	return false;
// };
// const start_a = _ => a === 1 && a_tone.start();
// const stop_a  = _ => a_tone.stop();



// const s_f_bf = bf * Math.pow(2 * (PHI - 1), 3);
// const s_f = new c_tone_seq(dur * 3, [
// 	sp1(s_f_bf, 0), sp1(s_f_bf, 3), sp1(s_f_bf, 3), sp1(s_f_bf, 1), sp1(s_f_bf, 2) 
// ]);

// const s_e_bf = bf * Math.pow(2 * (1 - PHI), 2);
// const s_e = new c_tone_seq(dur * 9, [
// 	sp1(s_e_bf, 0), sp1(s_e_bf, 3), sp1(s_e_bf, 3), sp1(s_e_bf, 1), sp1(s_e_bf, 2) 
// ]);

// const s_g_bf = bf * Math.pow(2 * (1 - PHI), 5);
// const s_g = new c_tone_seq(dur * 6, [
// 	s_g_bf, s_g_bf * (PHI - 1), s_g_bf * (PHI + 1) / 2, s_g_bf * PHI 
// ]);

// const s_h_bf = bf * Math.pow(2 * (1 - PHI), 3);
// const s_h = new c_tone_seq(dur * 12, [
// 	sp1(s_h_bf, 0), sp1(s_h_bf, 3), sp1(s_h_bf, 3), sp1(s_h_bf, 1), sp1(s_h_bf, 2) 
// ]);

// const s_k_bf = bf;
// const s_k = new c_tone_seq(dur * 10, [
// 	sp2(s_k_bf, 0), sp2(s_k_bf, 3), sp2(s_k_bf, 3), sp2(s_k_bf, 1), sp2(s_k_bf, 2) 
// ]);


// // base sequence

// const p_blue   = img("a_blue");
// const p_yellow = p_blue.clone_yellow();
// const p_border = img("a_border");
// let   p        = 0;
// const draw_p   = _ => { 
// 	if (p === 0) draw(p_blue);
// 	else draw(p_yellow);
// 	draw(p_border);
// };
// const click_p  = _ => {
// 	if (p_blue.click()) {
// 		if (++p === 2) {
// 			p = 0;
// 			s_center.set_off();
// 		} else {
// 			if (f === 1) { s_f.stop(); s_f.start(); }
// 			if (e === 1) { s_e.stop(); s_e.start(); }
// 			if (g === 1) { s_g.stop(); s_g.start(); }
// 			if (h === 1) { s_h.stop(); s_h.start(); }
// 			if (k === 1) { s_k.stop(); s_k.start(); }
// 			s_center.set_on();
// 		}
// 		return true;
// 	}
// 	return false;
// };

// overlay 1

// const f_blue   = img("f_blue");
// const f_yellow = f_blue.clone_yellow();
// const f_border = img("f_border");
// let   f        = 0;
// const draw_f   = _ => { 
// 	if (f === 0) draw(f_blue);
// 	else draw(f_yellow);
// 	draw(f_border);
// };
// const click_f  = _ => {
// 	if (f_blue.click()) {
// 		if (++f === 2) { 
// 			f = 0; 
// 			s_f.set_off(); 
// 		} else {
// 			if (p === 1) { s_center.stop(); s_center.start(); }
// 			if (e === 1) { s_e.stop(); s_e.start(); }
// 			if (g === 1) { s_g.stop(); s_g.start(); }
// 			if (h === 1) { s_h.stop(); s_h.start(); }
// 			if (k === 1) { s_k.stop(); s_k.start(); }
// 			s_f.set_on(); 
// 		}
// 		return true;
// 	}
// 	return false;
// };

// overlay 2

// const e_blue   = img("e_blue");
// const e_yellow = e_blue.clone_yellow();
// const e_border = img("e_border");
// let   e        = 0;
// const draw_e   = _ => { 
// 	if (e === 0) draw(e_blue);
// 	else draw(e_yellow);
// 	draw(e_border);
// };
// const click_e  = _ => {
// 	if (e_blue.click()) {
// 		if (++e === 2) { 
// 			e = 0;
// 			s_e.set_off();
// 		} else {
// 			if (p === 1) { s_center.stop(); s_center.start(); }
// 			if (f === 1) { s_f.stop(); s_f.start(); }
// 			if (g === 1) { s_g.stop(); s_g.start(); }
// 			if (h === 1) { s_h.stop(); s_h.start(); }
// 			if (k === 1) { s_k.stop(); s_k.start(); }
// 			s_e.set_on();
// 		}
// 		return true;
// 	}
// 	return false;
// };

// overlay 3

// const g_blue   = img("g_blue");
// const g_yellow = g_blue.clone_yellow();
// const g_border = img("g_border");
// let   g        = 0;
// const draw_g   = _ => { 
// 	if (g === 0) draw(g_blue);
// 	else draw(g_yellow);
// 	draw(g_border);
// };
// const click_g  = _ => {
// 	if (g_blue.click()) {
// 		if (++g === 2) { 
// 			g = 0; 
// 			s_g.set_off(); 
// 		} else {
// 			if (p === 1) { s_center.stop(); s_center.start(); }
// 			if (f === 1) { s_f.stop(); s_f.start(); }
// 			if (e === 1) { s_e.stop(); s_e.start(); }
// 			if (h === 1) { s_h.stop(); s_h.start(); }
// 			if (k === 1) { s_k.stop(); s_k.start(); }
// 			s_g.set_on(); 
// 		}
// 		return true;
// 	}
// 	return false;
// };

// overlay 4

// const h_blue   = img("d_blue");
// const h_yellow = h_blue.clone_yellow();
// const h_border = img("d_border");
// let   h        = 0;
// const draw_h   = _ => { 
// 	if (h === 0) draw(h_blue);
// 	else draw(h_yellow);
// 	draw(h_border);
// };
// const click_h  = _ => {
// 	if (h_blue.click()) {
// 		if (++h === 2) { 
// 			h = 0; 
// 			s_h.set_off();
// 		} else {
// 			if (p === 1) { s_center.stop(); s_center.start(); }
// 			if (f === 1) { s_f.stop(); s_f.start(); }
// 			if (e === 1) { s_e.stop(); s_e.start(); }
// 			if (g === 1) { s_g.stop(); s_g.start(); }
// 			if (k === 1) { s_k.stop(); s_k.start(); }
// 			s_h.set_on();
// 		}
// 		return true;
// 	}
// 	return false;
// };

// k = overlay 5

// const k_blue   = img("h_blue");
// const k_yellow = k_blue.clone_yellow();
// const k_border = img("h_border");
// let   k        = 0;
// const draw_k   = _ => { 
// 	if (k === 0) draw(k_blue);
// 	else draw(k_yellow);
// 	draw(k_border);
// };
// const click_k  = _ => {
// 	if (k_blue.click()) {
// 		if (++k === 2) {
// 			k = 0;
// 			s_k.set_off();
// 		} else {
// 			s_center.start();
// 			if (f === 1) { s_f.stop(); s_f.start(); }
// 			if (e === 1) { s_e.stop(); s_e.start(); }
// 			if (g === 1) { s_g.stop(); s_g.start(); }
// 			if (h === 1) { s_h.stop(); s_h.start(); }
// 			s_k.set_on();
// 		}
// 		return true;
// 	}
// 	return false;
// };

//const start_group = [ s_center, s_f, s_e, s_g, s_h, s_k ];
