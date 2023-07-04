import xbutton from "../global/xbutton.js";

const back_green   = xbutton("upper_left_green" );
const back_blue    = xbutton("upper_left_blue"  );
const volume_green = xbutton("lower_right_green");
const volume_blue  = xbutton("lower_right_blue" );
const greens       = [];
const reds         = [];
const blues        = [];
const yellows      = [];
const red_green    = 0;
const yellow_blue  = 1;

let system         = null;
let save_draw      = null;
let save_click     = null;

for (let i = 0; i < window.volumes.length; ++i) {
	greens .push(xbutton("small_green" , 20 + i * 100, 260));
	reds   .push(xbutton("small_red"   , 20 + i * 100, 260));
	blues  .push(xbutton("small_blue"  , 20 + i * 100, 260));
	yellows.push(xbutton("small_yellow", 20 + i * 100, 260));
}

const click_page = _ => {
    if (back_green.click()) {
        on_resize = save_draw;
        on_click  = save_click;
        save_draw = null;
        on_resize();
    } else {
        for (let i = 0; i < greens.length; ++i) {
            if (greens[i].click()) {
				if (i !== volume_i) {
	                gain.gain.setTargetAtTime(volumes[i], audio.currentTime, .05);
	                volume_i = i;
					set_item('volume_i', volume_i);
	                on_resize();
				}
				return;
            }
        }
    }
};

const draw_page = _ => {
    if (system === red_green) {
        draw(bg_blue);
        draw(back_green);
        for (let i = 0; i < greens.length; ++i) {
            if (i === volume_i) reds[i].draw();
            else greens[i].draw();
        }
    } else {
        draw(bg_green);
        draw(back_blue);
        for (let i = 0; i < blues.length; ++i) {
            if (i === volume_i) yellows[i].draw();
            else blues[i].draw();
        }
    }
};

export default {
    draw_green: _ => { system = red_green;   volume_green.draw(); },
    draw_blue : _ => { system = yellow_blue; volume_blue.draw();  },
    click: _ => {
        if (volume_green.click()) {
            save_draw  = on_resize;
            save_click = on_click;
            on_resize  = draw_page;
            on_click   = click_page;
            return true;
        } else return false;
    }
};
