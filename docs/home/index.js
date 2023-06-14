import start_away           from "../away/index.js"          ;
import start_songs          from "../songs/index.js"         ;
import start_space_shooter  from "../space_shooter/index.js" ;
import start_compose        from "../compose/index.js"       ;

// buttons

const inner_border = img("./home/images/inner_ring_border.png");
const inner_red    = img("./home/images/inner_ring_red.png"   );
const inner_green  = img("./home/images/inner_ring_green.png" );

const outer_border = img("./home/images/outer_ring_border.png");
const outer_red    = img("./home/images/outer_ring_red.png"   );
const outer_green  = img("./home/images/outer_ring_green.png" );

const big_button_border   = img("./home/images/big_button_border.png"  );
const big_button_border_1 = img("./home/images/big_button_border_1.png");
const big_button_border_2 = img("./home/images/big_button_border_2.png");
const big_button_red      = img("./home/images/big_button_red.png"     );
const big_button_red_1    = img("./home/images/big_button_red_1.png"   );
const big_button_red_2    = img("./home/images/big_button_red_2.png"   );

const inner_ring = click_seq([objs([inner_red, inner_border]), objs([inner_green, inner_border])]);
const outer_ring = click_seq([objs([outer_red, outer_border]), objs([outer_green, outer_border])]);

const big_action = _ => {
    if (inner_ring.i === 0 && outer_ring.i === 0) {
        start_songs();
	} else if (inner_ring.i === 1 && outer_ring.i === 0) {
        start_compose();
	} else if (inner_ring.i === 0 && outer_ring.i === 1) {
        start_space_shooter();
	} else if (inner_ring.i === 1 && outer_ring.i === 1) {
        start_away();
    }
};

const big_button_colapse = obj_seq([
	objs([big_button_red_1, big_button_border_1 ]),
	objs([big_button_red_2, big_button_border_2 ])
], 100, big_action);

const big_button = objs([ big_button_red, big_button_border ], self => {
	self.stop();
	big_button_colapse.start();	
});
												
// control

const draw_list  = [ bg_blue, silence_button, back_button, inner_ring, outer_ring, big_button, big_button_colapse ];
const click_list = [          silence_button, back_button, inner_ring, outer_ring, big_button, big_button_colapse ];
const start_list = [                                       inner_ring, outer_ring, big_button                     ];

export default _ => {
	set_item('page', "./home/index.js");
	on_resize = _ => draw_list.forEach(o => o.draw());
	on_click = _ => {
		if (back_button.click()) return start_songs();
		else if (click_list.some(o => o.click())) on_resize();
	};
	start_list.forEach(o => o.start());
	on_resize();
};
	