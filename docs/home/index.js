import start_away from "../away/index.js";

function c_pixel_checker(src) {
    this.img = new Image();
    this.img.src = src;
    this.data = null;
    this.img.onload =  _ => {
        const canvas = document.createElement('canvas');
        canvas.width = this.img.width;
        canvas.height = this.img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(this.img, 0, 0, canvas.width, canvas.height);
        this.data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    };
}

c_pixel_checker.prototype.click = function() {
    let x = Math.floor(_x());
    let y = Math.floor(_y());
    const i = Math.floor((this.img.width * y + x) * 4);
    return this.data[i] !== 0;
}

const inner_ring_clicked = new c_pixel_checker("./home/images/inner_ring_red.png")

function c_ring(name) {
    this.border = image("./home/images/" + name + "_ring_border.png");
    this.red    = image("./home/images/" + name + "_ring_red.png"   );
    this.green  = image("./home/images/" + name + "_ring_green.png" );
    this.color  = this.red;

    
}

c_ring.prototype.click = function() {
    if (this.shape !== null && this.shape()) {
        if (this.color === this.red) {
            this.color = this.green;
        } else {
            this.color = this.red;
        }
        this.color();
        this.border();
    } else if (inner_ring_clicked()) {
        
    }
};

c_ring.prototype.draw = function() {
    this.color();
    this.border();
};

const inner_ring = new c_ring("inner", null);
const outer_ring = new c_ring("outer", null);

const big_button_0 = image("./home/images/big_button_0.png"     );
const big_button_1 = image("./home/images/big_button_1.png"     );
const big_button_2 = image("./home/images/big_button_2.png"     );

const big_button_clicked = circle(490, 500, 200);
let big_button           = null;

const draw_stuff = _ => {
    draw_blue_bg();
    inner_ring.draw();
    outer_ring.draw();
};

const click = _ => {
    inner_ring_image.click();
    if (big_button_clicked()) {
        schedule(
            [  0, draw_stuff, big_button_1],
            [100, draw_stuff, big_button_2],
            [100, start_away, removeEventListener.bind(null, 'resize', draw)]
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
