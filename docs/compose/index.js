import start_home from "../home/index.js";

function c_img(src, x = 0, y = 0) {
    this.image     = new Image();
    this.image.src = src;
	this.x         = x;
	this.y         = y;
}

c_img.prototype.draw = function(x = 0, y = 0) {	
	if (this.image.complete) {
		ctx.drawImage(this.image, this.x + x, this.y + y);
	} else {
		this.image.onload = on_resize;
	}
};

const img   = (  n, x = 0, y = 0) => new c_img("./compose/images/" + n + ".png", x, y);
const click = (img, x = 0, y = 0) => click_test(img.image, img.x + x, img.y + y);

const red    = img("red"   ); 
const green  = img("green" ); 
const blue   = img("blue"  ); 
const yellow = img("yellow"); 
const white  = img("white" ); 
const black  = img("black" ); 
const border = img("border"); 

const cols = 7;
const rows = 6;

const row_y = row => 14 + 130 * row;
const col_x = col => 0 + 122 * col;

const waves = [];


// const waver_tone_0 = tone(PHI, 1, 0);
// const waver_tone_0 = tone(scale(6, 240, 0), 1, 3);


const click_buttons = _ => {
	for (let col = 0; col < cols; ++col) {
		for (let row = 0; row < rows; ++row) {
			if (click(red, col_x(col), row_y(row))) {
				waves[0].start();
				on_resize();
				return;
			}
		}
	}
};

const draw_colors = _ => {
	for (let col = 0; col < cols; ++col) {
		for (let row = 0; row < rows; ++row) {
			if (waves.length === 0) {
				white.draw(col_x(col), row_y(row));			
			} else {
				yellow.draw(col_x(col), row_y(row));
			}
		}
	}
};

const draw_borders = _ => {
	for (let col = 0; col < cols; ++col) {
		for (let row = 0; row < rows; ++row) {
			border.draw(col_x(col), row_y(row));
		}		
	}
};

const stop_waves = (cb = null) => {
	assert(waves.length !== 0);
	assert(window.stop_page_audio === null);
	waves.length = 0;
	stop_audio(cb);
};

const start_waves = _ => {
	assert(waves.length === 0);
	assert(on_resize = draw_page);
	assert(on_click === click_page);
	if (window.stop_page_audio !== null) {
		on_click = null;
		window.stop_page_audio(_ => {
			assert(window.stop_page_audio === null);
			on_click = click_page;
			start_waves();
		});
	} else {
		start_audio();
		for (let col = 0; col < cols; ++col) {
			waves.push(tone(120, 1, 3));
		}
		click_page();
	}
};

const stop_page_audio = (cb = null) => {
	assert(on_resize !== draw_page); 
	assert(waves.length !== 0);
	window.stop_page_audio = null;
	stop_waves(cb);
};

const click_page = _ => {
	if (back_button.click()) {
		window.stop_page_audio = stop_page_audio;
		start_home();
	} 
	else if (waves.length === 0) start_waves();
	else click_buttons();
};

const draw_page = _ => {
	bg_blue.draw();
	back_button.draw();
	draw_colors();
	draw_borders();
};

export default _ => {
	if (waves.length !== 0) {
		assert(window.stop_page_audio === stop_page_audio);
		assert(gain !== null);
		window.stop_page_audio = null;
	}	
	set_item('page', "./compose/index.js");
	on_click = click_page;	
	on_resize = draw_page;
	on_resize();
};
