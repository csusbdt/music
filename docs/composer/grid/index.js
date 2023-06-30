import start_composer from "../index.js"            ;
import c_img          from "../../global/img.js"    ;
import c_tone         from "../../global/tone.js"   ;
import xbutton        from "../../global/xbutton.js";

const back_button  = xbutton("upper_left_blue");
const audio_blue   = xbutton("upper_right_blue");
const audio_yellow = xbutton("upper_right_yellow");

const min_f  = 60;
const max_f  = 900;

const tone = new c_tone(108, 3, .5); // init better!!!!!!!!!!!!!

const grid = {
	x: 200, y: 160, w: 600, h: 600,
	but: xbutton("small_yellow", 200 + 600 / 2 - 120, 160 + 600 / 2 - 200),
	draw: function() {
		ctx.fillStyle = rgb_white;
		ctx.fillRect(this.x, this.y, this.w, this.h);
		this.but.draw();
	},
	click: function() {
		if (click_x >= this.x - 40 && click_x <= this.x + this.w + 40 && 
			click_y >= this.y - 40 && click_y <= this.y + this.h + 40
		) {
			let x = click_x;
			let y = click_y;
			if (x < this.x) x = this.x;
			if (x > this.x + this.w) x = this.x + this.w;
			if (y < this.y) y = this.y;
			if (y > this.y + this.h) y = this.y + this.h;
			this.but.x = x - this.but.color.cx;
			this.but.y = y - this.but.color.cy;
			const f_percent = Math.pow((y - this.y) / this.h, 2);
			const v_percent = (x - this.x) / this.w;			
			tone.set_f(min_f + (max_f - min_f) * f_percent);
			tone.set_v(v_percent);
			return true;
		} else return false;
	}
};

const is_silent = _ => !tone.is_playing();
const would_be_silent = _ => false;

const stop_audio = _ => {
	assert((window.start_audio === null) !== (window.stop_audio === null));
	window.start_audio = start_audio;
	window.stop_audio = null;
	tone.stop();
};

const start_audio = _ => {
	assert((window.start_audio === null) !== (window.stop_audio === null));
	window.start_audio = null;
	window.stop_audio = stop_audio;
	tone.start();
};

let start_external_audio = null;

const click_page = _ => {
	if (audio_blue.click()) {
		if (window.stop_audio === null) start_audio();
		else window.stop_audio();
		on_resize();
	}
	else if (click(back_button)) {
		exit(start_composer);
	} 
	else if (grid.click()) {
		if (window.stop_audio === null) start_audio();
		on_resize();
	}
	start_external_audio = null;
};

const draw_page = _ => {
	draw(bg_green);
	grid.draw();
	draw(back_button);
	window.stop_audio === null ? draw(audio_blue) : draw(audio_yellow);
};

const exit = next_page => {
	if (start_external_audio !== null) start_external_audio();
	next_page();
};

export default _ => {
	if (window.stop_audio !== null && window.stop_audio !== stop_audio) {
		window.stop_audio();
		start_external_audio = window.start_audio;
		window.start_audio = start_audio;
	} else {
		start_external_audio = null;
	}
	set_item('page', "./composer/grid/index.js");
	on_resize = draw_page;
	on_click = click_page;
	on_resize();
};
