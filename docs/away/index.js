import start_home     from "../home/index.js"   ;
import start_far_away from "./far_away/index.js";

const back_border      = image("./songs/images/back_border.png");
const back_red         = image("./songs/images/back_red.png");

const click = _ => {
    if (back_red.click()) {
		p.back();
    }
};

const draw = _ => {
    draw_blue_bg();
    back_red.draw();
    back_border.draw();
};

const p = page(draw, click);

export default p.page_start();
