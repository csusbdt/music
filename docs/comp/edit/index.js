import start_comp from "../comp/index.js";
import c_img      from "../img.js";
import c_button   from "../button.js";

const upper_left_green   = new c_img("./global/images/upper_left_green.png"  , 100, 70, 50);
const upper_left_border  = new c_img("./global/images/upper_left_border.png" , 100, 70, 50);
const upper_right_red    = new c_img("./global/images/upper_right_red.png"   , 900, 60, 50);
const upper_right_green  = new c_img("./global/images/upper_right_green.png" , 900, 60, 50);
const upper_right_border = new c_img("./global/images/upper_right_border.png", 900, 60, 50);

const red    = new c_img("./compose/images/red.png"   , 120, 205, 36);
const green  = new c_img("./compose/images/green.png" , 120, 205, 36);
const border = new c_img("./compose/images/border.png", 120, 205, 36);

const back_button            = new c_button(upper_left_green, upper_left_border );

let unit = null;
//const is_playing = _ => unit.is_playing;

const stop_page_audio = _ => {
	if (unit.is_playing()) {
		unit.stop(); 
		stop_page_audio_button.color = upper_right_green;
	} else {
		unit.start();
		stop_page_audio_button.color = upper_right_red;
	}
};

const stop_page_audio_button = new c_button(upper_right_red , upper_right_border, 0, 0, stop_page_audio);


///////////////////////////////////////////////////////////////////////////////

const volume_controller = {
	x: 100,
	y: 200,
	spacing: 100,
	n: 3,
	max_n: 6,
	draw_x: function(i) { return this.x + this.spacing * i; },
	draw_y: function(i) { return this.y; },
	draw: function() {
		for (let i = 0; i < this.max_n; ++i) {
			if (i === this.n) {
				red.draw(this.draw_x(i), this.draw_y(i));
			} else {
				green.draw(this.draw_x(i), this.draw_y(i));
			}
			border.draw(this.draw_x(i), this.draw_y(i));
		}
	},
	click: function() {
		for (let i = 0; i < this.max_n; ++i) {
			if (red.click(this.draw_x(i), this.draw_y(i))) {
				this.n = i;
				unit.volume(this.n / this.max_n)
				return true;
			}
		}
		return false;
	}
};

///////////////////////////////////////////////////////////////////////////////

const click_page = _ => {
	if (back_button.click()) {
		start_comp();
	} 
	else if (stop_page_audio_button.click()) on_resize();
	else if (volume_controller.click()) on_resize();
};

const draw = o => { if (Array.isArray(o)) o.forEach(o => o.draw()); else o.draw(); };

const draw_page = _ => {
	draw(bg_blue);
	draw(back_button);
	draw(stop_page_audio_button);
	draw(volume_controller);
};

export default u => {
	unit = u;
	if (window.stop_page_audio !== null) window.stop_page_audio();
	window.stop_page_audio = stop_page_audio;
	unit.start();
	on_click = click_page;	
	on_resize = draw_page;
	on_resize();
};
