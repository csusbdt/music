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

const gun_left_border       = image("./space_shooter/images/gun_left_border.png"  );
const gun_left_red          = image("./space_shooter/images/gun_left_red.png"     );
const gun_left_white        = image("./space_shooter/images/gun_left_white.png"   );
const gun_right_border      = image("./space_shooter/images/gun_right_border.png" );
const gun_right_red         = image("./space_shooter/images/gun_right_red.png"    );
const gun_right_white       = image("./space_shooter/images/gun_right_white.png"  );

const left_explosion_0      = image("./space_shooter/images/left_explosion_0.png" );
const left_explosion_1      = image("./space_shooter/images/left_explosion_1.png" );
const left_explosion_2      = image("./space_shooter/images/left_explosion_2.png" );
const left_explosion_3      = image("./space_shooter/images/left_explosion_3.png" );

const right_explosion_0     = image("./space_shooter/images/right_explosion_0.png");
const right_explosion_1     = image("./space_shooter/images/right_explosion_1.png");
const right_explosion_2     = image("./space_shooter/images/right_explosion_2.png");
const right_explosion_3     = image("./space_shooter/images/right_explosion_3.png");

// explosions

const left_explosion = once2([
	left_explosion_0,
	left_explosion_1,
	left_explosion_2,
	left_explosion_3
], 100, _ => ship.start());

// ship 

const ship_left   = pair2(ship_left_yellow, ship_left_border    );
const ship_middle = pair2(ship_middle_yellow, ship_middle_border);
const ship_right  = pair2(ship_right_yellow, ship_right_border  );

const ships = [ ship_left, ship_middle, ship_right, ship_middle ];

const ship = loop(ships, 300);

// guns 

const gun_speed = 100;

const bullet_left_0 = pair2(bullet_left_red_0, bullet_left_border_0);
const bullet_left_1 = pair2(bullet_left_red_1, bullet_left_border_1);
const bullet_left_2 = pair2(bullet_left_red_2, bullet_left_border_2);
const bullet_left_3 = pair2(bullet_left_red_3, bullet_left_border_3);
const bullet_left_4 = pair2(bullet_left_red_4, bullet_left_border_4);

const bullet_left_objs = [
	bullet_left_0,
	bullet_left_1,
	bullet_left_2,
	bullet_left_3,
	bullet_left_4	
];

const bullet_left   = once2(bullet_left_objs, 100, null);

const gun_left_fire = _ => {
	bullet_left.start();
	setTimeout(_ => gun_left.set_off(), gun_speed);
	setTimeout(_ => {
		if (ship.i === 3) {
			left_explosion.start();
			ship.stop();
		}
	}, gun_speed * 4);
};
const gun_left = checkbox2(pair(gun_left_white, gun_left_border), pair(gun_left_red, gun_left_border), gun_left_fire);

const draw_list  = [ 
	window_interior, ship, gun_left, bullet_left, left_explosion,
	silence_button, back_button, window_exterior, window_border 
];

const draw = _ => {
	draw_list.forEach(o => o.draw());
};

const click_list = [ silence_button, back_button, gun_left ];
const click = _ => {
	if (back_button.click()) return start_home();                    // CHECK
	if (click_list.some(o => o.click())) draw(); // maybe not needed, or remove from constructors
};

const start = _ => {
	set_item('page', "./space_shooter/index.js");
    on_click  = click;
    on_resize = draw;
	ship.start();
    draw();	
};

export default start;

	