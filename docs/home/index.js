import start_away from "../away/index.js";

const big_button_0       = image("./home/images/big_button_0.png");
const big_button_1       = image("./home/images/big_button_1.png");
const big_button_2       = image("./home/images/big_button_2.png");
const big_button_clicked = circle(490, 500, 200);
let big_button           = null;

const click = _ => {
    if (big_button_clicked()) {
        schedule(
            [  0, draw_blue_bg, big_button_1],
            [100, draw_blue_bg, big_button_2],
            [100, start_away                ]
        );
    }
};

const start = _ => {
    set_draw();
    draw_blue_bg();
    big_button_0();
    set_click(click);
};

export default start;
