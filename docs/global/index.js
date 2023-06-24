import c_img       from "./img.js"   ;
import c_button    from "./button.js";
import c_toggle    from "./toggle.js";

const img = (n, cx = 0, cy = 0, cr = 0, bottom = null) => {
	return new c_img("./global/images/" + n + ".png", cx, cy, cr, bottom);
};

export const upper_left_green   = img("upper_left_green"  , 100, 70, 50);
//export const upper_left_yellow  = img("upper_left_yellow" , 100, 70, 50);
export const upper_left_border  = img("upper_left_border" , 100, 70, 50);

export const upper_right_green  = img("upper_right_green" , 900, 60, 50);
export const upper_right_red    = img("upper_right_red"   , 900, 60, 50);
//export const upper_right_yellow = img("upper_right_yellow", 900, 60, 50);
export const upper_right_border = img("upper_right_border", 900, 60, 50);

// export const lower_left_green   = img("lower_left_green"  , 87, 920, 50);
// export const lower_left_yellow  = img("lower_left_yellow" , 87, 920, 50);
// export const lower_left_border  = img("lower_left_border" , 87, 920, 50);

// export const lower_right_green  = img("lower_right_green" , 922, 922, 50);
// export const lower_right_yellow = img("lower_right_yellow", 922, 922, 50);
// export const lower_right_border = img("lower_right_border", 922, 922, 50);

export const audio_green  = upper_right_green ;
export const audio_red    = upper_right_red   ;
export const audio_border = upper_right_border;

export const small_green  = img("small_green" , 120, 200, 40);
export const small_red    = img("small_red"   , 120, 200, 40);
export const small_blue   = img("small_blue"  , 120, 200, 40);
export const small_yellow = img("small_yellow", 120, 200, 40);
export const small_white  = img("small_white" , 120, 200, 40);
export const small_border = img("small_border", 120, 200, 40);

export const medium_green    = img("medium_green"   , 160, 240,  80);
export const medium_yellow   = img("medium_yellow"  , 160, 240,  80);
export const medium_border   = img("medium_border"  , 160, 240,  80);
export const large_green     = img("large_green"    , 220, 260, 150);
export const large_border    = img("large_border"   , 220, 260, 150);
export const gigantic_green  = img("gigantic_green" , 512, 512, 250);
export const gigantic_red    = img("gigantic_red"   , 512, 512, 250);
export const gigantic_border = img("gigantic_border", 512, 512, 250);

export const small_green_button  = new c_button(small_green , small_border);
export const small_red_button    = new c_button(small_red   , small_border);
export const small_yellow_button = new c_button(small_yellow, small_border);
export const small_blue_button   = new c_button(small_blue  , small_border);
export const small_white_button  = new c_button(small_white , small_border);

export const medium_green_button   = new c_button(medium_green  , medium_border  );
export const medium_yellow_button  = new c_button(medium_yellow , medium_border  );
export const large_green_button    = new c_button(large_green   , large_border   );
export const gigantic_green_button = new c_button(gigantic_green, gigantic_border);

/////////////////////////////////////////////////////////////////////////////////////
//
// add buttons as needed
//
/////////////////////////////////////////////////////////////////////////////////////

const colors = new Map();
colors.set("medium_green" , medium_green );
colors.set("medium_yellow", medium_yellow);
colors.set("small_green"  , small_green  );
colors.set("small_red"    , small_red    );
colors.set("small_yellow" , small_yellow );
colors.set("small_white"  , small_white  );
colors.set("audio_green"  , audio_green  );
colors.set("audio_red"    , audio_red    );

const borders = new Map();
borders.set("medium_green" , medium_border);
borders.set("medium_yellow", medium_border);
borders.set("small_green"  , small_border );
borders.set("small_red"    , small_border );
borders.set("small_yellow" , small_border );
borders.set("small_white"  , small_border );
borders.set("audio_green"  , audio_border );
borders.set("audio_red"    , audio_border );

export const button = (color_name, x = 0, y = 0) => {
	assert(colors.has(color_name) && borders.has(color_name));
	return new c_button(colors.get(color_name), borders.get(color_name), x, y);
};

const back_button = new c_button(upper_left_green, upper_left_border);

export const draw_back_button = _ => {
	back_button.draw();
};

export const click_back_button = (start_next_page = null) => {
	if (back_button.click()) {
		if (start_next_page !== null) start_next_page();
		return true;
	} else {
		return false;
	}
};

//////////////////////////////////////////////////////////////////////////////////
//
// c_togglez
//
//////////////////////////////////////////////////////////////////////////////////

// const c_togglez = (colors, border = null, x = 0, y = 0, actions = null) => {
// 	if (!Array.isArray(colors)) colors = [colors];
// 	this.colors = colors;
// 	this.i = 0;
// 	this.x = x;
// 	this.y = y;
// 	if (actions === null) actions = Array(colors.length).fill(null);
// 	else if (!Array.isArray(actions)) actrions = [actions];
// 	this.actions = actions;
// }

// c_togglez.prototype.draw = _ => {
// 	if (this.border !== null) this.border.draw();
// 	this.colors[this.i].draw();
// };

// c_togglez.prototype.click = _ => {
// 	if (this.colors[this.i].click()) {
// 		const action = this.actions[this.i];
// 		++this.i; // increment before action in case action draws
// 		if (action !== null) action();
// 		return true;
// 	} return false;
// };

// c_togglez.prototype.click = _ => {
// 	if (this.colors[this.i].click()) {
// 		++this.i;
// 		return true;
// 	} return false;
// };

// export const toggle = (colors, border = null, x = 0, y = 0, actions = null) => {
// 	return new c_togglez(colors, border, x, y, actions);
// };

// export const audio_green  = upper_right_green ;
// export const audio_red    = upper_right_red   ;
// export const audio_border = upper_right_border;

// export const create_audio_toggle = (
// 	start = _ => window.audio_start(), 
// 	stop  = _ => window.audio_start()
// ) => new c_togglez([audio_green, audio_red], audio_border, [start, stop]);
	
//////////////////////////////////////////////////////////////////////////////////

export const audio_toggle = (a0, a1) => new c_toggle(audio_green, audio_red, audio_border, a0, a1);	

const x_audio_toggle = new c_toggle(upper_right_green, upper_right_red, upper_right_border);

export const draw_audio_toggle = _ => {
    if (window.start_audio === null) x_audio_toggle.color = x_audio_toggle.color_1; 
	else x_audio_toggle.color = x_audio_toggle.color_0;
    x_audio_toggle.draw();
};

export const click_audio_toggle = (start_audio = null, stop_audio = null) => {
    if (x_audio_toggle.click()) {		
		if (x_audio_toggle.color === x_audio_toggle.color_1) {
			if (start_audio !== null) start_audio();
			else window.start_audio();
		} else {
			if (stop_audio !== null) stop_audio();
			else window.stop_audio();
		}
        return true;
    } else {
        return false;
    }
};
