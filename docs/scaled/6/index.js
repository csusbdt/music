import xbutton from "../../global/xbutton.js";

const back_button = xbutton("upper_left_green");
const audio_green = xbutton("upper_right_green");
const audio_red   = xbutton("upper_right_red");

const large_button  = xbutton("large_green", 100, 200);
const medium_button = xbutton("medium_green", 480, 500);

const click_page = _ => {
	if (back_button.click()) {
		run("./home/index.js");
		return;
	}
	else if (audio_green.click()) {
		window.stop_audio === null ? window.start_audio() : window.stop_audio();
		on_resize();
	}
	else if (large_button.click()) run("./scaled/6/1/index.js");
	else if (medium_button.click()) run("./scaled/6/0/index.js");
};

const draw_page = _ => {
	bg_blue.draw();
	draw(back_button);
	window.stop_audio === null ? draw(audio_green) : draw(audio_red);
	large_button.draw();
	medium_button.draw();
};

const start = _ => {
	set_item('page', "./scaled/6/index.js");
    on_click  = click_page;
    on_resize = draw_page;
    on_resize();
};

export default start;
