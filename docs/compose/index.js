import start_away           from "../away/index.js"          ;
import start_songs          from "../songs/index.js"         ;
import start_space_shooter  from "../space_shooter/index.js" ;

// tones

const tone_0 = tone(scale(6, 240, 0), 1, 3);

// buttons

const border_img = img("./global/images/upper_left_border.png", 0, 200);
const red_img = img("./global/images/upper_left_yellow.png", 0, 200);
const green_img = img("./global/images/upper_left_yellow.png", 0, 200);
const blue_img = img("./global/images/upper_left_yellow.png", 0, 200);
const yellow_img = img("./global/images/upper_left_yellow.png", 0, 200);
const white_img = img("./global/images/upper_left_yellow.png", 0, 200);
const black_img = img("./global/images/upper_left_yellow.png", 0, 200);

const button_obj = (color, x, y) => {
	const border_img = img("./global/images/upper_left_border.png"       , x, y);
	const color_img  = img("./global/images/upper_left_" + color + ".png", x, y);	
	return objs([color_img, border_img]);
};

const yellow_obj = button_obj("yellow",   0, 200);
const green_obj  = button_obj("green" ,   0, 200);

const button_00_00 = click_seq([green_obj, yellow_obj])

const test = [ button_00_00 ];

const path = n => "./away/far_away/images/" + n + ".png";
const pair = (first, second, on_click) => objs([img(path(first)), img(path(second))], on_click);

const off_all = _ => {
	buttons.forEach(o => {
		if (o.i === 1) {
			o.objs[1].on_click();
			o.i = 0;
		}
	});
};

const off_inner  = pair("green_0", "border_0", _ => tone_0.start());

const on_inner   = pair("white_0", "border_0", _ => tone_0.stop());

const obj_inner = click_seq([off_inner, on_inner]);

const buttons = [ obj_inner, ...test ];

// control

const draw_list  = [ bg_blue, silence_button, back_button, ...buttons ];
const click_list = [          silence_button, back_button, ...buttons ];
const start_list = [                                       ...buttons ];

// const exit_page = next_page => {
// 	off_all();
// 	stop_audio().then(next_page);
// };

export default _ => {
	set_item('page', "./compose/index.js");
	on_resize = _ => draw_list.forEach(o => o.draw());
	on_click = _ => {
		if (back_button.click()) return start_songs();
		else if (click_list.some(o => o.click())) on_resize();
	};
	start_list.forEach(o => o.start());
	on_resize();
};
