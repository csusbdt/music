import c_tone  from "../global/tone.js" ;
import c_img   from "../global/img.js"  ;
import xbutton from "../global/xbutton.js";

///////////////////////////////////////////////////////////////////////
//
// tones
//
///////////////////////////////////////////////////////////////////////

const center_tone = new c_tone(3, 0, 0);
const tones = [];
for (let i = 0; i < 6; ++i) tones.push(new c_tone(scale(6, 80, 2 * i), 0, 0));

///////////////////////////////////////////////////////////////////////
//
// buttons
//
///////////////////////////////////////////////////////////////////////

const img = (n, cx = null, cy = null, cr = null) => {
	return new c_img("./compose/images/" + n + ".png", cx, cy, cr);
};

const borders      = img("borders");

const back_button  = xbutton("upper_left_blue"   );
const audio_blue   = xbutton("upper_right_blue"  );
const audio_yellow = xbutton("upper_right_yellow");

const u_blue   = [
	img("b_a_0", 140, 377, 40),
	img("b_a_1", 238, 268, 40),
	img("b_a_2", 345, 186, 40),
	img("b_a_3", 460, 150, 40),
	img("b_a_4", 584, 163, 40),
	img("b_a_5", 685, 214, 40),
	img("b_a_6", 772, 294, 42),
	img("b_a_7", 824, 405, 45)
];
const u_white  = u_blue.map(o => o.clone_white());
const u_yellow = u_blue.map(o => o.clone_yellow());

const center_blue   = img("b_0");
const center_yellow = center_blue.clone_yellow();

const v_blue   = [];
const v_yellow = [];
const b_blue   = [];
const b_yellow = [];
for (let i = 0; i < 6; ++i) {
	let o = img("b_1_" + i);
	v_blue.push(o);
	v_yellow.push(o.clone_yellow());
	o = img("b_2_" + i);
	b_blue.push(o);
	b_yellow.push(o.clone_yellow());
}

///////////////////////////////////////////////////////////////////////
//
// units
//
///////////////////////////////////////////////////////////////////////

let unit_i = 0; // the selected or playing unit

function c_unit(i) {
	this.i   = i;
	this.c_i = 0;
	this.v_i = Array(6).fill(0);
	this.b_i = Array(6).fill(0);
	this.v_i[0] = 1;
}

c_unit.prototype.draw = function() {
	if (this.i !== unit_i) {
		u_blue[this.i].draw();
		return;
	}
	u_yellow[this.i].draw();
	this.c_i === 0 ? draw(center_blue) : draw(center_yellow);
	for (let i = 0; i < 6; ++i) {
		draw(this.v_i[i] === 0 ? v_blue[i] : v_yellow[i]);
		draw(this.b_i[i] === 0 ? b_blue[i] : b_yellow[i]);
	}
};

c_unit.prototype.click = function() {
	if (u_blue[this.i].click()) {
		if (window.stop_audio !== null && window.stop_audio !== stop_audio) {
			// this is first click in page so stop external audio
			window.stop_audio();
		}
		if (this.i === unit_i) {
			if (window.stop_audio === stop_audio) {
				// i'm the playing unit
				// go into edit mode
				stop_audio();
				this.start();
			} else {
				// i'm the unit being edited
				// go into play mode
				this.stop();
				unit_i = null;
				start_audio();
			}
		} else {
			if (window.stop_audio === stop_audio) {
				// unit sequence is playing
				// go into edit mode
				stop_audio();
				unit_i = this.i;
				this.start();
			} else {
				// a different unit is being edited
				// switch to editing this node
				units[unit_i].stop();
				unit_i = this.i;
				this.start();
			}
		}
		return true;
	} else return false; 
};

c_unit.prototype.start = function() {
	center_tone.start();
	center_tone.set_v(this.c_i === 0 ? 0 : 1);
	for (let i = 0; i < 6; ++i) {
		tones[i].start();
		tones[i].set_v(this.v_i[i] === 0 ? 0 : 1);
		tones[i].set_b(this.b_i[i] === 0 ? 0 : 1);
	}
};

c_unit.prototype.stop = function() {
	center_tone.stop();
	for (let i = 0; i < 6; ++i) {
		tones[i].stop();
	}
};

const units = [];
for (let i = 0; i < 8; ++i) units.push(new c_unit(i));

///////////////////////////////////////////////////////////////////////
//
// editor
//
///////////////////////////////////////////////////////////////////////

const click_center = _ => {
	if (center_blue.click()) {
		if (window.stop_audio !== null) window.stop_audio();
		if (++units[unit_i].c_i === 2) {
			units[unit_i].c_i = 0;
			center_tone.set_v(0);
		} else {
			center_tone.set_v(1);
		}
		return true;
	} else return false;
};

const click_v = _ => {
	for (let i = 0; i < 6; ++i) {
		if (v_blue[i].click()) {
			if (window.stop_audio !== null) window.stop_audio();
			if (++units[unit_i].v_i[i] === 2) {
				units[unit_i].v_i[i] = 0;
				tones[i].set_v(0);
			} else {
				units[unit_i].v_i[i] = 1;
				tones[i].set_v(1);
			}
			return true;
		}
	}
	return false;
};

const click_b = _ => {
	for (let i = 0; i < 6; ++i) {
		if (b_blue[i].click()) {
			if (window.stop_audio !== null) window.stop_audio();
			if (++units[unit_i].b_i[i] === 2) {
				units[unit_i].b_i[i] = 0;
				tones[i].set_b(0);
			} else {
				units[unit_i].b_i[i] = 1;
				tones[i].set_b(1);
			}
			return true;
		}
	}
	return false;
};

const is_playing = _ => window.stop_audio === stop_audio;

let restart_audio_on_exit = true;

let id = null;

const next_unit = _ => {
	if (++unit_i === 8) unit_i = 0;
	units[unit_i].start();
	on_resize();
	id = setTimeout(next_unit, 1000);
};

const start_audio = _ => {
	unit_i = 0;
	units[unit_i].start();
	id = setTimeout(next_unit, 1000);
	window.start_audio = null;
	window.stop_audio  = stop_audio;
};

const stop_audio = _ => {
	clearTimeout(id);
	id = null;
	units[unit_i].stop();
	unit_i = 0;
	window.start_audio = start_audio;
	window.stop_audio  = null;
};

const exit = next_page => {
	if (is_playing()) {
		window.start_audio = null;
		window.stop_audio  = stop_audio;
	} else if (restart_audio_on_exit) {
		window.start_audio();
	}
	run(next_page);
};

const click_page = _ => {
	if (back_button.click()) return exit("../home/index.js");
	else if (click(audio_blue)) {
		window.start_audio === null ? stop_audio() : start_audio();
		on_resize();
	} else if (click_center() || click_v() || click_b() || click(units)) on_resize();
	restart_audio_on_exit = false;
};

const draw_page = _ => {
	bg_green.draw();
	draw(units);
	draw(borders);
	draw(back_button);
	window.start_audio === null ? audio_yellow.draw() : audio_blue.draw();
};

export default _ => {
	assert((window.start_audio === null) !== (window.stop_audio === null));
	if (window.stop_audio !== null && window.stop_audio !== stop_audio) {
		window.stop_audio();
		restart_audio_on_exit = true;
	} else {
		restart_audio_on_exit = false;
	}
	set_item('page', "./compose/index.js");
	on_resize = draw_page;
	on_click = click_page;
	on_resize();
};

