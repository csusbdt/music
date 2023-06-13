import start_away from "../index.js";
import { wave } from "../wave.js";

// images

const path = n => "./away/far_away/images/" + n + ".png";

const white_0  = img(path("white_0" ));
const white_1  = img(path("white_1" ));
const white_2  = img(path("white_2" ));
const white_3  = img(path("white_3" ));
const white_4  = img(path("white_4" ));
const white_5  = img(path("white_5" ));
const white_6  = img(path("white_6" ));

const green_0  = img(path("green_0" ));
const green_1  = img(path("green_1" ));
const green_2  = img(path("green_2" ));
const green_3  = img(path("green_3" ));
const green_4  = img(path("green_4" ));
const green_5  = img(path("green_5" ));
const green_6  = img(path("green_6" ));

const border_0 = img(path("border_0"));
const border_1 = img(path("border_1"));
const border_2 = img(path("border_2"));
const border_3 = img(path("border_3"));
const border_4 = img(path("border_4"));
const border_5 = img(path("border_5"));
const border_6 = img(path("border_6"));

// waves

const wave_0 = wave(phi);
const wave_1 = wave(scale(6, 100, 0));
const wave_2 = wave(scale(6, 100, 1));
const wave_3 = wave(scale(6, 100, 2));
const wave_4 = wave(scale(6, 100, 3));
const wave_5 = wave(scale(6, 100, 4));
const wave_6 = wave(scale(6, 100, 5));



const button = (border, off_color, on_color, wave) => {
	const o = click_seq(
		obj_list([ obj(off_color)])
}
obj([white_0, border_0], _ => wave_0.start();


// checkboxes

const checkbox = (off_obj, on_obj) => click_seq([ off_obj, on_obj ]);

const obj_0 = checkbox(obj([white_0, border_0], _ => wave_0.start()), obj([green_0, border_0], _ => wave_0.stop ()));
const obj_1 = checkbox(obj([white_1, border_1], _ => wave_1.start()), obj([green_1, border_1], _ => wave_1.stop ()));
const obj_2 = checkbox(obj([white_2, border_2], _ => wave_2.start()), obj([green_2, border_2], _ => wave_2.stop ()));
const obj_3 = checkbox(obj([white_3, border_3], _ => wave_3.start()), obj([green_3, border_3], _ => wave_3.stop ()));
const obj_4 = checkbox(obj([white_4, border_4], _ => wave_4.start()), obj([green_4, border_4], _ => wave_4.stop ()));
const obj_5 = checkbox(obj([white_5, border_5], _ => wave_5.start()), obj([green_5, border_5], _ => wave_5.stop ()));
const obj_6 = checkbox(obj([white_6, border_6], _ => wave_6.start()), obj([green_6, border_6], _ => wave_6.stop ()));

const checkboxes = [ obj_0, obj_1, obj_2, obj_3, obj_4, obj_5, obj_6 ];

const exit_page = _ => {
	checkboxes.forEach(o => {
		if (o.i === 1) {
			o.on_end()
		}
	});
};

const draw_list  = [ bg_blue, silence_button, back_button, obj_0, obj_1, obj_2, obj_3, obj_4, obj_5, obj_6 ];
const click_list = [          silence_button, back_button, obj_0, obj_1, obj_2, obj_3, obj_4, obj_5, obj_6 ];
const start_list = [                                       obj_0, obj_1, obj_2, obj_3, obj_4, obj_5, obj_6 ];

//set_item("./away/far_away/index.js audio_started", false);

export default _ => {
	set_item('page', "./away/far_away/index.js");
//	start_audio();
	on_resize = _ => draw_list.forEach(o => o.draw());
	on_click = _ => {
		if (back_button.click()) {
			// stop_audio_f = _ => {
			// 	[ obj_0, obj_1, obj_2, obj_3, obj_4, obj_5, obj_6 ].forEach(o => o.stop());
			// 	[ wave_0, wave_1, wave_2, wave_3, wave_4, wave_5, wave_6 ].forEach(o => o.stop());
			// };
			stop_audio();
			start_away();
			return;
		}
		if (click_list.some(o => o.click())) on_resize();
	};
	start_list.forEach(o => {
		o.start();
	});
	on_resize();
};
