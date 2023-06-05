import start_away  from "../away/index.js";
import start_songs from "../songs/index.js";

// function c_image(src, x, y, s) {
//     this.image     = new Image();
//     this.image.src = src;
//     this.x         = x;
//     this.y         = y;
//     this.s         = s;
// }

// c_image.prototype.clone = function(x, y, s) {
//     return new c_image(this.image.src, x, y, s);
// };

// c_image.prototype.draw = function(x, y, s) {
// 	if (this.image.complete) {
// 		const dx      = this.x + x           ;
// 		const dy      = this.y + y           ;
// 		const sx      = 0                    ;
// 		const sy      = 0                    ;
// 	    const sWidth  = this.image.width     ;
// 	    const sHeight = this.image.height    ;
// 	    const dWidth  = sWidth * this.s * s  ;
// 	    const dHeight = sHeight * this.s * s ;
// 		ctx.drawImage(this.image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);		
// 	} else {
// 		this.image.onload = this.draw.bind(this, x, y, s);
// 	}
// };
//const inner_ring_clicked = new c_pixel_checker("./home/images/inner_ring_red.png")


function c_ring(name) {
    this.border = img("./home/images/" + name + "_ring_border.png");
    this.red    = img("./home/images/" + name + "_ring_red.png"   );
    this.green  = img("./home/images/" + name + "_ring_green.png" );
    this.color  = this.red;
}

c_ring.prototype.draw = function() {
    this.color.draw();
    this.border.draw();
};

c_ring.prototype.click = function() {
    if (this.red.click()) {
        if (this.color === this.green) {
            this.color = this.red;
        } else {
            this.color = this.green;
        }
        draw();
    }
};

const inner_ring = new c_ring("inner");
const outer_ring = new c_ring("outer");

const big_button_0 = image("./home/images/big_button_0.png");
const big_button_1 = image("./home/images/big_button_1.png");
const big_button_2 = image("./home/images/big_button_2.png");

const big_button_clicked = circle(490, 500, 200);
let big_button           = null;

const draw_stuff = _ => {
    draw_blue_bg();
    inner_ring.draw();
    outer_ring.draw();
};

const click = _ => {
    inner_ring.click();
    outer_ring.click();
    if (big_button_clicked()) {
        schedule(
            [  0, draw_stuff, big_button_1],
            [100, draw_stuff, big_button_2],
            [100, start_songs, removeEventListener.bind(null, 'resize', draw)]
        );
    }
};

const draw = _ => {
    draw_stuff();
    big_button_0();    
};

const start = _ => {
    addEventListener('resize', draw);
    draw();
    set_click(click);
};

export default start;
