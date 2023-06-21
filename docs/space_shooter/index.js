import start_home from "../home/index.js";
import c_img      from "../img.js"       ;
import c_toggle   from "../toggle.js"    ;
import c_button   from "../button.js"    ;

let img = n => new c_img("./global/images/" + n + ".png");

const upper_left_green  = img("upper_left_green"  , 100, 70, 50);
const upper_left_border = img("upper_left_border" , 100, 70, 50);
const audio_red         = img("upper_right_red"   , 900, 60, 50);
const audio_green       = img("upper_right_green" , 900, 60, 50);
const audio_border      = img("upper_right_border", 900, 60, 50);

const back_button  = new c_button(upper_left_green ,upper_left_border);
const audio_toggle = new c_toggle(audio_green, audio_red, audio_border);

img = n => new c_img("./space_shooter/images/" + n + ".png");

const ship = [
	new c_button(img("ship_left_yellow")  , img("ship_left_border"  )),
	new c_button(img("ship_middle_yellow"), img("ship_middle_border")),
	new c_button(img("ship_right_yellow") , img("ship_right_border" )),
	new c_button(img("ship_middle_yellow"), img("ship_middle_border"))
];

const bullet = [
	[
		new c_button(img("bullet_red_0"), img("bullet_border_0")),
		new c_button(img("bullet_red_1"), img("bullet_border_1")),
		new c_button(img("bullet_red_2"), img("bullet_border_2")),
		new c_button(img("bullet_red_3"), img("bullet_border_3")),
		new c_button(img("bullet_red_4"), img("bullet_border_4"))
	], [
		new c_button(img("bullet_red_0"), img("bullet_border_0"), 350, 0),
		new c_button(img("bullet_red_1"), img("bullet_border_1"), 350, 0),
		new c_button(img("bullet_red_2"), img("bullet_border_2"), 350, 0),
		new c_button(img("bullet_red_3"), img("bullet_border_3"), 350, 0),
		new c_button(img("bullet_red_4"), img("bullet_border_4"), 350, 0)
	]
];

const gun_red  = [ 
	img("gun_left_red" , 235, 740, 300, 830), 
	img("gun_right_red", 585, 750, 792, 850) 
];

const explosion = [
	[
		img("left_explosion_0"),
		img("left_explosion_1"),
		img("left_explosion_2"),
		img("left_explosion_3")
	], [
		img("right_explosion_0"),
		img("right_explosion_1"),
		img("right_explosion_2"),
		img("right_explosion_3")
	]
];

const draw_0 = [
	img("window_exterior"),
	img("window_interior"),
	img("gun_left_white"), 
	img("gun_right_white")
];

const draw_1 = [
	img("gun_left_border"), 
	img("gun_right_border"),
	img("window_border"),
	back_button
];

const ship_speed = [ 1000, 500, 300, 200, 150 ];

// app state:
let ship_i       = null;
let gun_i        = null;
let bullet_i     = null;
let explosion_i  = null;
let ship_speed_i = null;
let ship_id      = null;

const start_ship = _ => {
	ship_i = Math.floor(4 * Math.random());
	ship_id = setTimeout(next_ship, ship_speed[ship_speed_i]);
};

const next_ship = _ => {
	assert(ship_i !== null);
	if (++ship_i === 4) ship_i = 0;
	on_resize();
	ship_id = setTimeout(next_ship, ship_speed[ship_speed_i]);
};

const fire_gun = i => {
	gun_i    = i;
	bullet_i = 0;
	setTimeout(next_bullet, 100);
	on_click = null;
};

const next_bullet = _ => {
	if (++bullet_i === 5) {
		bullet_i  = null;
		gun_i     = null;
		on_click = click;
	} else if (bullet_i === 4) {
		if (gun_i === 0 && ship_i === 0 || gun_i === 1 && ship_i === 2) {
			if (++ship_speed_i === ship_speed.length) ship_speed_i = 0;
			clearTimeout(ship_id);
			ship_id     = null;
			ship_i      = null;
			bullet_i    = null;
			explosion_i = 0   ;
			setTimeout(next_explosion, 100);
		} else {
			setTimeout(next_bullet, 100);
		}
	} else {
		setTimeout(next_bullet, 100);
	}
	on_resize();
};

const next_explosion = _ => {
	if (++explosion_i === 4) {
		gun_i        = null;
		explosion_i  = null;
		start_ship();
		on_click = click;
	} else {
		setTimeout(next_explosion, 100);
	}
	on_resize();
};

const draw = _ => {
	draw_0.forEach(o => o.draw());
	if (ship_i !== null) ship[ship_i].draw();
	if (gun_i !== null) {
		if (bullet_i === 0) gun_red[gun_i].draw();
		if (bullet_i !== null) {
			bullet[gun_i][bullet_i].draw();
		} else {
			explosion[gun_i][explosion_i].draw();
		}
	}
	draw_1.forEach(o => o.draw());
	audio_toggle.draw();
};

const click = _ => {
	if (audio_toggle.click()) {
		if (window.stop_audio !== null) {
			window.stop_audio();
			audio_toggle.color = audio_toggle.color_0;
		} else {
			window.start_audio();
			audio_toggle.color = audio_toggle.color_1;
		}
	}
	else if (back_button.click()) {
		clearTimeout(ship_id);
		start_home();
		return;
	}
	else if (gun_red[0].click()) {
		fire_gun(0);
	}
	else if (gun_red[1].click()) {
		fire_gun(1);
	}
	on_resize();
};

const start = _ => {
	gun_i        = null;
	bullet_i     = null;
	explosion_i  = null;
	ship_speed_i = 0   ;
	start_ship();
};

export default _ => {
	if (window.stop_audio === null) {
			audio_toggle.color = audio_toggle.color_0;
	} else {
			audio_toggle.color = audio_toggle.color_1;
	}
	set_item('page', "./space_shooter/index.js");	
	on_resize = draw;
	on_click  = click;
	start();
	on_resize();
};
