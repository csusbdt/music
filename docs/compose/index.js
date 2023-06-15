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

// const waver_tone_0 = tone(PHI, 1, 0);
// const waver_tone_0 = tone(scale(6, 240, 0), 1, 3);

const red    = img("red"   ); 
const green  = img("green" ); 
const blue   = img("blue"  ); 
const yellow = img("yellow"); 
const white  = img("white" ); 
const black  = img("black" ); 
const border = img("border"); 

const row_y = row => 30 + 130 * row;
const col_x = col =>  0 + 130 * col;

const draw_borders = _ => {
	for (let col = 0; col < 5; ++col) {
		for (let row = 0; row < 5; ++row) {
			border.draw(col_x(col), row_y(row));
		}		
	}
}

const draw_colors = _ => {
	for (let col = 0; col < 5; ++col) {
		for (let row = 0; row < 5; ++row) {
			white.draw(col_x(col), row_y(row));
		}
	}
};

const click_all = _ => {
	for (let col = 0; col < 5; ++col) {
		for (let row = 0; row < 5; ++row) {
			if (click(red, col_x(col), row_y(row))) {
				return true;
			}
		}
	}
	return false;
};

const draw_page = _ => {
	bg_blue.draw();
	back_button.draw();
	draw_colors();
	draw_borders();
};

const click_page = _ => {
	if (back_button.click()) return exit_page();
	if (click_all()) on_resize();
};

const exit_page = _ => {
	stop_audio().then(start_home);
};

const start_page = _ => {
};

export default _ => {
	set_item('page', "./compose/index.js");	
	on_resize = draw_page;
	on_click  = click_page;
	start_page();
	on_resize();
};
