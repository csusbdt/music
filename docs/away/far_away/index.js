import start_away from "../index.js";

const big_button_1 = null;

const click = _ => {
    big_button_1.click();
};

const draw = _ => {
    bg_blue();
    big_button_1.draw();
};

const start = _ => {
    big_button_1 = image("./home/images/big_button_1.png", start_away);
}

const exit = _ => {
    big_button_1 = null; // garbage collected to reduce memory?
};

const p = page(draw, click, start, exit);

export default p.page_start();
