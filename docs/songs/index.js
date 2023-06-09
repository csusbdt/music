import start_home  from "../home/index.js";
import { song_0 }  from "./songs.js"      ;
import { song_1 }  from "./songs.js"      ;
import { song_2 }  from "./songs.js"      ;
import { song_3 }  from "./songs.js"      ;
//import { happy_birthday } from "./songs.js"      ;

const song_0_button = radio_button(
	image("./songs/images/play_big_border.png"     ),
	image("./songs/images/play_big_red.png"        ),
	image("./songs/images/play_big_green.png"      ),
	song_0.stop_func()                              ,
	song_0.start_func()
);

const song_1_button = radio_button(
	image("./songs/images/play_medium_1_border.png"),
	image("./songs/images/play_medium_1_red.png"   ),
	image("./songs/images/play_medium_1_green.png" ),
	song_1.stop_func()                              ,
	song_1.start_func()
);

const song_2_button = radio_button(
	image("./songs/images/play_medium_2_border.png"),
	image("./songs/images/play_medium_2_red.png"   ),
	image("./songs/images/play_medium_2_green.png" ),
	song_2.stop_func()                              ,
	song_2.start_func()
);

const song_3_button = radio_button(
	image("./songs/images/play_small_1_border.png" ),
	image("./songs/images/play_small_1_red.png"    ),
	image("./songs/images/play_small_1_green.png"  ),
	song_3.stop_func()                              ,
	song_3.start_func()
);

// const happy_birthday_button = radio_button(
// 	image("./songs/images/play_small_2_border.png" ),
// 	image("./songs/images/play_small_2_red.png"    ),
// 	image("./songs/images/play_small_2_green.png"  ),
// 	happy_birthday.stop_func()                      ,
// 	happy_birthday.start_func(0, .15)
// );

const play_buttons = radio_buttons(
	song_0_button,
	song_1_button,
	song_2_button,
	song_3_button
//	happy_birthday_button
);

const a = [ bg_blue, silence_button, play_buttons ];

const draw = _ => {
    a.forEach(o => { o.draw(); });
	back_button.draw();
};

const click = _ => {
	if (back_button.click()) {
		start_home();
	} else if (a.some(o => { return o.click(); })) {
		draw();
	}
};

const start = _ => {
    on_click  = click;
    on_resize = draw;
    draw();
};

export default start;

