import xbutton from "../../global/xbutton.js";

const back_button     = xbutton("upper_left_blue");
const audio_blue      = xbutton("upper_right_blue");
const audio_yellow    = xbutton("upper_right_yellow");
const template_button = xbutton("medium_yellow", 100, 500);
const grid_button     = xbutton("medium_yellow", 480, 500);

const click_page = _ => {
	if (audio_blue.click()) {
		window.stop_audio === null ? window.start_audio() : window.stop_audio();
		on_resize();
	}
	else if (click(back_button    )) run("./home/index.js");
	else if (click(template_button)) run("./composer/template/index.js");
	else if (click(grid_button    )) run("./composer/grid/index.js");
};

const draw_page = _ => {
	bg_green.draw();
	draw(back_button);
	window.stop_audio === null ? draw(audio_blue) : draw(audio_yellow);
	draw(template_button);
	draw(grid_button);
};

const start = _ => {
	set_item('page', "./composer/index.js");
    on_click  = click_page;
    on_resize = draw_page;
    on_resize();
};

export default start;
