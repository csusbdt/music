import start_home  from "../home/index.js";
import { song_0 }  from "./songs.js"      ;
import { song_1 }  from "./songs.js"      ;
import { song_2 }  from "./songs.js"      ;
import { song_3 }  from "./songs.js"      ;

const back_border = image("./songs/images/back_border.png");
const back_red    = image("./songs/images/back_red.png"   );

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
	song_0.stop_func()                              ,
	song_0.start_func()
);

const song_2_button = radio_button(
	image("./songs/images/play_medium_2_border.png"),
	image("./songs/images/play_medium_2_red.png"   ),
	image("./songs/images/play_medium_2_green.png" ),
	song_0.stop_func()                              ,
	song_0.start_func()
);

const song_3_button = radio_button(
	image("./songs/images/play_small_1_border.png" ),
	image("./songs/images/play_small_1_red.png"    ),
	image("./songs/images/play_small_1_green.png"  ),
	song_0.stop_func()                              ,
	song_0.start_func()
);

const play_buttons = radio_buttons(
	song_0_button,
	song_1_button,
	song_2_button,
	song_3_button
);

const click = _ => {
    if (back_red.click()) {
		p.exit(start_home);
    } else {
        if (play_buttons.click()) draw();
    }
};

const draw = _ => {
    draw_blue_bg()     ;
	play_buttons.draw();
    back_red.draw()    ;
    back_border.draw() ;
};

const start = _ => {
	back_button = once(back_border, back_red);
};

const p = page(draw, click);

export default p.page_start_func;
