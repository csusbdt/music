import xbutton from "../global/xbutton.js";

const back_button     = xbutton("upper_left_blue");
const audio_blue      = xbutton("upper_right_blue");
const audio_yellow    = xbutton("upper_right_yellow");

const button_5        = xbutton("medium_blue", 100, 500);
const button_6        = xbutton("medium_blue", 300, 500);
const button_7        = xbutton("medium_blue", 500, 500);

const click_page = _ => {
	if (audio_blue.click()) {
		window.stop_audio === null ? window.start_audio() : window.stop_audio();
		on_resize();
	}
	else if (click(back_button)) run("./home/index.js");
	else if (click(button_5   )) run("./inst/5/index.js");
	else if (click(button_6   )) run("./inst/6/index.js");
	else if (click(button_7   )) run("./inst/7/index.js");
};

const draw_page = _ => {
	bg_green.draw();
	draw(back_button);
	window.stop_audio === null ? draw(audio_blue) : draw(audio_yellow);
	draw(button_5);
	draw(button_6);
	draw(button_7);
};

const start = _ => {
	set_item('page', "./inst/index.js");
    on_click  = click_page;
    on_resize = draw_page;
    on_resize();
};

export default start;
