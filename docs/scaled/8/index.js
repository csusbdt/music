import start_home              from "../../home/index.js"   ;
//import start_scaled            from "../index.js"           ;
import start_scaled_8_0        from "./0/index.js"          ;
import { large_green_button  } from "../../global/index.js" ;
//import { medium_green_button } from "../../global/index.js" ;
import { draw_back_button    } from "../../global/index.js" ;
import { click_back_button   } from "../../global/index.js" ;
import { draw_audio_toggle   } from "../../global/index.js" ;
import { click_audio_toggle  } from "../../global/index.js" ;

const large_button  = large_green_button.clone(100, 200);
//const medium_button = medium_green_button.clone(480, 500);

const click = _ => {
	if (click_back_button()) {
		start_home();
		return;
	}
	else if (click_audio_toggle()) on_resize();
//	else if (medium_button.click()) start_scaled_6_0();
	else if (large_button.click()) start_scaled_8_0();
};

const draw = _ => {
	bg_blue.draw();
	draw_back_button();
	draw_audio_toggle();
	large_button.draw();
	//medium_button.draw();
};

const start = _ => {
	set_item('page', "./scaled/8/index.js");
    on_click  = click;
    on_resize = draw;
    on_resize();
};

export default start;
