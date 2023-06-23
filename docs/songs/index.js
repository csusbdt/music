import start_home             from "../home/index.js"   ;
import c_img                  from "../global/img.js"   ;
import c_toggle               from "../global/toggle.js";
import songs                  from "./songs.js"         ;
import { draw_back_button   } from "../global/index.js" ;
import { click_back_button  } from "../global/index.js" ;
import { draw_audio_toggle  } from "../global/index.js" ;
import { click_audio_toggle } from "../global/index.js" ;

let img = n => new c_img("./global/images/" + n + ".png");
const audio_red         = img("upper_right_red", 900, 60, 50);
const audio_green       = img("upper_right_green", 900, 60, 50);
const audio_border      = img("upper_right_border", 900, 60, 50);

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

const song_toggles = [
	new c_toggle(big_green     , big_red     , big_border     ),
	new c_toggle(medium_1_green, medium_1_red, medium_1_border),
	new c_toggle(medium_2_green, medium_2_red, medium_2_border),
	new c_toggle(small_1_green , small_1_red , small_1_border )
];

let song_i = 0;

const start_audio = _ => {
	if (window.stop_audio !== null) window.stop_audio();
	window.start_audio = null;
	window.stop_audio = stop_audio;
	songs[song_i].start();
	song_toggles[song_i].color = song_toggles[song_i].color_1;
};

const stop_audio = _ => {
	songs[song_i].stop();
	song_toggles[song_i].color = song_toggles[song_i].color_0;
	window.start_audio = start_audio;
	window.stop_audio = null;
}; 

const draw_page = _ => {
	bg_blue.draw();
	draw_back_button();
	draw_audio_toggle();
	song_toggles.forEach(o => o.draw());
};

const click_page = _ => {
	if (click_audio_toggle()) {
		on_resize(); 
	} else if (click_back_button()) {
		start_home();
	} else for (let i = 0; i < song_toggles.length; ++i) {
		if (song_toggles[i].click()) {
			if (songs[i].is_playing()) {
				stop_audio();
			} else {
				if (window.stop_audio !== null) window.stop_audio();
				song_i = i;
				start_audio();
			}
			on_resize();
		 	return;
		}
	}
};

export default i => {
	if (i !== undefined) {
		song_i = i;
		window.start_audio = start_audio;
		return;
	}
	if (window.start_audio !== null) window.start_audio = start_audio;
	set_item('page', "./songs/index.js");
	on_click  = click_page;	
	on_resize = draw_page ;
	on_resize();
};
