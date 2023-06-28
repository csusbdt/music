import start_home     from "../home/index.js"    ;
import c_img          from "../global/img.js"    ;
import c_tone         from "../global/tone.js"   ;
import xbutton        from "../global/xbutton.js";

const draw = o => o.draw();

const back_button  = xbutton("upper_left_blue"   );
const audio_blue   = xbutton("upper_right_blue"  );
const audio_yellow = xbutton("upper_right_yellow");

let img = n => new c_img("./compose/images/" + n + ".png");

const borders = img("borders");
const b_0     = img("b_0");
const y_0     = b_0.clone_yellow();

let tone_i = 0;
const tone = new c_tone(80, 3, 1);

const click_page = _ => {
	if (back_button.click()) run("../home/index.js");
	if (b_0.click()) {
		if (++tone_i === 2) {
			tone_i = 0;
			tone.stop();
		} else tone.start();
		on_resize();
	}
};

const draw_page = _ => {
	draw(bg_green);
	draw(back_button);
	tone_i === 0 ? draw(b_0) : draw(y_0);
	draw(borders);
};

export default _ => {
	set_item('page', "./test/index.js");
	on_resize = draw_page;
	on_click = click_page;
	on_resize();
};

