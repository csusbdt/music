import start_home      from "../home/index.js"   ;
import c_tone          from "../global/tone.js"  ;
import c_img           from "../global/img.js" ;

const tone = new c_tone(100, 3, 1);

const img = n => new c_img("./compose/images/" + n + ".png");

const borders = img("borders");
const r_0 = img("r_0");
const back_green = img("back_green");
const audio_red = img("audio_red");
const audio_green = img("audio_green");
const v_red = [img("r_1_0"), img("r_1_1"), img("r_1_2"), img("r_1_3"), img("r_1_4"), img("r_1_5") ];
const b_red = [img("r_2_0"), img("r_2_1"), img("r_2_2"), img("r_2_3"), img("r_2_4"), img("r_2_5") ];

const draw  = a => Array.isArray(a) ? a.forEach(o => o.draw()) : a.draw();
const click = a => Array.isArray(a) ? a.some(o => o.click()) : a.click();

const is_playing = _ => tone.is_playing();

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
	}
	start_home();
};

//const audio = audio_toggle(start_audio, stop_audio);

const click_page = _ => {
	if (click(back_green)) return exit(start_home);
	else if (click(audio_red)) {
		is_playing() ? stop_audio() : start_audio();
		on_resize();
	}
};

const draw_page = _ => {
	bg_blue.draw();
	r_0.draw();
	draw(v_red);
	draw(b_red);
	borders.draw();
	draw(back_green);
	is_playing() ? audio_red.draw() : audio_green.draw();
	// draw_back_button();
	// audio.draw();
//	on.forEach(on => on ? )
};

export default _ => {
	assert((window.start_audio === null) !== (window.stop_audio === null));
	// if (window.stop_audio === null) {
	// 	audio.color = audio.color_0;
	// } else if (window.stop_audio !== stop_audio) {
	// 	window.stop_audio();
	// 	audio.color = audio.color_0;
	// } else {
	// 	audio.color = audio.color_1;
	// }
	set_item('page', "./compose/index.js");
	on_resize = draw_page;
	on_click = click_page;
	on_resize();
};

