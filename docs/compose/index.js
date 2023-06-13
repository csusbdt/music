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

const exit_page = next_page => {
	off_all();
	stop_audio().then(next_page);
};

// const exit_page = next_page => {
// 	buttons.forEach(o => {
// 		if (o.i === 1) {
// 			o.objs[1].on_click();
// 			o.i = 0;
// 		}
// 	});
// 	stop_audio().then(next_page);
// };

export default _ => {
	set_item('page', "./compose/index.js");
	on_resize = _ => draw_list.forEach(o => o.draw());
	on_click = _ => {
		if (back_button.click()) exit_page(start_songs);
		else if (click_list.some(o => o.click())) on_resize();
	};
	start_list.forEach(o => o.start());
	on_resize();
};



// const inner_border = img("./home/images/inner_ring_border.png");
// const inner_red    = img("./home/images/inner_ring_red.png"   );
// const inner_green  = img("./home/images/inner_ring_green.png" );

// const outer_border = img("./home/images/outer_ring_border.png");
// const outer_red    = img("./home/images/outer_ring_red.png"   );
// const outer_green  = img("./home/images/outer_ring_green.png" );

// const inner_ring = checkbox2(pair2(inner_border, inner_red), pair2(inner_border, inner_green));
// const outer_ring = checkbox2(pair2(outer_border, outer_red), pair2(outer_border, outer_green));

// const big_button_border   = img("./home/images/big_button_border.png"  );
// const big_button_border_1 = img("./home/images/big_button_border_1.png");
// const big_button_border_2 = img("./home/images/big_button_border_2.png");
// const big_button_red      = img("./home/images/big_button_red.png"     );
// const big_button_red_1    = img("./home/images/big_button_red_1.png"   );
// const big_button_red_2    = img("./home/images/big_button_red_2.png"   );

// const big_buttons = [
//     pair(big_button_border  , big_button_red  ),
//     pair(big_button_border_1, big_button_red_1),
//     pair(big_button_border_2, big_button_red_2)
// ];

// const big_action = _ => {
//     if (inner_ring.on && outer_ring.on) {
//         start_space_shooter();
//     } else if (inner_ring.on || outer_ring.on) {
//         start_away();
//     } else {
//         start_songs();
//     }
// };

// const big_button = anim_button(big_buttons, 100, big_action);

// const draw_list = [ bg_blue, silence_button, inner_ring, outer_ring, big_button ];
    
// const draw = _ => {
// 	draw_list.forEach(o => { 
// 		if (typeof o === 'object' && o.draw !== undefined) {
// 			return o.draw(); 
// 		}
// 	});
// };

// const click_list = [ silence_button, inner_ring, outer_ring, big_button ];

// const click = _ => {
// 	if (click_list.some(o => { 
// 		if (typeof o === 'object' && o.click !== undefined) {
// 			return o.click(); 
// 		} else {
// 			return false;
// 		}
// 	})) draw();
// };

// const start = _ => {
//     on_click  = click;
//     on_resize = draw;
//     draw();
// };

// export default start;
