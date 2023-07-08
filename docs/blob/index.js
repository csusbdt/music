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

// // beat  

// const beat_blue   = img("b_blue");
// const beat_yellow = beat_blue.clone_yellow();
// const beat_border = img("b_border");

// const beat = {
// 	on: false,
// 	draw: function() {
// 		if (this.on) draw(beat_yellow); else draw(beat_blue);
// 		draw(beat_border);
// 	},
// 	click: function() {
// 		if (beat_blue.click()) {
// 			if (this.on) {
// 				this.on = false;
// 			} else {
// 				this.on = true;
// 			}
// 			return true;
// 		}
// 		return false;		
// 	}
// };

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

const alt_blue   = img("b_blue");
const alt_yellow = alt_blue.clone_yellow();
const alt_border = img("b_border");
const alt_f      = bf * 2;
const alt_seq    = new c_tone_seq(dur * 2, [ 
	alt_f, sp1(alt_f * PHI, 3), alt_f, sp1(alt_f, 0)
], 0, .6);
const alt_controller = new c_tone_seq_controller(
	alt_blue, alt_yellow, alt_border, alt_seq, start_group
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
	click_audio() || volume.click() || click(binaural) || click(alt_controller) || 
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
	draw(binaural);
	draw(center_controller);
	draw(alt_controller);
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
