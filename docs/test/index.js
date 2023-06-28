import start_home     from "../home/index.js"    ;
import c_img          from "../global/img.js"    ;
import c_tone         from "../global/tone.js"   ;
import xbutton        from "../global/xbutton.js";

const draw = o => o.draw();

const back_button  = xbutton("upper_left_blue"   );
const audio_blue   = xbutton("upper_right_blue"  );
const audio_yellow = xbutton("upper_right_yellow");

let img = n => new c_img("./compose/images/" + n + ".png");

const borders = img("borders");
const b_0     = img("b_0");
const y_0     = b_0.clone_yellow();

let tone_i = 0;
const tone = new c_tone(80, 3, 1);

const start_audio = _ => {
	tone_i = 1;
	tone.start();
	window.start_audio = null;
	window.stop_audio  = stop_audio;
};

const stop_audio = _ => {
	tone_i = 0;
	tone.stop();
	window.start_audio = start_audio;
	window.stop_audio  = null;
};

let restart_audio_on_exit = true;

const exit = next_page => {
	if (tone.is_playing()) {
		window.start_audio = null;
		window.stop_audio  = stop_audio;
	} else if (restart_audio_on_exit) {
		window.start_audio();
	}
	run(next_page);
};

const click_page = _ => {
	if (back_button.click()) exit("../home/index.js");
	if (audio_blue.click()) {
		window.start_audio === null ? stop_audio() : start_audio();
		on_resize();
	}
	if (b_0.click()) {
		if (++tone_i === 2) stop_audio(); else start_audio();
		on_resize();
	}
	restart_audio_on_exit = false;
};

const draw_page = _ => {
	draw(bg_green);
	draw(back_button);
	if (tone_i === 0) {
		draw(b_0);
		draw(audio_blue);
	} else {
		draw(y_0);
		draw(audio_yellow);
	}
	draw(borders);
};

export default _ => {
	assert((window.start_audio === null) !== (window.stop_audio === null));
	if (window.stop_audio !== null && window.stop_audio !== stop_audio) {
		window.stop_audio();
		restart_audio_on_exit = true;
	} else {
		restart_audio_on_exit = false;
	}
	set_item('page', "./test/index.js");
	on_resize = draw_page;
	on_click = click_page;
	on_resize();
};

