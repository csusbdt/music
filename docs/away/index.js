import start_home     from "../home/index.js"   ;
import start_far_away from "./far_away/index.js";

const big_button_0          = image("./home/images/big_button_0.png");
const big_button_1          = image("./home/images/big_button_1.png");
const big_button_2          = image("./home/images/big_button_2.png");

const medium_button_0 = big_button_0;
const medium_button_1 = big_button_1;
const medium_button_2 = big_button_2;
// const medium_button_0 = big_button_0.bind(clone(-200, -200, .6);
// const medium_button_1 = big_button_1.clone(-200, -200, .6);
// const medium_button_2 = big_button_2.clone(-200, -200, .6);

let big_button              = null;
let medium_button           = null;

const big_button_clicked    = circle(490, 500, 200);
//const medium_button_clicked = circle(490 - 200, 500 - 200, 200 * .6);
const medium_button_clicked = rect(0, 0, 100, 100);

const click = _ => {
    if (big_button_clicked()) {
        big_button = once(big_button_1, [big_button_0, start_home]);
    } else
    if (medium_button_clicked()) {
        start_far_away();
//        medium_button = once(medium_button_1, [medium_button_0, start_far_away]);
    }
};

const draw = _ => {
    bg_blue();
    big_button();
    medium_button(-200, -200, .6);
};

const start = _ => {
    big_button = big_button_2; 
    medium_button = medium_button_2;
    set_click(click);
    set_draw(350, draw);
};

export default start;
