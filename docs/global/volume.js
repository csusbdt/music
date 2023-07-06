import xbutton from "../global/xbutton.js";

const back_green   = xbutton("upper_left_green" );
const back_blue    = xbutton("upper_left_blue"  );
const volume_green = xbutton("lower_right_green");
const volume_blue  = xbutton("lower_right_blue" );

const zero_green  = xbutton("small_green" , 130, 200);
const zero_red    = xbutton("small_red"   , 130, 200);
const zero_blue   = xbutton("small_blue"  , 130, 200);
const zero_yellow = xbutton("small_yellow", 130, 200);

const one_green   = xbutton("large_green" , 360, 130);
const one_red     = xbutton("large_red"   , 360, 130);
const one_blue    = xbutton("large_blue"  , 360, 130);
const one_yellow  = xbutton("large_yellow", 360, 130);

const greens       = [];
const reds         = [];
const blues        = [];
const yellows      = [];
const digits       = [];
const red_green    = 0;
const yellow_blue  = 1;

let one            = false;
let system         = null;
let save_draw      = null;
let save_click     = null;

for (let i = 0; i < 9; ++i) {
	greens .push(xbutton("small_green" , 10 + i * 90, 460));
	reds   .push(xbutton("small_red"   , 10 + i * 90, 460));
	blues  .push(xbutton("small_blue"  , 10 + i * 90, 460));
	yellows.push(xbutton("small_yellow", 10 + i * 90, 460));
	digits .push(0);
}

let v = get_item('volume', .33);
for (let i = 0; i < digits.length; ++i) {
	if (v >= .5) {
		digits[i] = 1;
		v -= .5;
	}
	v *= 2;
}

const set_vol_by_digits = _ => {
	let v = 0;
	for (let i = 0; i < digits.length; ++i) {
		if (digits[i] === 1) v += Math.pow(2, -(i + 1));
	}
	gain.gain.setTargetAtTime(v, audio.currentTime, .05);
	set_item('volume', v);
};

const click_page = _ => {
    if (back_green.click()) {
        on_resize = save_draw;
        on_click  = save_click;
        save_draw = null;
        on_resize();
	} else if (zero_green.click()) {
		gain.gain.setTargetAtTime(0, audio.currentTime, .05);
		set_item('volume', 0);
		one = false;
		digits.fill(0);
        on_resize();
	} else if (one_green.click()) {
		if (one) {
			set_vol_by_digits();
			one = false;
		} else {
			gain.gain.setTargetAtTime(1, audio.currentTime, .05);
			set_item('volume', 1);
			one = true;
		}
        on_resize();
    } else {
        for (let i = 0; i < digits.length; ++i) {
            if (greens[i].click()) {
				if (digits[i] === 0) {
					digits[i] = 1;
					set_vol_by_digits();
				} else {
					digits[i] = 0;
					set_vol_by_digits();
				}
				one = false;
		        on_resize();
				return;
            }
        }
    }
};

const draw_page = _ => {
    if (system === red_green) {
        draw(bg_blue);
        draw(back_green);
		if (one) {
			draw(one_red);
			draw(zero_green);
			draw(reds);
		} else if (digits.every(d => d === 0)) {
			draw(one_green);
			draw(zero_red);
			draw(greens);
		} else {
			draw(one_green);
			draw(zero_green);
			for (let i = 0; i < digits.length; ++i) {
				if (digits[i] === 0) draw(greens[i]);
				else draw(reds[i]);
			}
		}
    } else {
        draw(bg_green);
        draw(back_blue);
		if (one) {
			draw(one_yellow);
			draw(zero_blue);
			draw(yellows);
		} else if (digits.every(d => d === 0)) {
			draw(one_blue);
			draw(zero_yellow);
			draw(blues);
		} else {
			draw(one_blue);
			draw(zero_blue);
			for (let i = 0; i < digits.length; ++i) {
				if (digits[i] === 0) draw(blues[i]);
				else draw(yellows[i]);
			}
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
