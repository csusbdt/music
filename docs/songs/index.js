import start_home  from "../home/index.js";
import songs       from "./songs.js"      ;
import c_toggle    from "../toggle.js"    ;
import c_img       from "../img.js"       ;

// function c_img(src) {
//     this.image     = new Image();
//     this.image.src = src;
// }

// c_img.prototype.draw = function() {	
// 	if (this.image.complete) {
// 		ctx.drawImage(this.image, 0, 0);
// 	} else {
// 		this.image.onload = on_resize;
// 	}
// };

const img = n => new c_img("./songs/images/" + n + ".png");
const click = img => img.click();

//const click = img => click_test(img.image);

const borders = [
	img("play_big_border"     ),
	img("play_medium_1_border"),
	img("play_medium_2_border"),
	img("play_small_1_border" )
];

const greens = [
	img("play_big_green"     ),
	img("play_medium_1_green"),
	img("play_medium_2_green"),
	img("play_small_1_green" )
];

const reds = [
	img("play_big_red"       ),
	img("play_medium_1_red"  ),
	img("play_medium_2_red"  ),
	img("play_small_1_red"   )
];

let song_i = null;

const is_playing = _ => song_i !== null;

const stop_audio_red    = new c_img("./global/images/upper_right_red.png"   );
const stop_audio_green  = new c_img("./global/images/upper_right_green.png" );
const stop_audio_border = new c_img("./global/images/upper_right_border.png");

const stop_audio = new c_toggle(stop_audio_green, stop_audio_red, stop_audio_border);


const draw_page = _ => {
	bg_blue.draw();
	greens.forEach(o => o.draw());
	if (song_i !== null) reds[song_i].draw();
	borders.forEach(o => o.draw());
	stop_audio.draw();
//	silence_button.draw();
	back_button.draw();
};

const stop_page_audio = _ => {
	if (window.stop_page_audio !== stop_page_audio) {
		window.stop_page_audio();
	} else {
		songs[song_i].stop();
		song_i = null;
	}
	window.stop_page_audio = null;
	stop_audio.color = stop_audio.color_0;
}; 

const click_page = _ => {
	if (stop_audio.click()) {
		if (window.stop_page_audio !== null) {
			window.stop_page_audio();
			stop_audio.color = stop_audio.color_0;
			on_resize();
		}
		return;
	}
	
	if (back_button.click()) {
		if (is_playing()) window.stop_page_audio = stop_page_audio;
		start_home();
	}
//	} else if (silence_button.click()) return on_resize();
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
		stop_audio.color = stop_audio.color_0;
	} else {
		stop_audio.color = stop_audio.color_1;
	}
	set_item('page', "./songs/index.js");
	on_click  = click_page;	
	on_resize = draw_page ;
	on_resize();
};
