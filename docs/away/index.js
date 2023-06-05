import start_home     from "../home/index.js"   ;
import start_far_away from "./far_away/index.js";

const draw_back_border      = image("./songs/images/back_border.png");
const draw_back_red         = image("./songs/images/back_red.png");

const back_click = circle(125, 130,  65);

const click = _ => {
    if (back_click()) {
		p.back();
    }
};

const draw = _ => {
    draw_blue_bg();
    draw_back_red();
    draw_back_border();
};

const p = page(draw, click);

export default p.page_start();
