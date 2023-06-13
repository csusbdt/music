import start_away from "../index.js";
import { wave } from "../wave.js";

// waves

const wave_0 = wave(PHI);
const wave_1 = wave(scale(6, 100, 0));
const wave_2 = wave(scale(6, 100, 1));
const wave_3 = wave(scale(6, 100, 2));
const wave_4 = wave(scale(6, 100, 3));
const wave_5 = wave(scale(6, 100, 4));
const wave_6 = wave(scale(6, 100, 5));

// objs

const path = n => "./away/far_away/images/" + n + ".png";
const pair = (first, second, on_click) => objs([img(path(first)), img(path(second))], on_click);

const on_0   = pair("white_0", "border_0", _ => wave_0.stop());
const on_1   = pair("white_1", "border_1", _ => wave_1.stop());
const on_2   = pair("white_2", "border_2", _ => wave_2.stop());
const on_3   = pair("white_3", "border_3", _ => wave_3.stop());
const on_4   = pair("white_4", "border_4", _ => wave_4.stop());
const on_5   = pair("white_5", "border_5", _ => wave_5.stop());
const on_6   = pair("white_6", "border_6", _ => wave_6.stop());

const off_0  = pair("green_0", "border_0", _ => wave_0.start());
const off_1  = pair("green_1", "border_1", _ => wave_1.start());
const off_2  = pair("green_2", "border_2", _ => wave_2.start());
const off_3  = pair("green_3", "border_3", _ => wave_3.start());
const off_4  = pair("green_4", "border_4", _ => wave_4.start());
const off_5  = pair("green_5", "border_5", _ => wave_5.start());
const off_6  = pair("green_6", "border_6", _ => wave_6.start());

const obj_0 = click_seq([off_0, on_0]);
const obj_1 = click_seq([off_1, on_1]);
const obj_2 = click_seq([off_2, on_2]);
const obj_3 = click_seq([off_3, on_3]);
const obj_4 = click_seq([off_4, on_4]);
const obj_5 = click_seq([off_5, on_5]);
const obj_6 = click_seq([off_6, on_6]);

const buttons = [ obj_0, obj_1, obj_2, obj_3, obj_4, obj_5, obj_6 ];

const exit_page = _ => {
	buttons.forEach(o => {
		if (o.i === 1) {
			o.objs[1].on_click();
			o.i = 0;
		}
	});
	stop_audio().then(start_away);
};

const draw_list  = [ bg_blue, silence_button, back_button, ...buttons ];
const click_list = [          silence_button, back_button, ...buttons ];
const start_list = [                                       ...buttons ];

export default _ => {
	set_item('page', "./away/far_away/index.js");
	on_resize = _ => draw_list.forEach(o => o.draw());
	on_click = _ => {
		if (back_button.click()) exit_page();
		else if (click_list.some(o => o.click())) on_resize();
	};
	start_list.forEach(o => o.start());
	on_resize();
};
