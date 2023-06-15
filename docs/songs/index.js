import start_home  from "../home/index.js";
import { song_0 }  from "./songs.js"      ;
import { song_1 }  from "./songs.js"      ;
import { song_2 }  from "./songs.js"      ;
import { song_3 }  from "./songs.js"      ;

const songs = [ song_0, song_1, song_2, song_3 ];

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

const stop_song = _ => {
	assert(song_i !== null);
	songs[song_i].stop();
	song_i = null;
	// caller must call stop_audio to halt playing of last tone
};

const click_page = _ => {
	if (back_button.click()) return start_home();
	if (silence_button.click()) return on_resize();
	for (let i = 0; i < reds.length; ++i) {
		if (click(reds[i])) {
			if (song_i === null) {
				on_click = null;
				start_audio(stop_song).then(_ => {
					song_i = i;
					songs[song_i].start();
					on_click = click_page;
					on_resize();
				});
			} else if (song_i === i) {
				on_click = null;
				stop_song();
				stop_audio().then(_ => {
					on_click = click_page;					
					on_resize();
				});
			} else {
				on_click = null;
				stop_song();
				stop_audio().then(_ => {
					start_audio(stop_song).then(_ => {
						song_i = i;
						songs[song_i].start();
						on_click = click_page;
						on_resize();
					});
				});
			}
			break;
		}
	}
};

export default _ => {
	set_item('page', "./songs/index.js");
	on_click  = click_page;	
	on_resize = draw_page ;
	on_resize();
};
