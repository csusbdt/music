import start_away           from "../away/index.js"          ;
import start_songs          from "../songs/index.js"         ;
import start_space_shooter  from "../space_shooter/index.js" ;
import start_compose        from "../comp/index.js"          ;
import c_img                from "../img.js"                 ;
import c_button             from "../button.js"              ;
import c_toggle             from "../toggle.js"              ;

const inner_border = img("./home/images/inner_ring_border.png");
const inner_red    = img("./home/images/inner_ring_red.png"   );
const inner_green  = img("./home/images/inner_ring_green.png" );

const outer_border = img("./home/images/outer_ring_border.png");
const outer_red    = img("./home/images/outer_ring_red.png"   );
const outer_green  = img("./home/images/outer_ring_green.png" );

const big_border   = img("./home/images/big_button_border.png"  );
const big_border_1 = img("./home/images/big_button_border_1.png");
const big_border_2 = img("./home/images/big_button_border_2.png");
const big_red      = img("./home/images/big_button_red.png"     );
const big_red_1    = img("./home/images/big_button_red_1.png"   );
const big_red_2    = img("./home/images/big_button_red_2.png"   );

const audio_red    = img("./global/images/upper_right_red.png"   );
const audio_green  = img("./global/images/upper_right_green.png" );
const audio_border = img("./global/images/upper_right_border.png");

const audio_toggle = new c_toggle(audio_green, audio_red, audio_border);
const inner_ring   = new c_toggle(inner_red, inner_green, inner_border);
const outer_ring   = new c_toggle(outer_red, outer_green, outer_border);

const big_action = _ => {
    if (inner_ring.color === inner_ring.color_0 && outer_ring.color === outer_ring.color_0) {
        start_songs();
	} else if (inner_ring.color === inner_ring.color_1 && outer_ring.color === outer_ring.color_0) {
        start_compose();
	} else if (inner_ring.color === inner_ring.color_0 && outer_ring.color === outer_ring.color_1) {
        start_space_shooter();
	} else if (inner_ring.color === inner_ring.color_1 && outer_ring.color === outer_ring.color_1) {
        start_away();
    }
};

const big_button = {
	i: 0,
	draw: function() {
		[ big_red   , big_red_1   , big_red_2    ][this.i].draw();
		[ big_border, big_border_1, big_border_2 ][this.i].draw();
	},
	click: function() {
		if (big_red.click()) {
			on_click = null;
			this.i = 1;
			setTimeout(_ => { this.i = 2; on_resize(); }, 100);
			setTimeout(_ => { this.i = 0; big_action(); }, 200);
			return true;
		} else return false;
	}
};

const click = _ => {
	if (audio_toggle.click()) {
		if (window.stop_audio !== null) {
			window.stop_audio();
			audio_toggle.color = audio_toggle.color_0;
		} else {
			window.start_audio();
			audio_toggle.color = audio_toggle.color_1;
		}
		on_resize();
	}
	else if (inner_ring.click() || outer_ring.click()) on_resize();
	else big_button.click();
};

const draw = _ => {
	bg_blue.draw();
	audio_toggle.draw();
	inner_ring.draw();
	outer_ring.draw();
	big_button.draw();
};

export default _ => {
	if (window.stop_audio === null) {
		audio_toggle.color = audio_toggle.color_0;
	} else {
		audio_toggle.color = audio_toggle.color_1;
	}
	set_item('page', "./home/index.js");
	on_resize = draw;
	on_click = click;
	on_resize();
};
