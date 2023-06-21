import start_away from "../index.js";
import c_img      from "../global/img.js";
import c_button   from "../global/button.js";

const upper_left_green   = new c_img("./global/images/upper_left_green.png"  , 100, 70, 50);
const upper_left_border  = new c_img("./global/images/upper_left_border.png" , 100, 70, 50);
const upper_right_green  = new c_img("./global/images/upper_right_green.png" , 900, 60, 50);
const upper_right_border = new c_img("./global/images/upper_right_border.png", 900, 60, 50);

const red    = new c_img("./compose/images/red.png"   , 120, 205, 36);
const border = new c_img("./compose/images/border.png", 120, 205, 36);

const back_button            = new c_button(upper_left_green , upper_left_border );
const stop_page_audio_button = new c_button(upper_right_green, upper_right_border);
const comp_0_button          = new c_button(red , border, 260, 320);
//const comp_1_button          = new c_button(red , border, 460, 320);

const click_page = _ => {
	if (back_button.click()) {
		start_home();
	} else if (stop_page_audio_button.click()) {
		if (window.stop_page_audio !== null) window.stop_page_audio();
	} else if (comp_0_button.click()) {
		start_comp(0);
	// } else if (comp_1_button.click()) {
	// 	start_comp(1);
	}
};

const draw_page = _ => {
	bg_blue.draw();

	comp_0_button.draw();
	//comp_1_button.draw();
	
	back_button.draw();
	stop_page_audio_button.draw();
};

export default _ => {
	set_item('page', "./comp/index.js");
	on_click = click_page;	
	on_resize = draw_page;
	on_resize();
};
