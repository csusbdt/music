import start_home  from "../home/index.js";
import c_img       from "../img.js"       ;
import c_button    from "../button.js"    ;
import c_toggle    from "../toggle.js"    ;
import songs       from "./songs.js"      ;

let img = n => new c_img("./global/images/" + n + ".png");
const audio_red    = img("upper_right_red");
const audio_green  = img("upper_right_green");
const audio_border = img("upper_right_border");

img = n => new c_img("./songs/images/" + n + ".png");
const big_green         = img("big_green");
const big_red           = img("big_red");
const big_border        = img("big_border");
const medium_1_green    = img("medium_1_green");
const medium_1_red      = img("medium_1_red");
const medium_1_border   = img("medium_1_border");
const medium_2_green    = img("medium_2_green");
const medium_2_red      = img("medium_2_red");
const medium_2_border   = img("medium_2_border");
const small_1_green     = img("small_1_green");
const small_1_red       = img("small_1_red");
const small_1_border    = img("small_1_border");

const audio_toggle = new c_toggle(audio_green, audio_red, audio_border);

const song_toggles = [
	new c_toggle(big_green     , big_red     , big_border     ),
	new c_toggle(medium_1_green, medium_1_red, medium_1_border),
	new c_toggle(medium_2_green, medium_2_red, medium_2_border),
	new c_toggle(small_1_green , small_1_red , small_1_border )
];

let song_i = 0;

const start_audio = _ => {
	songs[song_i].start();
	song_toggles[song_i].color = song_toggles[song_i].color_1;
	audio_toggle.color = audio_toggle.color_1;
	window.start_audio = null;
	window.stop_audio = stop_audio;
};

const stop_audio = _ => {
	songs[song_i].stop();
	song_toggles[song_i].color = song_toggles[song_i].color_0;
	audio_toggle.color = audio_toggle.color_0;
	window.stop_audio = null;
	window.start_audio = start_audio;
}; 

const draw_page = _ => {
	bg_blue.draw();
	back_button.draw();
	audio_toggle.draw();
	song_toggles.forEach(o => o.draw());
};

const click_page = _ => {
	if (audio_toggle.click()) {
		if (audio_toggle.color === audio_toggle.color_0) {
			if (window.stop_audio !== null) {
				window.stop_audio();
				window.stop_audio = null;
			} else {
				songs[song_i].stop();
				song_toggles[song_i].color = song_toggles[song_i].color_0;
			}
		} else {
			if (window.start_audio !== null) {
				window.start_audio();
				window.start_audio = null;
			} else {
				songs[song_i].start();
				song_toggles[song_i].color = song_toggles[song_i].color_1;
			}			
		}
		on_resize(); 
	} else if (back_button.click()) {
		if (songs[song_i].is_playing()) {
			window.start_audio = null;
			window.stop_audio = stop_audio;
		} else if (window.start_audio === null && window.stop_audio === null) {
			window.start_audio = start_audio;
		}
		start_home();
	} else for (let i = 0; i < song_toggles.length; ++i) {
		if (song_toggles[i].click()) {
			if (songs[song_i].is_playing()) {
				if (song_i === i) {
					songs[song_i].stop();
					song_toggles[song_i].color = song_toggles[song_i].color_0;
					audio_toggle.color = audio_toggle.color_0;
				} else {
					songs[song_i].stop();
					song_toggles[song_i].color = song_toggles[song_i].color_0;
					song_i = i;
					songs[song_i].start();
					song_toggles[song_i].color = song_toggles[song_i].color_1;
					audio_toggle.color = audio_toggle.color_1;
				}
			} else {
				window.start_audio = null; 
				window.stop_audio  = null;
				song_i = i;
				songs[song_i].start();
				song_toggles[song_i].color = song_toggles[song_i].color_1;
				audio_toggle.color = audio_toggle.color_1;
			}
			on_resize();
		 	return;
		}
	}
};

export default _ => {
	if (songs[song_i].is_playing()) {
		assert(window.stop_audio === stop_audio);
		audio_toggle.color = audio_toggle.color_1;
		song_toggles[song_i].color = song_toggles[song_i].color_1;
	} else if (window.stop_audio !== null) {
		assert(window.start_audio === null);
		audio_toggle.color = audio_toggle.color_1;
		song_toggles[song_i].color = song_toggles[song_i].color_0;
	} else if (window.start_audio !== null) {
		audio_toggle.color = audio_toggle.color_0;
		song_toggles[song_i].color = song_toggles[song_i].color_0;		
	} else {
		// no audio has yet been played
		audio_toggle.color = audio_toggle.color_0;
		song_toggles[song_i].color = song_toggles[song_i].color_0;				
	}
	set_item('page', "./songs/index.js");
	on_click  = click_page;	
	on_resize = draw_page ;
	on_resize();
};
