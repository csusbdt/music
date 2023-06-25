import start_compose           from "../compose/index.js";
import start_inst              from "../inst/index.js"         ;
import start_composer          from "../composer/index.js"     ;
import start_songs             from "../songs/index.js"        ;
import start_space_shooter     from "../space_shooter/index.js";
import start_scaled            from "../scaled/index.js"       ;
import c_img                   from "../global/img.js"         ;
import c_toggle                from "../global/toggle.js"      ;
import { draw_audio_toggle   } from "../global/index.js"       ;
import { click_audio_toggle  } from "../global/index.js"       ;
import { button              } from "../global/index.js"       ;

let img = n => new c_img("./home/images/" + n + ".png");

const inner_border = img("inner_ring_border"  );
const inner_red    = img("inner_ring_red"     );
const inner_green  = img("inner_ring_green"   );
const inner_yellow = img("inner_ring_yellow"  );

const outer_border = img("outer_ring_border"  );
const outer_red    = img("outer_ring_red"     );
const outer_green  = img("outer_ring_green"   );
const outer_yellow = img("outer_ring_yellow"  );

const big_border   = img("big_button_border"  );
const big_border_1 = img("big_button_border_1");
const big_border_2 = img("big_button_border_2");
const big_green    = img("big_button_green"   );
const big_green_1  = img("big_button_green_1" );
const big_green_2  = img("big_button_green_2" );

img = n => new c_img("./global/images/" + n + ".png");

const big_action = _ => {
	if (mode_toggle.i === 0) {
	    if (inner_ring.i === 0 && outer_ring.i === 0) {
	        start_songs();
		} else if (inner_ring.i === 1 && outer_ring.i === 0) {
	        start_scaled();
		} else if (inner_ring.i === 0 && outer_ring.i === 1) {
			start_composer();
		} else if (inner_ring.i === 1 && outer_ring.i === 1) {
	        start_space_shooter();
		}
	} else {
	    if (inner_ring.i === 0 && outer_ring.i === 0) {
	        start_inst();
		} else if (inner_ring.i === 1 && outer_ring.i === 0) {
	        start_inst();
		} else if (inner_ring.i === 0 && outer_ring.i === 1) {
			start_compose();
		} else if (inner_ring.i === 1 && outer_ring.i === 1) {
	        start_inst();
		}		
	}
};

const big_button = {
	i: 0,
	draw: function() {
		[ big_green , big_green_1   , big_green_2    ][this.i].draw();
		[ big_border, big_border_1, big_border_2 ][this.i].draw();
	},
	click: function() {
		if (big_green.click()) {
			on_click = null;
			this.i = 1;
			setTimeout(_ => { this.i = 2; on_resize(); }, 100);
			setTimeout(_ => { this.i = 0; big_action(); }, 200);
			return true;
		} else return false;
	}
};

const inner_ring = {
	i: 0,
	draw: function() {
		if (mode_toggle.i === 0) 
			if (this.i === 0) inner_green.draw(); else inner_red.draw();
		else 
			if (this.i === 0) inner_green.draw(); else inner_yellow.draw();
		inner_border.draw();
	},
	click: function() {
		if (inner_red.click()) {
			if (mode_toggle.i === 0) 
				if (this.i === 0) this.i = 1; else this.i = 0;
			else 
				if (this.i === 0) this.i = 1; else this.i = 0;
			return true;
		} else return false;
	}
};

const outer_ring = {
	i: 0,
	draw: function() {
		if (mode_toggle.i === 0) 
			if (this.i === 0) outer_green.draw(); else outer_red.draw();
		else 
			if (this.i === 0) outer_green.draw(); else outer_yellow.draw();
		outer_border.draw();
	},
	click: function() {
		if (outer_green.click()) {
			if (mode_toggle.i === 0) 
				if (this.i === 0) this.i = 1; else this.i = 0;
			else 
				if (this.i === 0) this.i = 1; else this.i = 0;
			return true;
		} return false;
	}
};

const mode_toggle = {
	i  : 0,
	red : button("lower_left_red"),
	yellow: button("lower_left_yellow"),
	draw: function() {
		if (this.i === 0) this.red.draw();
		else this.yellow.draw();
	},
	click: function() {
		if (this.red.click()) {
			if (this.i === 0) this.i = 1; 
			else this.i = 0;
			return true;
		} else return false;
	}
};

const click = _ => {
	if (click_audio_toggle()) {
		on_resize();
	}
	else if (inner_ring.click() || outer_ring.click() || mode_toggle.click()) on_resize();
	else big_button.click();
};

const draw = _ => {
	bg_blue.draw();
	draw_audio_toggle();
	inner_ring.draw();
	outer_ring.draw();
	big_button.draw();
	mode_toggle.draw();
};

export default _ => {
	set_item('page', "./home/index.js");
	on_resize = draw;
	on_click = click;
	on_resize();
};
