const bg         = image("./home/images/bg.png");
const big_button = circle(490, 500, 200);

const click = _ => {
    if (big_button()) {
        console.log("big button");
    }
};

const draw = _ => {
    bg();
};

const start = _ => {
    set_click(click);
    set_draw(350, draw);
};

export default start;
