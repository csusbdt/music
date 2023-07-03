import c_img    from "../global/img.js"    ;
import xbutton  from "../global/xbutton.js";

const lower_left_red     = xbutton("lower_left_red");
const lower_left_yellow  = xbutton("lower_left_yellow");
const upper_right_green  = xbutton("upper_right_green");
const upper_right_red    = xbutton("upper_right_red");
const upper_right_blue   = xbutton("upper_right_blue");
const upper_right_yellow = xbutton("upper_right_yellow");

let img = n => new c_img("./home/images/" + n + ".png");

const inner_border = img("inner_ring_border"  );
const inner_red    = img("inner_ring_red"     );
const inner_green  = img("inner_ring_green"   );
const inner_blue   = img("inner_ring_blue"    );
const inner_yellow = img("inner_ring_yellow"  );

const outer_border = img("outer_ring_border"  );
const outer_red    = img("outer_ring_red"     );
const outer_green  = img("outer_ring_green"   );
const outer_blue   = img("outer_ring_blue"    );
const outer_yellow = img("outer_ring_yellow"  );

const big_border_0 = img("big_button_border_0");
const big_border_1 = img("big_button_border_1");
const big_border_2 = img("big_button_border_2");
const big_green_0  = img("big_button_green_0" );
const big_green_1  = img("big_button_green_1" );
const big_green_2  = img("big_button_green_2" );
const big_blue_0   = img("big_button_blue_0"  );
const big_blue_1   = img("big_button_blue_1"  );
const big_blue_2   = img("big_button_blue_2"  );

const red_green_system = {
	inner_i: 0,
	outer_i: 0,
	big_i  : 0,
	draw: function() {
		if (this.inner_i === 0) inner_green.draw();
		else inner_red.draw();
		if (this.outer_i === 0) outer_green.draw();
		else outer_red.draw();
		if (this.big_i === 0) {
			big_green_0.draw();
			big_border_0.draw();
		} else if (this.big_i === 1) {
			big_green_1.draw();
			big_border_1.draw();
		} else if (this.big_i === 2) {
			big_green_2.draw();
			big_border_2.draw();
		}
		inner_border.draw();
		outer_border.draw();
	},
	click: function() {
		if (inner_green.click()) {
			this.inner_i = (this.inner_i === 0 ? 1 : 0);
		} else if (outer_green.click()) {
			this.outer_i = (this.outer_i === 0 ? 1 : 0);
		} else if (big_green_0.click()) {
			this.big_i = 1;
			on_click = null;
			setTimeout(_ => {
				red_green_system.big_i = 2;
				on_resize();
			}, 100);
			setTimeout(_ => {
				red_green_system.big_i = 0;
				if (red_green_system.inner_i === 0 && red_green_system.outer_i === 0) {
					run("./songs/index.js");
				} else if (red_green_system.inner_i === 1 && red_green_system.outer_i === 0) {
					run("./scaled/6/index.js");
				} else if (red_green_system.inner_i === 0 && red_green_system.outer_i === 1) {
					run("./space_shooter/index.js");
				} else if (red_green_system.inner_i === 1 && red_green_system.outer_i === 1) {
					run("./scaled/8/index.js");
				}
			}, 200);
		} else return false;
		return true;
	}
};

const yellow_blue_system = {
	inner_i: 0,
	outer_i: 0,
	big_i  : 0,
	draw: function() {
		if (this.inner_i === 0) inner_blue.draw();
		else inner_yellow.draw();
		if (this.outer_i === 0) outer_blue.draw();
		else outer_yellow.draw();
		if (this.big_i === 0) {
			big_blue_0.draw();
			big_border_0.draw();
		} else if (this.big_i === 1) {
			big_blue_1.draw();
			big_border_1.draw();
		} else if (this.big_i === 2) {
			big_blue_2.draw();
			big_border_2.draw();
		}
		inner_border.draw();
		outer_border.draw();
	},
	click: function() {
		if (inner_blue.click()) {
			this.inner_i = (this.inner_i === 0 ? 1 : 0);
		} else if (outer_blue.click()) {
			this.outer_i = (this.outer_i === 0 ? 1 : 0);
		} else if (big_blue_0.click()) {
			this.big_i = 1;
			on_click = null;
			setTimeout(_ => {
				yellow_blue_system.big_i = 2;
				on_resize();
			}, 100);
			setTimeout(_ => {
				yellow_blue_system.big_i = 0;
				if (yellow_blue_system.inner_i === 0 && yellow_blue_system.outer_i === 0) {
					run("./compose/index.js");
				} else if (yellow_blue_system.inner_i === 1 && yellow_blue_system.outer_i === 1) {
					run("./inst/index.js");
				} else if (yellow_blue_system.inner_i === 1 && yellow_blue_system.outer_i === 0) {
					run("./composer/index.js");
				} else if (yellow_blue_system.inner_i === 0 && yellow_blue_system.outer_i === 1) {
					run("./blob/index.js");
				}
			}, 200);
		} else return false;
		return true;
	}
};

const system = {
	i: 0,
	draw: function() {
		if (this.i === 0) {
			bg_blue.draw();
			red_green_system.draw();
			lower_left_red.draw();
			if (window.start_audio === null) upper_right_red.draw();
			else upper_right_green.draw();
		} else {
			bg_green.draw();
			yellow_blue_system.draw();
			lower_left_yellow.draw();
			if (window.start_audio === null) upper_right_yellow.draw();
			else upper_right_blue.draw();
		}
	},
	click: function() {
		if (lower_left_red.click()) {
			if (this.i === 0) this.i = 1; else this.i = 0;
			return true;
		} else if (upper_right_red.click()) {
			if (window.start_audio !== null) window.start_audio();
			else window.stop_audio();
			return true;
		} else if (this.i === 0) {
			if (red_green_system.click()) return true;
		} else if (this.i === 1) {
			if (yellow_blue_system.click()) return true;
		}
		return false;
	}
};

const click_page = _ => {
	if (system.click()) on_resize();
};

const draw_page = _ => {
	system.draw();
};

export default _ => {
	set_item('page', "./home/index.js");
	on_resize = draw_page;
	on_click = click_page;
	on_resize();
};
