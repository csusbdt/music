import start_home from "../home/index.js" ;

function c_image(src, x = 0, y = 0) {
    this.image     = new Image();
    this.image.src = src;
	this.x         = x;
	this.y         = y;
}

c_image.prototype.draw = function() {	
	if (this.image.complete) {
		ctx.drawImage(this.image, this.x, this.y);
	} else {
		this.image.onload = on_resize;
	}
};

const image = (n, x = 0, y = 0) => new c_image("./space_shooter/images/" + n + ".png", x, y);

const ship_border = [ 
	image("ship_left_border"  ), 
	image("ship_middle_border"), 
	image("ship_right_border" ), 
	image("ship_middle_border") 
];

const ship_yellow = [ 
	image("ship_left_yellow"  ), 
	image("ship_middle_yellow"), 
	image("ship_right_yellow" ), 
	image("ship_middle_yellow") 
];

const bullet_red = [
	[
		image("bullet_left_red_0" ), 
		image("bullet_left_red_1" ), 
		image("bullet_left_red_2" ), 
		image("bullet_left_red_3" ), 
		image("bullet_left_red_4" )
	], [
		image("bullet_left_red_0", 350, 0), 
		image("bullet_left_red_1", 350, 0), 
		image("bullet_left_red_2", 350, 0), 
		image("bullet_left_red_3", 350, 0), 
		image("bullet_left_red_4", 350, 0)
	]
];

const bullet_border = [
	[
		image("bullet_left_border_0"), 
		image("bullet_left_border_1"), 
		image("bullet_left_border_2"), 
		image("bullet_left_border_3"), 
		image("bullet_left_border_4")
	], [
		image("bullet_left_border_0", 350, 0), 
		image("bullet_left_border_1", 350, 0), 
		image("bullet_left_border_2", 350, 0), 
		image("bullet_left_border_3", 350, 0), 
		image("bullet_left_border_4", 350, 0)
	]
];

const explosion = [
	[
		image("left_explosion_0"),
		image("left_explosion_1"),
		image("left_explosion_2"),
		image("left_explosion_3")
	], [
		image("right_explosion_0"),
		image("right_explosion_1"),
		image("right_explosion_2"),
		image("right_explosion_3")
	]
];

const ship_speed = [ 1000, 500, 300, 200, 150 ];

// app state:
let ship_i       = null;
let gun_i        = null;
let bullet_i     = null;
let explosion_i  = null;
let ship_speed_i = null;

let ship_id      = null;
let bullet_id    = null;
let explosion_id = null;

const start_ship = _ => {
	ship_i = Math.floor(4 * Math.random());
	ship_id = setInterval(next_ship, ship_speed[ship_speed_i]);
};

const next_ship = _ => {
	assert(ship_i !== null);
	if (++ship_i === 4) ship_i = 0;
	on_resize();
};

const stop_ship = _ => {
	clearInterval(ship_id);
	ship_id = null;
	ship_i  = null;
};

const start_bullet = _ => {
	bullet_i  = 0;
	bullet_id = setInterval(next_bullet, 100);
};

const next_bullet = _ => {
	assert(bullet_i !== null);
	if (++bullet_i === 5) {
		gun_i = null;
		stop_bullet();
	} else if (bullet_i === 4) {
		if (gun_i === 0 && ship_i === 0 || gun_i === 1 && ship_i === 2) {
			stop_ship();
			stop_bullet();
			start_explosion();
			if (++ship_speed_i === ship_speed.length) ship_speed_i = 0;
		}
	}
	on_resize();
};

const stop_bullet = _ => {
	clearInterval(bullet_id);
	bullet_id = null;
	bullet_i  = null;
};

const start_explosion = _ => {
	explosion_i  = 0;
	explosion_id = setInterval(next_explosion, 100);
};

const next_explosion = _ => {
	if (++explosion_i === 4) {
		gun_i = null;
		stop_explosion();
		start_ship();
	}
	on_resize();
};

const stop_explosion = _ => {
	clearInterval(explosion_id);
	explosion_id = null;
	explosion_i  = null;
};

const gun_red  = [ image("gun_left_red" ), image("gun_right_red") ];

const draw_0 = [
	image("window_exterior"),
	image("window_interior"),
	image("gun_left_white"), 
	image("gun_right_white")
];

const draw_1 = [
	image("gun_left_border"), 
	image("gun_right_border"),
	image("window_border"),
	back_button
];

const draw = _ => {
	draw_0.forEach(o => o.draw());
	if (ship_i !== null) {
		ship_border[ship_i].draw();
		ship_yellow[ship_i].draw();
	}
	if (gun_i !== null) {
		if (bullet_i === 0) gun_red[gun_i].draw();
		if (bullet_i !== null) {
			bullet_red[gun_i][bullet_i].draw();
			bullet_border[gun_i][bullet_i].draw();
		} else {
			explosion[gun_i][explosion_i].draw();
		}
	}
	draw_1.forEach(o => o.draw());
};

const click = _ => {
	if (back_button.click()) return exit();
	if (gun_i !== null) return;
	if (click_test(gun_red[0].image)) gun_i = 0;
	else if (click_test(gun_red[1].image)) gun_i = 1;
	else return;
	bullet_i = 0;
	bullet_id = setInterval(next_bullet, 100);
	on_resize();
};

const exit = _ => {
	if (ship_id      !== null) clearInterval(ship_id     );
	if (bullet_id    !== null) clearInterval(bullet_id   );
	if (explosion_id !== null) clearInterval(explosion_id);
	start_home();
}

const start = _ => {
	gun_i        = null;
	bullet_i     = null;
	explosion_i  = null;
	ship_speed_i = 0   ; // 150, 200, 300, 500, 1000
	bullet_id    = null;
	explosion_id = null;
	start_ship();
};

export default _ => {
	set_item('page', "./space_shooter/index.js");	
	on_resize = draw;
	on_click  = click;
	start();
	on_resize();
};
