import start_away from "../away/index.js";
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
    button(image("./home/images/big_button_border.png"  ), image("./home/images/big_button_fill.png"  )),
    button(image("./home/images/big_button_border_1.png"), image("./home/images/big_button_fill_1.png")),
    button(image("./home/images/big_button_border_2.png"), image("./home/images/big_button_fill_2.png"))
];

const big_button_action = _ => {
    if (inner_ring.on || outer_ring.on) {
        start_away();
    } else {
        start_songs();
    }
};

const big_button = once(100, big_button_action, big_button_images);

const a = [ bg_blue, silence_button, inner_ring, outer_ring, big_button ];

const draw = _ => {
    a.forEach(o => { o.draw(); });
};

const click = _ => {
    if (a.some(o => { return o.click(); })) draw();
};

const start = _ => {
    on_click  = click;
    on_resize = draw;
    draw();
};

export default start;
