import { play, stop } from "./sinc_player.js";

const happy_birthday = [
	[311,0.5,0.84],
	[311,0.5,0.28],
	[349.085697024215,0.5,0.56],
	[311,0.5,0.56],
	[415,0.5,0.56],
	[391.8354465173056,0.5,1.12],
	[311,0.5,0.84],
	[311,0.5,0.28],
	[349.085697024215,0.5,0.56],
	[311,0.5,0.56],
	[465.9735009086481,0.5,0.56],
	[415.13519464688073,0.5,1.12],
	[311,0.5,0.84],
	[311,0.5,0.28],
	[622.0000000000002,0.5,0.56],
	[523.0375702878106,0.5,0.56],
	[415.13519464688073,0.5,0.56],
	[391.8354465173056,0.5,0.56],
	[349.085697024215,0.5,1.12], // fixed
//	[349.085697024215,0.5,0.56], //
	[554.1390026832913,0.5,0.84],
	[554.1390026832913,0.5,0.28],
	[523.0375702878106,0.5,0.56],
	[415.13519464688073,0.5,0.56],
	[465.9735009086481,0.5,0.56],
	[415.13519464688073,0.5,1.12]
];

const off = _ => {
	stop();
};

const on = _ => {
	play(happy_birthday);	
};

const play_button = checkbox(
	image("./songs/images/play_big_border.png"),
	image("./songs/images/play_big_red.png"   ),
	image("./songs/images/play_big_green.png" ),
	off,
	on
);

const a = [ bg_blue, silence_button, play_button ];

const draw = _ => {
    a.forEach(o => { o.draw(); });
	back_button.draw();
};

const click = _ => {
	if (back_button.click()) {
		location = "./";
	} else 
	if (a.some(o => { return o.click(); })) {
		draw();
	}
};

const start = _ => {
    on_click  = click;
    on_resize = draw;
    draw();
};

export default start;
