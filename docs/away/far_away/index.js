import start_away from "../index.js";

const a = [ bg_blue, silence_button ];

const draw = _ => {
    a.forEach(o => { o.draw(); });
	back_button.draw();
};

const click = _ => {
	if (back_button.click()) {
		start_away();
	} else if (a.some(o => { return o.click(); })) {
		draw();
	}
};

const start = _ => {
    on_click  = click;
    on_resize = draw;
    draw();
};

export default start;
