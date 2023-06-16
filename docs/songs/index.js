import start_home  from "../home/index.js";
import songs       from "./songs.js"      ;

function c_img(src) {
    this.image     = new Image();
    this.image.src = src;
}

c_img.prototype.draw = function() {	
	if (this.image.complete) {
		ctx.drawImage(this.image, 0, 0);
	} else {
		this.image.onload = on_resize;
	}
};

const img = n => new c_img("./songs/images/" + n + ".png");
const click = img => click_test(img.image);

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

const draw_page = _ => {
	bg_blue.draw();
	greens.forEach(o => o.draw());
	if (song_i !== null) reds[song_i].draw();
	borders.forEach(o => o.draw());
	silence_button.draw();
	back_button.draw();
};

const stop_page_audio = _ => {
	assert(on_resize !== draw_page);
	assert(song_i !== null);
	window.stop_page_audio = null;
	songs[song_i].stop();
	song_i = null;
}; 

const click_page = _ => {
	if (back_button.click()) {
		if (song_i !== null) {
			assert(window.stop_page_audio === null);
			window.stop_page_audio = stop_page_audio;
		}
		start_home();
	} else if (silence_button.click()) return on_resize();
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
	if (song_i !== null) {
		assert(window.stop_page_audio === stop_page_audio);
		window.stop_page_audio = null;
	}	
	set_item('page', "./songs/index.js");
	on_click  = click_page;	
	on_resize = draw_page ;
	on_resize();
};
