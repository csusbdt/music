import start_scaled            from "../index.js"     ;
import start_scaled_6_0        from "./0/index.js"     ;
import start_scaled_6_1        from "./1/index.js"     ;
import { back_button         } from "../../global/index.js" ;
import { draw_audio_toggle   } from "../../global/index.js" ;
import { click_audio_toggle  } from "../../global/index.js" ;
import { large_green_button  } from "../../global/index.js" ;
import { medium_green_button } from "../../global/index.js" ;

const large_button  = large_green_button.clone(100, 200);
const medium_button = medium_green_button.clone(480, 500);

const click = _ => {
	if (back_button.click()) {
		start_scaled();
		return;
	}
	else if (click_audio_toggle()) on_resize();
	else if (medium_button.click()) start_scaled_6_0();
	else if (large_button.click()) start_scaled_6_1();
};

const draw = _ => {
	bg_blue.draw();
	back_button.draw();
	draw_audio_toggle();
	large_button.draw();
	medium_button.draw();
};

const start = _ => {
	set_item('page', "./scaled/6/index.js");
    on_click  = click;
    on_resize = draw;
    on_resize();
};

export default start;
