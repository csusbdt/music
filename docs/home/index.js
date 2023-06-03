const bg         = image("./home/images/bg.png");
const big_button = circle(490, 500, 200);

click = _ => {
    if (big_button()) {
        console.log("big button");
    }
};

const draw = _ => {
    bg();
};

const start = _ => {
    window.loop(350, draw);
};

export default start;
