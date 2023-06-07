import start_away  from "../away/index.js";
import start_songs from "../songs/index.js";

const inner_border = image("./home/images/inner_ring_border.png");
const inner_red    = image("./home/images/inner_ring_red.png"   );
const inner_green  = image("./home/images/inner_ring_green.png" );

const outer_border = image("./home/images/outer_ring_border.png");
const outer_red    = image("./home/images/outer_ring_red.png"   );
const outer_green  = image("./home/images/outer_ring_green.png" );

const inner_ring = check_box(inner_border, inner_red, inner_green);
const outer_ring = check_box(outer_border, outer_red, outer_green);

const big_button_images = [
    image("./home/images/big_button_0.png"),
    image("./home/images/big_button_1.png"),
    image("./home/images/big_button_2.png")
];

const big_button_action = b => {
    if (inner_ring.on || outer_ring.on) {
        p.exit(start_away);
    } else {
        p.exit(start_songs);
    }
};

const big_button = once(100, big_button_action, big_button_images);

const draw = _ => {
    draw_blue_bg();
    inner_ring.draw();
    outer_ring.draw();
    big_button.draw();
};

const click = _ => {
    if (inner_ring.click() || outer_ring.click()) draw();
    big_button.click();
};

const p = page(draw, click);

export default p.page_start_func;


/*


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

const big_button_action = b => {
    if (inner_ring.color === inner_ring.green || outer_ring.color === outer_ring.green) {
        p.exit(start_away);
    } else {
        p.exit(start_songs);
    }
};

const big_button_images = [
    image("./home/images/big_button_0.png"),
    image("./home/images/big_button_1.png"),
    image("./home/images/big_button_2.png")
];

const big_button = once(100, big_button_action, big_button_images);

const inner_ring = new c_ring("inner");
const outer_ring = new c_ring("outer");

const draw = _ => {
    draw_blue_bg();
    inner_ring.draw();
    outer_ring.draw();
    big_button.draw();
};

const click = _ => {
    inner_ring.click();
    outer_ring.click();
    big_button.click();
};

const p = page(draw, click);

export default p.page_start_func;

*/
