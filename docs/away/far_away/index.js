import start_away from "../index.js";

// tones

const tone_0 = tone(PHI             , 1, 1);
const tone_1 = tone(scale(6, 100, 0), 1, 3);
const tone_2 = tone(scale(6, 100, 1), 1, 3);
const tone_3 = tone(scale(6, 100, 2), 1, 3);
const tone_4 = tone(scale(6, 100, 3), 1, 3);
const tone_5 = tone(scale(6, 100, 4), 1, 3);
const tone_6 = tone(scale(6, 100, 5), 1, 3);

// buttons

const path = n => "./away/far_away/images/" + n + ".png";
const pair = (first, second, on_click) => objs([img(path(first)), img(path(second))], on_click);

const on_0   = pair("white_0", "border_0", _ => tone_0.stop());
const on_1   = pair("white_1", "border_1", _ => tone_1.stop());
const on_2   = pair("white_2", "border_2", _ => tone_2.stop());
const on_3   = pair("white_3", "border_3", _ => tone_3.stop());
const on_4   = pair("white_4", "border_4", _ => tone_4.stop());
const on_5   = pair("white_5", "border_5", _ => tone_5.stop());
const on_6   = pair("white_6", "border_6", _ => tone_6.stop());

const off_0  = pair("green_0", "border_0", _ => tone_0.start());
const off_1  = pair("green_1", "border_1", _ => tone_1.start());
const off_2  = pair("green_2", "border_2", _ => tone_2.start());
const off_3  = pair("green_3", "border_3", _ => tone_3.start());
const off_4  = pair("green_4", "border_4", _ => tone_4.start());
const off_5  = pair("green_5", "border_5", _ => tone_5.start());
const off_6  = pair("green_6", "border_6", _ => tone_6.start());

const obj_0 = click_seq([off_0, on_0]);
const obj_1 = click_seq([off_1, on_1]);
const obj_2 = click_seq([off_2, on_2]);
const obj_3 = click_seq([off_3, on_3]);
const obj_4 = click_seq([off_4, on_4]);
const obj_5 = click_seq([off_5, on_5]);
const obj_6 = click_seq([off_6, on_6]);

const buttons = [ obj_0, obj_1, obj_2, obj_3, obj_4, obj_5, obj_6 ];

// control

const draw_list  = [ bg_blue, silence_button, back_button, ...buttons ];
const click_list = [          silence_button, back_button, ...buttons ];
const start_list = [                                       ...buttons ];

const exit_page = _ => {
	buttons.forEach(o => {
		if (o.i === 1) {
			o.objs[1].on_click();
			o.i = 0;
		}
	});
	stop_audio().then(start_away);
};

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
