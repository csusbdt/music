import start_home     from "../home/index.js";
import song           from "./song.js";

const song_0 = song([	
	[ 77, 0.50, 0.86],
	[ 52, 0.34, 0.60],
	[ 49, 0.62, 0.22],
	[ 90, 0.44, 0.56],
	[259, 0.31, 0.43],
	[193, 0.67, 0.37],
	[ 65, 0.68, 0.32],
	[ 55, 0.45, 0.29],
	[152, 0.32, 0.28],
	[248, 0.26, 0.23],
	[273, 0.24, 0.26],
	[330, 0.23, 0.28],
	[446, 0.23, 0.25],
	[408, 0.38, 0.25],
	[246, 0.52, 0.24],
	[153, 0.46, 0.23],
	[134, 0.34, 0.27],
	[ 97, 0.30, 0.70]
]);

const song_1 = song([
	[ 77, 0.50, 0.86],
	[ 52, 0.34, 0.86],
	[ 77, 0.62, 0.86],
	[ 52, 0.44, 0.43],
	[260, 0.31, 0.43],
	[193, 0.67, 0.86],
	[340, 0.41, 0.21],
	[293, 0.31, 0.21],
	[260, 0.41, 0.43],
	[340, 0.65, 0.32],
	[177, 0.68, 0.86],
	[135, 0.45, 0.43],
	[152, 0.32, 0.21],
	[248, 0.26, 0.22]
]);

// const song_2 = [
//     [170, .39, 1.00],
// 	[ 47, .52, 1.00],
// 	[ 65, .42, 1.00],
// 	[ 81, .69, 1.00],
// 	[239, .48, 1.00],
// 	[ 96, .18, 1.00],
// 	[ 51, .42, 1.00],
// 	[ 69, .66, 1.00]
// ];

// const song_3 = [
//     [127, 0.25, .59],
//     [249, 0.52, .40],
//     [335, 0.34, .40],
//     [108, 0.41, .51],
//     [142, 0.62, .22],
//     [201, 0.59, .26],
//     [172, 0.38, .40]
// ];



///////////////////////////////////////////////////////////////////////////////////////////////


const back_border      = image("./songs/images/back_border.png");
const back_red         = image("./songs/images/back_red.png");


const song_0_button = radio_button(
	image("./songs/images/play_big_border.png", 0, 0, 1                     ),
	image("./songs/images/play_big_red.png"   , 0, 0, 1, song_0.start_func()),
	image("./songs/images/play_big_green.png" , 0, 0, 1, song_0.stop_func ())
);

const song_1_button = radio_button(
	image("./songs/images/play_medium_1_border.png", 0, 0, 1                     ),
	image("./songs/images/play_medium_1_red.png"   , 0, 0, 1, song_0.start_func()),
	image("./songs/images/play_medium_1_green.png" , 0, 0, 1, song_0.stop_func ())
);

const play_buttons = radio_buttons(
	song_0_button,
	song_1_button
);

const click = _ => {
    if (back_red.click()) {
		p.exit(start_home);
    } else {
        if (play_buttons.click()) p.draw();
    }
};

const draw = _ => {
    draw_blue_bg();
	play_buttons.draw();
    back_red.draw();
    back_border.draw();
};

const p = page(draw, click);

export default p.page_start();
