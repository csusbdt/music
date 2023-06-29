import songs    from "./songs.js"          ;
import xbutton  from "../global/xbutton.js";

const draw = a => Array.isArray(a) ? a.forEach(o => o.draw()) : a.draw();

const back_button = xbutton("upper_left_green");
const audio_green = xbutton("upper_right_green");
const audio_red   = xbutton("upper_right_red");

const green = [
	xbutton("medium_green", 100,  50),
	xbutton("medium_green", 300, 250),
	xbutton("small_green" , 450, 600),
	xbutton("small_green" , 600, 550)	
];

const red = [
	xbutton("medium_red"  , 100,  50),
	xbutton("medium_red"  , 300, 250),
	xbutton("small_red"   , 450, 600),
	xbutton("small_red"   , 600, 550)
];

let song_i = 0;

const start_audio = _ => {
	if (window.stop_audio !== null) window.stop_audio();
	window.start_audio = null;
	window.stop_audio = stop_audio;
	songs[song_i].start();
};

const stop_audio = _ => {
	songs[song_i].stop();
	window.start_audio = start_audio;
	window.stop_audio = null;
}; 

const draw_page = _ => {
	bg_blue.draw();
	draw(green);
	if (window.stop_audio === stop_audio) red[song_i].draw();
	back_button.draw();
	window.stop_audio === null ? audio_green.draw() : audio_red.draw();
};

const click_song_buttons = _ => {
	for (let i = 0; i < green.length; ++i) {
		if (green[i].click()) {
			if (window.stop_audio === null) {
				song_i = i;
				start_audio();
			} else if (window.stop_audio === stop_audio) {
				stop_audio();
				if (i !== song_i) {
					song_i = i;
					start_audio();
				}
			} else {
				window.stop_audio();
				song_i = i;
				start_audio();
			}
			return true;
		}
	}
	return false;
};

const click_page = _ => {
	if (audio_green.click()) {
		window.stop_audio !== null ? window.stop_audio() : start_audio();
		on_resize(); 
	} else if (back_button.click()) {
		run("../home/index.js");
	} else if (click_song_buttons()) on_resize();
};

export default i => {
	if (i !== undefined) {
		song_i = i;
		window.start_audio = start_audio;
		window.stop_audio  = null;
		return;
	}
	if (window.start_audio !== null) window.start_audio = start_audio;
	set_item('page', "./songs/index.js");
	on_click  = click_page;	
	on_resize = draw_page ;
	on_resize();
};
