import start_home  from "../home/index.js";
import { song_0 }  from "./songs.js"      ;
import { song_1 }  from "./songs.js"      ;
import { song_2 }  from "./songs.js"      ;
import { song_3 }  from "./songs.js"      ;

// buttons

const path = n => "./songs/images/" + n + ".png";
const pair = (first, second, on_click) => objs([img(path(first)), img(path(second))], on_click);

const off_all = _ => {
	buttons.forEach(o => {
		if (o.i === 1) {
			o.objs[1].on_click();
			o.i = 0;
		}
	});
};

const on_0   = pair("play_big_green"     , "play_big_border"     , _ => song_0.stop());
const on_1   = pair("play_medium_1_green", "play_medium_1_border", _ => song_1.stop());
const on_2   = pair("play_medium_2_green", "play_medium_2_border", _ => song_2.stop());
const on_3   = pair("play_small_1_green" , "play_small_1_border" , _ => song_3.stop());

const off_0  = pair("play_big_red"     , "play_big_border"     , _ => { off_all(); song_0.start(); });
const off_1  = pair("play_medium_1_red", "play_medium_1_border", _ => { off_all(); song_1.start(); });
const off_2  = pair("play_medium_2_red", "play_medium_2_border", _ => { off_all(); song_2.start(); });
const off_3  = pair("play_small_1_red" , "play_small_1_border" , _ => { off_all(); song_3.start(); });

const obj_0 = click_seq([off_0, on_0]);
const obj_1 = click_seq([off_1, on_1]);
const obj_2 = click_seq([off_2, on_2]);
const obj_3 = click_seq([off_3, on_3]);

const buttons = [ obj_0, obj_1, obj_2, obj_3 ];

// control

const draw_list  = [ bg_blue, silence_button, back_button, ...buttons ];
const click_list = [          silence_button, back_button, ...buttons ];
const start_list = [                                       ...buttons ];

const exit_page = next_page => {
	off_all();
	stop_audio().then(next_page);
};

export default _ => {
	set_item('page', "./songs/index.js");
	on_resize = _ => draw_list.forEach(o => o.draw());
	on_click = _ => {
		if (back_button.click()) exit_page(start_home);
		else if (click_list.some(o => o.click())) on_resize();
	};
	start_list.forEach(o => o.start());
	on_resize();
};
