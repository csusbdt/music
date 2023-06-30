import start_template         from "../index.js"              ;
import c_img                  from "../../../global/img.js"   ;
// import { draw_back_button   } from "../../../global/index.js" ;
// import { click_back_button  } from "../../../global/index.js" ;
// import { button             } from "../../../global/index.js" ;
// import { audio_toggle       } from "../../../global/index.js" ;

import xbutton from "../../../global/xbutton.js";

const back_button     = xbutton("upper_left_blue");
const audio_blue      = xbutton("upper_right_blue");
const audio_yellow    = xbutton("upper_right_yellow");

const min_f  = 60;
const max_f  = 900;

//const audio = audio_toggle(_ => tone.start(), _ => tone.stop());

let tone = null;

const binaural = {
	i: 0, 
	bs: [ 0, 3, 6, 11, 24, 96 ],
	togs: [],
	set_i: function(i) {
		if (this.i === i) return;
		this.i = i;
		tone.set_b(this.bs[this.i]);
	},
	draw: function() { 
		this.togs.forEach(a => a[0].draw());
		this.togs[this.i][1].draw(); 
	},
	click: function() {
		for (let i = 0; i < this.togs.length; ++i) {
			if (this.togs[i][0].click()) {
				this.set_i(i);
				return true;
			}
		}
		return false;
	}
};

for (let i = 0; i < binaural.bs.length; ++i) {
	binaural.togs.push([
		xbutton("small_green", -20, 10 + 100 * i), 
		xbutton("small_red"  , -20, 10 + 100 * i)
	]);
}

const grid = {
	x: 200, y: 160, w: 600, h: 600,
	but: xbutton("small_yellow", 200 + 600 / 2 - 120, 160 + 600 / 2 - 200),
	set_xy: function(f) { log("set_xy not implemented"); }, 
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

const click_page = _ => {
	if (click(back_button)) {
		tone.stop();
		start_template();
	} 
	else if (click(audio_blue)) {
		if (window.stop_audio === null) start_audio();
		else window.stop_audio();
		on_resize();
	}
	else if (grid.click() || binaural.click()) on_resize();
};

const draw_page = _ => {
	bg_blue.draw();
	grid.draw();
	binaural.draw();
	window.audio_stop === null ? draw(audio_blue) : draw(audio_yellow);
	draw(back_button);
};

export default o => {
	assert(o !== undefined);
	tone = o;
	tone.start();
	audio.color = audio.color_1;
	let i = binaural.bs.indexOf(tone.b);
	if (i === -1) i = 0;
	binaural.set_i(i);
	grid.set_xy(tone.f);
	on_resize = draw_page;
	on_click  = click_page;
	on_resize();
};
