import { play, stop } from "./happy_birthday.js";

const off = _ => {
	stop();
};

const on = _ => {
	play();	
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
