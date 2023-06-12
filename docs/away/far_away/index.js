import start_away from "../index.js";
import { wave } from "./wave.js";

// img, obj

const path = n => "./away/far_away/images/" + n + ".png";

const draw_list  = [ bg_blue, silence_button, back_button                  ];
const click_list = [ silence_button, back_button                           ];
const start_list = [                                                       ];
const push       = o => { draw_list.push(o); click_list.push(o); return o; };
const start      = o => { start_list.push(push(o).start()); return o;      };

const f80_border = img(path("f80_border"));
const f80_white  = img(path("f80_white" ));
const f80_green  = img(path("f80_green" ));
const wave80     = wave(180);

const f80_off = start(obj([f80_white, f80_border], function() { 
	this.stop(); 
	f80_on.start();
	wave80.start();
}));

const f80_on  = push (obj([f80_green, f80_border], function() { 
	this.stop(); 
	f80_off.start(); 
	wave80.stop();
}));

export default _ => {
	set_item('page', "./away/far_away/index.js");
	on_resize = _ => draw_list.forEach(o => o.draw());
	on_click = _ => {
		if (back_button.click()) return start_away();
		if (click_list.some(o => o.click())) on_resize();
	};
	start_list.forEach(o => o.start());
	on_resize();
};
