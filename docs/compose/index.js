import start_home from "../home/index.js";

function c_img(src, x = 0, y = 0) {
    this.image     = new Image();
    this.image.src = src;
	this.x         = x;
	this.y         = y;
}

c_img.prototype.draw = function() {	
	if (this.image.complete) {
		ctx.drawImage(this.image, this.x, this.y);
	} else {
		this.image.onload = on_resize;
	}
};

const img   = (n, x = 0, y = 0) => new c_img("./compose/images/" + n + ".png", x, y);
const click = img               => click_test(img.image, img.x, img.y);



// const waver_tone_0 = tone(PHI, 1, 0);
// const waver_tone_0 = tone(scale(6, 240, 0), 1, 3);


const x =   0;
const y =  30;
const d = 130;

const grid = [
	[
		[ img("white", x + 0 * d, y + 0 * d), img("white", x + 1 * d, y + 0 * d) ],
		[ img("white", x + 0 * d, y + 1 * d), img("white", x + 1 * d, y + 1 * d) ]
	], [
		[ img("red"  , x + 0 * d, y + 0 * d), img("red"  , x + 1 * d, y + 0 * d) ],
		[ img("red"  , x + 0 * d, y + 1 * d), img("red"  , x + 1 * d, y + 1 * d) ]		
	]
];

const borders = [
	[ img("border", x + 0 * d, y + 0 * d), img("border", x + 1 * d, y + 0 * d) ],
	[ img("border", x + 0 * d, y + 1 * d), img("border", x + 1 * d, y + 1 * d) ]
];

let cols = [
	[ 0, 0 ],
	[ 1, 0 ]
];
	
const draw_page = _ => {
	bg_blue.draw();
	back_button.draw();
	borders.forEach(row => row.forEach(o => o.draw()));
//	cols.forEach(n => n.forEach(r => grid[r][c].draw()));
};

const click_page = _ => {
	if (back_button.click()) return exit_page();
	on_resize();
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
