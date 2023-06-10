import start_home from "../home/index.js" ;

const window_border         = image("./space_shooter/images/window_border.png");
const window_exterior       = image("./space_shooter/images/window_exterior.png");
const window_interior       = image("./space_shooter/images/window_interior.png");

const ship_left_border      = image("./space_shooter/images/ship_left_border.png");
const ship_left_yellow      = image("./space_shooter/images/ship_left_yellow.png");
const ship_middle_border    = image("./space_shooter/images/ship_middle_border.png");
const ship_middle_yellow    = image("./space_shooter/images/ship_middle_yellow.png");
const ship_right_border     = image("./space_shooter/images/ship_right_border.png");
const ship_right_yellow     = image("./space_shooter/images/ship_right_yellow.png");

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

// ship 

const ship_left   = pair(ship_left_yellow, ship_left_border    );
const ship_middle = pair(ship_middle_yellow, ship_middle_border);
const ship_right  = pair(ship_right_yellow, ship_right_border  );

const ship = once(300, _ => { ship.start(); }, [ ship_left, ship_middle, ship_right, ship_middle ]);


// guns 

const gun_speed = 100;

const bullet_left_0 = pair(bullet_left_red_0, bullet_left_border_0);
const bullet_left_1 = pair(bullet_left_red_1, bullet_left_border_1);
const bullet_left_2 = pair(bullet_left_red_2, bullet_left_border_2);
const bullet_left_3 = pair(bullet_left_red_3, bullet_left_border_3);

const bullet_left = once(gun_speed, null, [ bullet_left_0, bullet_left_1, bullet_left_2, bullet_left_3 ]);

const gun_left_button_ready = pair(gun_left_white, gun_left_border, _ => { log('fire'); });
const gun_left_button_red   = pair(gun_left_red  , gun_left_border );
const gun_left_button_white = pair(gun_left_white, gun_left_border );

const gun_left_buttons = [
	gun_left_button_ready,
	button_group([gun_left_button_red  , bullet_left_0]),
	button_group([gun_left_button_white, bullet_left_1]),
	button_group([gun_left_button_white, bullet_left_2]),
	button_group([gun_left_button_white, bullet_left_3])
];

const gun_left_action = _ => { log('hit'); };

const gun_left = anim_button(gun_left_buttons, 100, gun_left_action);

const draw_list  = [ 
	window_interior, window_exterior, 
	ship, gun_left, bullet_left,
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
	ship.start();
    draw();	
};

export default start;

	