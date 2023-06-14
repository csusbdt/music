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

const image = n => new c_image("./space_shooter/images/" + n + ".png");

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

const left_bullet_red = [
	image("bullet_left_red_0"   ), 
	image("bullet_left_red_1"   ), 
	image("bullet_left_red_2"   ), 
	image("bullet_left_red_3"   ), 
	image("bullet_left_red_4"   )
];

const left_bullet_border = [
	image("bullet_left_border_0"), 
	image("bullet_left_border_1"), 
	image("bullet_left_border_2"), 
	image("bullet_left_border_3"), 
	image("bullet_left_border_4") 
];

// app state:
let ship_i      = null;
let gun_i       = null;
let bullet_i    = null;
let explosion_i = null;

const draw_ship = _ => {
	if (ship_i === null) return;
	const i = Math.floor(ship_i);
	ship_border[i].draw();
	ship_yellow[i].draw();
};


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
	draw_ship();
	draw_1.forEach(o => o.draw());

	if (ship_i !== null && ++ship_i === 4) ship_i = 0;
};

let interval_id = null;

const click = _ => {
	if (back_button.click()) { clearInterval(interval_id); start_home(); }
	if (left_gun_clicked()) {
		
	}
};

const start = _ => {
	ship_i      = 0;
	gun_i       = null;
	bullet_i    = null;
	explosion_i = null;
	interval_id = setInterval(draw, 300);
};

export default _ => {
	set_item('page', "./space_shooter/index.js");	
	on_resize = draw;
	on_click  = click;
	start();
	on_resize();
};






// const left_gun = {
// 	red: image("gun_left_red"),
// 	firing: false,
// 	draw: function() { if (this.firing) this.red.draw(); },
// 	click: function() { 
// 		if (click_gun(this)) {
// 			return true;
// 		} else return false;
// 	}
// };

// const right_gun = {
// 	red: image("gun_right_red"),
// 	firing: false,
// 	draw: function() { if (this.firing) this.red.draw(); },
// 	click: function() { return click_gun(this); }
// };

// function click_gun(o) {
// 	if (click_test(o.red.image)) {
// 		o.firing = true;
// 		setTimeout((_ => { o.firing = false; on_resize() }).bind(o), 100);
// 		return true;
// 	} else return false;	
// }

// const ship = {
// 	border: [ 
// 		image("ship_left_border"  ), 
// 		image("ship_middle_border"), 
// 		image("ship_right_border" ), 
// 		image("ship_middle_border") 
// 	],
// 	yellow: [ 
// 		image("ship_left_yellow"  ), 
// 		image("ship_middle_yellow"), 
// 		image("ship_right_yellow" ), 
// 		image("ship_middle_yellow") 
// 	],
// 	i: 0,
// 	draw: function() { this.yellow[this.i].draw(); this.border[this.i].draw(); },
// 	id: null,
// 	start: function() {
// 		this.id = setInterval((_ => { if (++this.i === 4) this.i = 0; on_resize(); }).bind(this), 300);
// 	}
// };

// const left_bullet = {
// 	border: [ 
// 		image("bullet_left_border_0"), 
// 		image("bullet_left_border_1"), 
// 		image("bullet_left_border_2"), 
// 		image("bullet_left_border_3"), 
// 		image("bullet_left_border_4") 
// 	],
// 	yellow: [ 
// 		image("bullet_left_red_0"   ), 
// 		image("bullet_left_red_1"   ), 
// 		image("bullet_left_red_2"   ), 
// 		image("bullet_left_red_3"   ), 
// 		image("bullet_left_red_4"   )
// 	],
// 	i: null,
// 	draw: function() { 
// 		if (this.i === null) return; 
// 		this.yellow[this.i].draw(); 
// 		this.border[this.i].draw(); 
// 	},
// 	id: null,
// 	start: function() {
// 		this.id = setInterval((_ => {
// 			if (++this.i === 5) {
// 				this.i = 0; 
// 				clearInterval(this.id);
// 				this.id = null;
// 			} else {
// 				on_resize(); 
// 			}).bind(this), 100);
// 	}
// };




// const draw_list  = [
// 	image("window_exterior"),
// 	image("window_interior"),
// 	image("gun_left_white"), image("gun_right_white"),

// 	// left_gun, right_gun,
// 	// left_bullet,

// 	// ship,
// 	image("gun_left_border"), image("gun_right_border"),
// 	image("window_border"),
// 	back_button
// ];

// const click_list = [ 
// 	left_gun, right_gun,
// 	back_button
// ];

// const start_list = [ 
// 	ship
// ];

// const on_exit = _ => {
// };

// export default _ => {
// 	set_item('page', "./space_shooter/index.js");	
// //	on_resize = _ => draw_list.forEach(o => o.draw());
// 	on_resize = draw;
// 	on_click = click;
// 	// _ => {
// 	// 	if (back_button.click()) return start_home();
// 	// 	if (click_list.some(o => o.click())) on_resize();
// 	// };
// //	start_list.forEach(o => o.start());
// 	start();
// 	on_resize();
// };







// c_image.prototype.click = function() {
// 	if (this.started && click_test(this.image, this.x, this.y, this.s)) {
// 		if (this.on_click !== null) this.on_click(this);
// 		return true;
// 	} else {
// 		return false;
// 	}
// };




//
// new obj
//
// start does not start child objs 
//
///////////////////////////////////////////////////////////////////////////////////////////

// function c_o(objs, started = false, on_click = null) {
// 	if (!Array.isArray(objs)) objs = [objs];
// 	this.objs = objs;
// 	this.started = started;
// 	this.on_click = on_click;
// }

// c_o.prototype.start = function() {
// 	this.started = true;
// 	return this;
// };

// c_objs.prototype.stop = function() {
// 	if (this.started) {
// 		this.started = false;
// 		this.objs.forEach(o => o.stop());
// 	}
// 	return this;
// };




// const ship = obj_seq([
// 	objs([ image("ship_left_yellow"  ), image("ship_left_border"  ) ]),
// 	objs([ image("ship_middle_yellow"), image("ship_middle_border") ]),
// 	objs([ image("ship_right_yellow" ), image("ship_right_border" ) ]),
// 	objs([ image("ship_middle_yellow"), image("ship_middle_border") ])
// ], 300, self => self.start());

// const gun_speed = 100;

// const left_gun_ready = objs([ image("gun_left_white"), image("gun_left_border") ], self => {
// 	self.stop();
// 	left_gun_fire.start();
// });

// const left_gun_fire = obj_seq([ image("gun_left_red"), image("gun_left_border") ], gun_speed, self => {
// 	left_gun_ready.start();
// });

// const left_gun = click_seq([
// 	objs([ image("gun_left_white"), image("gun_left_border") ]),
// 	obj_seq(
// 		[ image("gun_left_red"), image("gun_left_border") ],
// 		gun_speed, 
// 		self => {
// 			left_gun.start();
// 		}
// 	)
// ]);


// const left_gun = click_seq([
// 	objs([ image("gun_left_white"), image("gun_left_border") ]),
// 	objs([ image("gun_left_red"  ), image("gun_left_border") ])	
// ], 100, self => self.start());

// const gun_left_border       = img("./space_shooter/images/gun_left_border.png"  );
// const gun_left_red          = img("./space_shooter/images/gun_left_red.png"     );
// const gun_left_white        = img("./space_shooter/images/gun_left_white.png"   );
// const gun_right_border      = img("./space_shooter/images/gun_right_border.png" );
// const gun_right_red         = img("./space_shooter/images/gun_right_red.png"    );
// const gun_right_white       = img("./space_shooter/images/gun_right_white.png"  );

// const gun_left_fire = _ => {
// 	bullet_left.start();
// 	setTimeout(_ => gun_left.set_off(), gun_speed);
// 	setTimeout(_ => {
// 		if (ship.i === 3) {
// 			left_explosion.start();
// 			ship.stop();
// 		}
// 	}, gun_speed * 4);
// };

// const gun_right_fire = _ => {
// 	bullet_right.start();
// 	setTimeout(_ => gun_right.set_off(), gun_speed);
// 	setTimeout(_ => {
// 		if (ship.i === 1) {
// 			right_explosion.start();
// 			ship.stop();
// 		}
// 	}, gun_speed * 4);
// };

// const gun_left = checkbox2(
// 	pair(gun_left_white, gun_left_border), 
// 	pair(gun_left_red  , gun_left_border), 
// 	gun_left_fire
// );

// const gun_right = checkbox2(
// 	pair(gun_right_white, gun_right_border), 
// 	pair(gun_right_red  , gun_right_border), 
// 	gun_right_fire
// );

// bullets

// const bullet_left_border_0  = img("./space_shooter/images/bullet_left_border_0.png");
// const bullet_left_border_1  = img("./space_shooter/images/bullet_left_border_1.png");
// const bullet_left_border_2  = img("./space_shooter/images/bullet_left_border_2.png");
// const bullet_left_border_3  = img("./space_shooter/images/bullet_left_border_3.png");
// const bullet_left_border_4  = img("./space_shooter/images/bullet_left_border_4.png");

// const bullet_right_border_0 = bullet_left_border_0.clone(350, 0);
// const bullet_right_border_1 = bullet_left_border_1.clone(350, 0);
// const bullet_right_border_2 = bullet_left_border_2.clone(350, 0);
// const bullet_right_border_3 = bullet_left_border_3.clone(350, 0);
// const bullet_right_border_4 = bullet_left_border_4.clone(350, 0);

// const bullet_left_red_0     = img("./space_shooter/images/bullet_left_red_0.png");
// const bullet_left_red_1     = img("./space_shooter/images/bullet_left_red_1.png");
// const bullet_left_red_2     = img("./space_shooter/images/bullet_left_red_2.png");
// const bullet_left_red_3     = img("./space_shooter/images/bullet_left_red_3.png");
// const bullet_left_red_4     = img("./space_shooter/images/bullet_left_red_4.png");

// const bullet_right_red_0    = bullet_left_red_0.clone(350, 0);
// const bullet_right_red_1    = bullet_left_red_1.clone(350, 0);
// const bullet_right_red_2    = bullet_left_red_2.clone(350, 0);
// const bullet_right_red_3    = bullet_left_red_3.clone(350, 0);
// const bullet_right_red_4    = bullet_left_red_4.clone(350, 0);

// const bullet_left_0 = pair2(bullet_left_red_0, bullet_left_border_0);
// const bullet_left_1 = pair2(bullet_left_red_1, bullet_left_border_1);
// const bullet_left_2 = pair2(bullet_left_red_2, bullet_left_border_2);
// const bullet_left_3 = pair2(bullet_left_red_3, bullet_left_border_3);
// const bullet_left_4 = pair2(bullet_left_red_4, bullet_left_border_4);

// const bullet_right_0 = pair2(bullet_right_red_0, bullet_right_border_0);
// const bullet_right_1 = pair2(bullet_right_red_1, bullet_right_border_1);
// const bullet_right_2 = pair2(bullet_right_red_2, bullet_right_border_2);
// const bullet_right_3 = pair2(bullet_right_red_3, bullet_right_border_3);
// const bullet_right_4 = pair2(bullet_right_red_4, bullet_right_border_4);

// const bullet_left_objs = [
// 	bullet_left_0,
// 	bullet_left_1,
// 	bullet_left_2,
// 	bullet_left_3,
// 	bullet_left_4	
// ];

// const bullet_right_objs = [
// 	bullet_right_0,
// 	bullet_right_1,
// 	bullet_right_2,
// 	bullet_right_3,
// 	bullet_right_4	
// ];

// const bullet_left  = once2(bullet_left_objs , 100, null);
// const bullet_right = once2(bullet_right_objs, 100, null);

// // explosions

// const left_explosion_0      = img("./space_shooter/images/left_explosion_0.png" );
// const left_explosion_1      = img("./space_shooter/images/left_explosion_1.png" );
// const left_explosion_2      = img("./space_shooter/images/left_explosion_2.png" );
// const left_explosion_3      = img("./space_shooter/images/left_explosion_3.png" );

// const right_explosion_0     = img("./space_shooter/images/right_explosion_0.png");
// const right_explosion_1     = img("./space_shooter/images/right_explosion_1.png");
// const right_explosion_2     = img("./space_shooter/images/right_explosion_2.png");
// const right_explosion_3     = img("./space_shooter/images/right_explosion_3.png");

// const left_explosion = once2([
// 	left_explosion_0,
// 	left_explosion_1,
// 	left_explosion_2,
// 	left_explosion_3
// ], 100, _ => { 
// //	ship.start();
// 	start_home();
// });

// const right_explosion = once2([
// 	right_explosion_0,
// 	right_explosion_1,
// 	right_explosion_2,
// 	right_explosion_3
// ], 100, _ => { 
// //	ship.start();
// 	start_home();
// });

// page start

// const draw_list  = [ 
// 	window_interior,
// 	...left_gun_ready,
// 	// left_gun, // bullet_left, left_explosion, gun_right, bullet_right, right_explosion,
// 	ship, window_exterior, silence_button, back_button, window_border 
// ];

// const click_list = [ silence_button, back_button ]; //, left_gun, gun_right ];

// const start_list = [ 
// 	window_interior, 
// //	left_gun, // bullet_left, left_explosion, gun_right, bullet_right, right_explosion,
// 	ship, window_exterior, window_border 
// ];

// const on_exit = _ => {
// 	left_gun_ready.start();
// };

// export default _ => {
// 	set_item('page', "./space_shooter/index.js");	
// 	on_resize = _ => draw_list.forEach(o => o.draw());
// 	on_click = _ => {
// 		if (back_button.click()) return start_home();
// 		if (click_list.some(o => o.click())) on_resize();
// 	};
// 	start_list.forEach(o => o.start());
// 	on_resize();
// };
