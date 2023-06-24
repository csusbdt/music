import start_template         from "../index.js"              ;
import c_img                  from "../../../global/img.js"   ;
import { draw_back_button   } from "../../../global/index.js" ;
import { click_back_button  } from "../../../global/index.js" ;
import { button             } from "../../../global/index.js" ;

const min_f  = 60;
const max_f  = 900;

let tone = null;

const grid = {
	x: 200, y: 160, w: 600, h: 600,
	but: button("small_yellow", 200 + 600 / 2 - 120, 160 + 600 / 2 - 200),
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
	if (click_back_button()) {
		tone.stop();
		start_template();
	} 
	else if (grid.click()) on_resize();
};

const draw_page = _ => {
	bg_blue.draw();
	grid.draw();
	draw_back_button();
};

export default o => {
	tone = o;
	tone.start();
	on_resize = draw_page;
	on_click  = click_page;
	on_resize();
};
