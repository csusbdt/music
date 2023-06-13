import start_home  from "../home/index.js";
import { song_0 }  from "./songs.js"      ;
import { song_1 }  from "./songs.js"      ;
import { song_2 }  from "./songs.js"      ;
import { song_3 }  from "./songs.js"      ;

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

const on_0   = pair("play_big_green", "play_big_border", _ => song_0.stop());
const on_1   = pair("play_medium_1_green", "play_medium_1_border", _ => song_1.stop());

const off_0  = pair("play_big_red"     , "play_big_border"     , _ => { off_all(); song_0.start(); });
const off_1  = pair("play_medium_1_red", "play_medium_1_border", _ => { off_all(); song_1.start(); });

const obj_0 = click_seq([off_0, on_0]);
const obj_1 = click_seq([off_1, on_1]);

const buttons = [ obj_0, obj_1 ];

// const song_0_button = radio_button(
// 	image("./songs/images/play_big_border.png"     ),
// 	image("./songs/images/play_big_red.png"        ),
// 	image("./songs/images/play_big_green.png"      ),
// 	song_0.stop_func()                              ,
// 	song_0.start_func()
// );

// const song_1_button = radio_button(
// 	image("./songs/images/play_medium_1_border.png"),
// 	image("./songs/images/play_medium_1_red.png"   ),
// 	image("./songs/images/play_medium_1_green.png" ),
// 	song_1.stop_func()                              ,
// 	song_1.start_func()
// );

// const song_2_button = radio_button(
// 	image("./songs/images/play_medium_2_border.png"),
// 	image("./songs/images/play_medium_2_red.png"   ),
// 	image("./songs/images/play_medium_2_green.png" ),
// 	song_2.stop_func()                              ,
// 	song_2.start_func()
// );

// const song_3_button = radio_button(
// 	image("./songs/images/play_small_1_border.png" ),
// 	image("./songs/images/play_small_1_red.png"    ),
// 	image("./songs/images/play_small_1_green.png"  ),
// 	song_3.stop_func()                              ,
// 	song_3.start_func()
// );

// const play_buttons = radio_buttons(
// 	song_0_button,
// 	song_1_button,
// 	song_2_button,
// 	song_3_button
// );

// const a = [ bg_blue, silence_button, ...play_buttons ];


// control

const draw_list  = [ bg_blue, silence_button, back_button, ...buttons ];
const click_list = [          silence_button, back_button, ...buttons ];
const start_list = [                                       ...buttons ];

const exit_page = next_page => {
	buttons.forEach(o => {
		if (o.i === 1) {
			o.objs[1].on_click();
			o.i = 0;
		}
	});
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
