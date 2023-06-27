import start_home        from "../home/index.js"  ;
import c_img             from "../global/img.js"  ;

const draw = o => o.draw();

const img = n => new c_img("./compose/images/" + n + ".png");

const borders = img("borders");
const b_0     = img("b_0");
const y_0     = b_0.clone_yellow();
const b_1_0   = img("b_1_0");
const y_1_0   = b_1_0.clone_yellow();

let i = 0;

const click_page = _ => {
	if (y_0.click()) start_home();
	else if (b_1_0.click()) {
		i=== 0 ? i = 1 : i = 0;
		on_resize();
	}
};

let draw_count = 0;

const draw_page = _ => {
	draw(bg_green);
	draw(y_0);
	i=== 0 ? draw(b_1_0) : draw(y_1_0);
	draw(borders);
	log(++draw_count);
};

export default _ => {
	set_item('page', "./test/index.js");
	on_resize = draw_page;
	on_click = click_page;
	on_resize();
};

