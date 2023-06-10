import start_home     from "../home/index.js"   ;
import start_far_away from "./far_away/index.js";

const far_away_button = pair(
	image("./songs/images/play_big_border.png"),
	image("./songs/images/play_big_red.png"   )
);

const a = [ bg_blue, silence_button, far_away_button ];

const draw = _ => {
    a.forEach(o => { o.draw(); });
	back_button.draw();
};

const click = _ => {
	if (back_button.click()) {
		start_home();
	} else if (far_away_button.click()) {
		start_far_away();
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
