import start_home from "../home/index.js" ;

const bullet_left_border_0  = image("./space_shooter/images/bullet_left_border_0.png");
const bullet_left_border_1  = image("./space_shooter/images/bullet_left_border_1.png");
const bullet_left_border_2  = image("./space_shooter/images/bullet_left_border_2.png");
const bullet_left_border_3  = image("./space_shooter/images/bullet_left_border_3.png");
const bullet_left_border_4  = image("./space_shooter/images/bullet_left_border_4.png");

const bullet_right_border_0 = bullet_left_border_0.clone(350, 0);
const bullet_right_border_1 = bullet_left_border_1.clone(350, 0);
const bullet_right_border_2 = bullet_left_border_2.clone(350, 0);
const bullet_right_border_3 = bullet_left_border_3.clone(350, 0);
const bullet_right_border_4 = bullet_left_border_4.clone(350, 0);

const bullet_left_red_0     = image("./space_shooter/images/bullet_left_red_0.png");
const bullet_left_red_1     = image("./space_shooter/images/bullet_left_red_1.png");
const bullet_left_red_2     = image("./space_shooter/images/bullet_left_red_2.png");
const bullet_left_red_3     = image("./space_shooter/images/bullet_left_red_3.png");
const bullet_left_red_4     = image("./space_shooter/images/bullet_left_red_4.png");

const bullet_right_red_0    = bullet_left_red_0.clone(350, 0);
const bullet_right_red_1    = bullet_left_red_1.clone(350, 0);
const bullet_right_red_2    = bullet_left_red_2.clone(350, 0);
const bullet_right_red_3    = bullet_left_red_3.clone(350, 0);
const bullet_right_red_4    = bullet_left_red_4.clone(350, 0);

const gun_left_border       = image("./space_shooter/images/gun_left_border.png");
const gun_left_red          = image("./space_shooter/images/gun_left_red.png");
const gun_left_white        = image("./space_shooter/images/gun_left_white.png");
const gun_right_border      = image("./space_shooter/images/gun_right_border.png");
const gun_right_red         = image("./space_shooter/images/gun_right_red.png");
const gun_right_white       = image("./space_shooter/images/gun_right_white.png");
const ship_left_border      = image("./space_shooter/images/ship_left_border.png");
const ship_left_yellow      = image("./space_shooter/images/ship_left_yellow.png");
const ship_middle_border    = image("./space_shooter/images/ship_middle_border.png");
const ship_middle_yellow    = image("./space_shooter/images/ship_middle_yellow.png");
const ship_right_border     = image("./space_shooter/images/ship_right_border.png");
const ship_right_yellow     = image("./space_shooter/images/ship_right_yellow.png");

const window_border         = image("./space_shooter/images/window_border.png");
const window_exterior       = image("./space_shooter/images/window_exterior.png");
const window_interior       = image("./space_shooter/images/window_interior.png");

const bullet_left_0 = button(bullet_left_border_0, bullet_left_red_0);
const bullet_left_1 = button(bullet_left_border_1, bullet_left_red_1);
const bullet_left_2 = button(bullet_left_border_2, bullet_left_red_2);
const bullet_left_3 = button(bullet_left_border_3, bullet_left_red_3);

const bullet_left = once(100, null, [ bullet_left_0, bullet_left_1, bullet_left_2, bullet_left_3 ]);

const gun_left_on = _ => {
	setTimeout(_ => { gun_left.on = false; gun_left.draw(); }, 100);
	bullet_left.start();
};

const gun_left = checkbox(gun_left_border, gun_left_white, gun_left_red, null, gun_left_on);

const draw_list  = [ 
	window_interior, window_exterior, 
	gun_left, bullet_left,
	silence_button, back_button, window_border 
];
const draw = _ => {
	draw_list.forEach(o => { 
		if (typeof o === 'object' && o.draw !== undefined) {
			return o.draw(); 
		}
	});
};

const click_list = [ silence_button, back_button, gun_left ];
const click = _ => {
	if (back_button.click()) {
		start_home();
	} else if (click_list.some(o => { 
		if (typeof o === 'object' && o.click !== undefined) {
			return o.click(); 
		} else {
			return false;
		}
	})) draw();
};

const start = _ => {
	set_item('page', "./space_shooter/index.js");
    on_click  = click;
    on_resize = draw;
    draw();	
};

export default start;

	