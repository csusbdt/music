import start_home        from "../home/index.js"  ;
import c_tone            from "../global/tone.js" ;
import c_img             from "../global/img.js"  ;
import { draw_back_button_blue } from "../global/index.js"  ;
import { click_back_button     } from "../global/index.js"  ;
import { audio_button_blue     } from "../global/index.js"  ;
import { audio_button_yellow   } from "../global/index.js"  ;



const tone = new c_tone(78, 3, 1);

const img = n => new c_img("./compose/images/" + n + ".png");

const borders      = img("borders");

const r_0          = img("r_0");
const v_red        = [img("r_1_0"), img("r_1_1"), img("r_1_2"), img("r_1_3"), img("r_1_4"), img("r_1_5") ];
const b_red        = [img("r_2_0"), img("r_2_1"), img("r_2_2"), img("r_2_3"), img("r_2_4"), img("r_2_5") ];



const t_blue   = [];
const t_yellow = [];
for (let i = 0; i < 8; ++i) {
	const o = img("b_a_" + i);
	t_blue.push(o);
	t_yellow.push(o.clone_yellow());
}

const draw  = a => Array.isArray(a) ? a.forEach(o => o.draw()) : a.draw();
const click = a => Array.isArray(a) ? a.some(o => o.click()) : a.click();

const is_playing = _ => tone.is_playing();

let restart_audio_on_exit = true;

const start_audio = _ => {
	tone.start();
	window.start_audio = null;
	window.stop_audio  = stop_audio;
};

const stop_audio = _ => {
	tone.stop();
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
	start_home();
};

const click_page = _ => {
	if (click_back_button()) return exit(start_home);
	else if (click(audio_button_blue)) {
		is_playing() ? stop_audio() : start_audio();
		on_resize();
	}
	restart_audio_on_exit = false;
};

const draw_page = _ => {
	bg_green.draw();
	r_0.draw();
	draw(v_red);
	draw(b_red);
	draw(t_blue);
	
	borders.draw();
	draw_back_button_blue();
	is_playing() ? audio_button_yellow.draw() : audio_button_blue.draw();
};

export default _ => {
	assert((window.start_audio === null) !== (window.stop_audio === null));
	if (window.stop_audio !== null && window.stop_audio !== stop_audio) {
		window.stop_audio();
		restart_audio_on_exit = true;
	}
	set_item('page', "./compose/index.js");
	on_resize = draw_page;
	on_click = click_page;
	on_resize();
};

