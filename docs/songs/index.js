import start_home  from "../home/index.js";
import c_img       from "../img.js"       ;
import c_button    from "../button.js"    ;
import c_toggle    from "../toggle.js"    ;
import songs       from "./songs.js"      ;

let song_i = 0; 

let img = n => new c_img("./global/images/" + n + ".png");
const stop_audio_red    = img("upper_right_red");
const stop_audio_green  = img("upper_right_green");
const stop_audio_border = img("upper_right_border");

img = n => new c_img("./songs/images/" + n + ".png");
const big_green         = img("play_big_green");
const big_red           = img("play_big_red");
const big_border        = img("play_big_border");
const medium_1_green    = img("medium_1_green");
const medium_1_red      = img("medium_1_red");
const medium_1_border   = img("medium_1_border");
const medium_2_green    = img("medium_2_green");
const medium_2_red      = img("medium_2_red");
const medium_2_border   = img("medium_2_border");
const small_1_green     = img("small_1_green");
const small_1_red       = img("small_1_red");
const small_1_border    = img("small_1_border");

let create_song_button = (green, red, border, song) => {
	return new c_toggle(green, red, border, song.start, song.stop);
};

const song_buttons = [
	create_song_button(big_green     , big_red     , big_border     , songs[0]),
	create_song_button(medium_1_green, medium_1_red, medium_1_border, songs[1]),
	create_song_button(medium_2_green, medium_2_red, medium_2_border, songs[2]),
	create_song_button(small_1_green , small_1_red , small_1_border , songs[3])
];

const start_audio = _ => {
	if (window.stop_page_audio !== null) window.stop_page_audio();
	songs[song_i].start();
	window.stop_page_audio = stop_audio;
}; 

const stop_audio = _ => {
	song_buttons.forEach(o => o.color = o.color_0 && o.song.stop());
}; 

const stop_audio_button = new c_toggle(
	stop_audio_green, stop_audio_red, stop_audio_border, start_audio, stop_audio
);

const draw_page = _ => {
	bg_blue.draw();
	back_button.draw();
	stop_audio_button.draw();
	song_buttons.forEach(o => o.draw());
};

const click_page = _ => {
	if (stop_audio_button.click()) on_resize();
	else if (back_button.click()) start_home();
	else for (let i = 0; i < reds.length; ++i) {
		if (click(reds[i])) {
			if (window.stop_page_audio !== null) {
				window.stop_page_audio();
			}
			if (song_i === i) {
				songs[song_i].stop();
				song_i = null;
			} else if (song_i !== null) {
				songs[song_i].stop();
				song_i = i;
				songs[song_i].start();
			} else {
				song_i = i;
				songs[song_i].start();
			}
			on_resize();
		 	return;
		}
	}
};

export default _ => {
	if (window.stop_page_audio === null) {		
		stop_audio_button.color = stop_audio_button.color_0;
	} else {
		stop_audio_button.color = stop_audio_button.color_1;
	}
	set_item('page', "./songs/index.js");
	on_click  = click_page;	
	on_resize = draw_page ;
	on_resize();
};
