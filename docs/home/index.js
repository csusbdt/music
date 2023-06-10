import start_away           from "../away/index.js"          ;
import start_songs          from "../songs/index.js"         ;
import start_space_shooter  from "../space_shooter/index.js" ;

const inner_border = image("./home/images/inner_ring_border.png");
const inner_red    = image("./home/images/inner_ring_red.png"   );
const inner_green  = image("./home/images/inner_ring_green.png" );

const outer_border = image("./home/images/outer_ring_border.png");
const outer_red    = image("./home/images/outer_ring_red.png"   );
const outer_green  = image("./home/images/outer_ring_green.png" );

const inner_ring = checkbox(inner_border, inner_red, null, inner_green);
const outer_ring = checkbox(outer_border, outer_red, null, outer_green);

const big_button_border   = image("./home/images/big_button_border.png"  );
const big_button_border_1 = image("./home/images/big_button_border_1.png");
const big_button_border_2 = image("./home/images/big_button_border_2.png");
const big_button_red      = image("./home/images/big_button_red.png"     );
const big_button_red_1    = image("./home/images/big_button_red_1.png"   );
const big_button_red_2    = image("./home/images/big_button_red_2.png"   );

const big_button_images = [ 
    button(big_button_border_1, big_button_red_1), 
    button(big_button_border_2, big_button_red_2) 
];

const big_once_action = _ => {
    big_button.on = false;
    if (inner_ring.on && outer_ring.on) {
        start_space_shooter();
    } else if (inner_ring.on || outer_ring.on) {
        start_away();
    } else {
        start_songs();
    }
};

const big_once = once(100, big_once_action, big_button_images);

const big_button = checkbox(big_button_border, big_button_red, _ => {
    big_once.start();
});

const draw_list = [ bg_blue, silence_button, inner_ring, outer_ring, big_button ];
    
const draw = _ => {
	draw_list.forEach(o => { 
		if (typeof o === 'object' && o.draw !== undefined) {
			return o.draw(); 
		}
	});
};

const click_list = [ silence_button, inner_ring, outer_ring, big_button ];

const click = _ => {
	if (click_list.some(o => { 
		if (typeof o === 'object' && o.click !== undefined) {
			return o.click(); 
		} else {
			return false;
		}
	})) draw();
};

const start = _ => {
    on_click  = click;
    on_resize = draw;
    draw();
};

export default start;
