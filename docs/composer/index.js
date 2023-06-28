import start_home              from "../home/index.js"             ;
import start_template          from "./template/index.js"          ;
import start_grid              from "./grid/index.js"              ;
import { draw_back_button    } from "../global/index.js"           ;
import { click_back_button   } from "../global/index.js"           ;
import { draw_audio_toggle   } from "../global/index.js"           ;
import { click_audio_toggle  } from "../global/index.js"           ;
import { button              } from "../global/index.js"           ;

const template_button = button("medium_yellow" , 100, 500);
const grid_button     = button("medium_yellow", 480, 500);

const click = _ => {
	if (click_back_button()) return start_home();
	else if (template_button.click()) return start_template();
	else if (grid_button.click()) start_grid();
	else if (click_audio_toggle()) on_resize();
};

const draw = _ => {
	bg_blue.draw();
	draw_back_button();
	draw_audio_toggle();
	template_button.draw();
	grid_button.draw();
};

const start = _ => {
	set_item('page', "./composer/index.js");
    on_click  = click;
    on_resize = draw;
    on_resize();
};

export default start;
