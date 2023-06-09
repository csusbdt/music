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

const a = [ bg_blue, silence_button, back_button ];


let update_id             = null   ;

let ship_i                = 0      ; 
let explosion_left_i      = null   ; 
let explosion_right_i     = null   ; 
let bullet_left_i         = null   ; 
let bullet_right_i        = null   ; 
let gun_left_i            = 0      ; 
let gun_right_i           = 0      ; 


const click = _ => {
	if (back_button.click()) {
		start_home();
	} else if (a.some(o => { return o.click(); })) {
		draw();
	}
};

//const click = _ => {
// 	const p = design_coords(e);
// 	if (portal_i === 0) {
// 		if (inside_portal(p)) {
// 			portal_i = 1;
//     	} else if (inside_exit(p)) {
// 			stop();
//             start_home();
//     	}
//     } else if (
//         portal_i          === null && 
//         explosion_left_i  === null && 
//         explosion_right_i === null &&
//         bullet_left_i     === null && 
//         bullet_right_i    === null  
//     ) {
//         if (inside_gun_left(p)) {
//             bullet_left_i = 0;
//             gun_left_i    = 1;
//         } else if (inside_gun_right(p)) {
//             bullet_right_i = 0;
//             gun_right_i    = 1;
//         }
//     }
//};

// const exit = _ => {
// 	clearInterval(update_id);
// 	update_id = null;
// };


const draw = _ => {
	a.forEach(o => { o.draw(); });
	back_button.draw();
	
//	draw_blue_bg();
//    draw_green_bg();
//	i_gun_left_border.draw();
	//i_gun_left_blue.draw();
	
// 	if (ship_i === 0) {
// 		draw(i_ship_left);
// 	} else if (ship_i === 1 || ship_i === 3) {
// 		draw(i_ship_middle);
// 	} else if (ship_i === 2) {
// 		draw(i_ship_right);
// 	}

// 	if (explosion_left_i === 0) {
// 		draw(i_explosion_left_0);
// 	} else if (explosion_left_i === 1) {
// 		draw(i_explosion_left_1);
// 	} else if (explosion_left_i === 2) {
// 		draw(i_explosion_left_2);
// 	}
	
// 	if (explosion_right_i === 0) {
// 		draw(i_explosion_right_0);
// 	} else if (explosion_right_i === 1) {
// 		draw(i_explosion_right_1);
// 	} else if (explosion_right_i === 2) {
// 		draw(i_explosion_right_2);
// 	}

// 	draw(i_gun_left_border);
// 	if (gun_left_i === 0) {
// 		draw(i_gun_left_blue);
// 	} else {
// 		draw(i_gun_left_red);
// 	}

// 	draw(i_gun_right_border);
// 	if (gun_right_i === 0) {
// 		draw(i_gun_right_blue);
// 	} else {
// 		draw(i_gun_right_red);
// 	}

// 	if (bullet_left_i === 0) {
// 		draw(i_bullet_left_0);		
// 	} else if (bullet_left_i === 1) {
// 		draw(i_bullet_left_1);		
// 	} else if (bullet_left_i === 2) {
// 		draw(i_bullet_left_0, 0, -140);		
// 	} else if (bullet_right_i === 0) {
// 		draw(i_bullet_right_0);		
// 	} else if (bullet_right_i === 1) {
// 		draw(i_bullet_right_1);		
// 	} else if (bullet_right_i === 2) {
// 		draw(i_bullet_right_0, 0, -120);
// 	} 
	
// 	if (blue_dot_i === 0) {
// 		draw(i_blue_dot);
// 	} 

// 	if (ship_i !== null && ++ship_i === 4) ship_i = 0;

// 	if (bullet_left_i !== null && ++bullet_left_i === 3) {
// 		bullet_left_i = null;
// 	} else if (bullet_left_i === 1)	{
// 		gun_left_i = 0;
// 	} else if (bullet_left_i === 2 && ship_i === 0) {
// 		bullet_left_i = null;
// 		ship_i = null;
// 		explosion_left_i = 0;
// 	} else if (explosion_left_i === 0) {
// 		explosion_left_i = 1;
// 	} else if (explosion_left_i === 1) {
// 		explosion_left_i = 2;
// 	} else if (explosion_left_i === 2) {
// 		explosion_left_i = null;
// 		portal_i = 4;
// 		return;
// 	}
	
// 	if (bullet_right_i !== null && ++bullet_right_i === 3) {
// 		bullet_right_i = null;
// 	} else if (bullet_right_i === 1)	{
// 		gun_right_i = 0;
// 	} else if (bullet_right_i === 2 && ship_i === 2) {
// 		bullet_right_i = null;
// 		ship_i = null;
// 		explosion_right_i = 0;
// 	} else if (explosion_right_i === 0) {
// 		explosion_right_i = 1;
// 	} else if (explosion_right_i === 1) {
// 		explosion_right_i = 2;
// 	} else if (explosion_right_i === 2) {
// 		explosion_right_i = null;
// //		portal_i = 4;
// 		return;
// 	}
};

// const update = _ => {
// };

const start = _ => {
    on_click  = click;
    on_resize = draw;
    draw();

	
	// ship_i            = 0      ;
	// explosion_left_i  = null   ;
	// explosion_right_i = null   ;
	// bullet_left_i     = null   ;
	// bullet_right_i    = null   ;
	// gun_left_i        = 0      ;
	// gun_right_i       = 0      ;
	
//	update_id = setInterval(update, 350);
	
};

export default start;
