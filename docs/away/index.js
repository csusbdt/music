import start_home from "../home/index.js";

const big_button_0       = image("./home/images/big_button_0.png");
const big_button_1       = image("./home/images/big_button_1.png");
const big_button_2       = image("./home/images/big_button_2.png");
const big_button_clicked = circle(490, 500, 200);
let big_button           = null;

const click = _ => {
    if (big_button_clicked()) {
        big_button = once(big_button_1, [big_button_0, start_home]);
    }
};

const draw = _ => {
    bg_blue();
    big_button();
};

const start = _ => {
    big_button = big_button_2; 
    set_click(click);
    set_draw(350, draw);
};

export default start;
