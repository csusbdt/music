import c_tone  from "../global/tone.js" ;
import c_img   from "../global/img.js"  ;
import xbutton from "../global/xbutton.js";

const back_button  = xbutton("upper_left_blue"   );
const audio_blue   = xbutton("upper_right_blue"  );
const audio_yellow = xbutton("upper_right_yellow");

const draw  = a => Array.isArray(a) ? a.forEach(o => o.draw()) : a.draw();
const click = a => Array.isArray(a) ? a.some(o => o.click()) : a.click();
const img   = n => new c_img("./compose/images/" + n + ".png");

const borders = img("borders");

///////////////////////////////////////////////////////////////////////
//
// units
//
///////////////////////////////////////////////////////////////////////




const unit     = Array(8).fill(0); // unit states
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

const draw_units = _ => {
	for (let i = 0; i < 8; ++i) {
		if (unit[i] === 0) ; // noop
		else if (unit[i] === 1) draw(u_blue[i]);
		else if (unit[i] === 2) draw(u_yellow[i]);
	}
};

const click_units = _ => {
	for (let i = 0; i < 8; ++i) {
		if (u_blue[i].click()) {
			if (++unit[i] === 2) {
				unit[i] = 0;
			}
			return true;
		}
	}
	return false;
};


///////////////////////////////////////////////////////////////////////
//
// center_tone
//
///////////////////////////////////////////////////////////////////////

let center_i        = 0;
const center_tone   = new c_tone(3, 0, 0);
const center_blue   = img("b_0");
const center_yellow = center_blue.clone_yellow();

const draw_center   = _ => draw(center_i === 0 ? center_blue : center_yellow);

const click_center  = _ => {
	if (center_blue.click()) {
		if (++center_i === 2) {
			center_i = 0;
			center_tone.set_v(0);
		} else {
			center_tone.set_v(1);
		}
		return true;
	}
	return false;
};

const start_center_tone = _ => center_tone.start();
const stop_center_tone  = _ => center_tone.stop();

///////////////////////////////////////////////////////////////////////
//
// 6 tones
//
///////////////////////////////////////////////////////////////////////

let tones_i    = [];
let b_i        = [];
const tones    = [];
const v_blue   = [];
const v_yellow = [];
const b_blue   = [];
const b_yellow = [];
for (let i = 0; i < 6; ++i) {
	tones_i.push(0);
	b_i.push(0);
	tones.push(new c_tone(scale(6, 80, 2 * i), 0, 0));
	let o = img("b_1_" + i);
	v_blue.push(o);
	v_yellow.push(o.clone_yellow());
	o = img("b_2_" + i);
	b_blue.push(o);
	b_yellow.push(o.clone_yellow());
}

const draw_vb = _ => {
	for (let i = 0; i < 6; ++i) {
		draw(tones_i[i] === 0 ? v_blue[i] : v_yellow[i]);
		draw(b_i[i]     === 0 ? b_blue[i] : b_yellow[i]);
	}
};

const click_v = _ => {
	for (let i = 0; i < 6; ++i) {
		if (v_blue[i].click()) {
			if (++tones_i[i] === 2) {
				tones_i[i] = 0;
				tones[i].set_v(0);
			} else {
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
			if (++b_i[i] === 2) {
				b_i[i] = 0;
				tones[i].set_b(0);
			} else {
				tones[i].set_b(3);
			}
			return true;
		}
	}
	return false;
};

const start_tones = _ => tones.forEach(o => o.start());
const stop_tones  = _ => tones.forEach(o => o.stop());

const is_playing = _ => center_tone.is_playing() || tones.some(o => o.is_playing());

let restart_audio_on_exit = true;

const start_audio = _ => {
	start_center_tone();
	start_tones();
	window.start_audio = null;
	window.stop_audio  = stop_audio;
};

const stop_audio = _ => {
	stop_center_tone();
	stop_tones();
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
	} else if (click_center() || click_v() || click_b() || click_units()) on_resize();
	restart_audio_on_exit = false;
};

const draw_page = _ => {
	bg_green.draw();
	draw_center();
	draw_vb();
	draw_units();
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

