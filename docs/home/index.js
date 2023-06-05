import start_away  from "../away/index.js";
import start_songs from "../songs/index.js";

function c_ring(name) {
    this.border = image("./home/images/" + name + "_ring_border.png");
    this.red    = image("./home/images/" + name + "_ring_red.png"   );
    this.green  = image("./home/images/" + name + "_ring_green.png" );
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

//let big_button           = null;

const draw_stuff = _ => {
    draw_blue_bg();
    inner_ring.draw();
    outer_ring.draw();
};

const draw = _ => {
    draw_stuff();
    big_button_0.draw();
};

const click = _ => {
    inner_ring.click();
    outer_ring.click();
    if (big_button_0.click()) {
        let start_func = null;
        if (inner_ring.color === inner_ring.green || outer_ring.color === outer_ring.green) {
            start_func = start_away;
        } else {
            start_func = start_songs;
        }
        schedule(
            [  0, draw_stuff , big_button_1 ],
            [100, draw_stuff , big_button_2 ],
            [100, p.page_exit(start_func)   ]
        );
    }
};

const p = page(draw, click);

export default p.page_start();
