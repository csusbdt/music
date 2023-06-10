///////////////////////////////////////////////////////////////////////////////
//
// errors
//
///////////////////////////////////////////////////////////////////////////////

window.assert = function(condition, msg) {
	if (!condition) {
		if (msg === undefined) msg = "assertion failed";
		document.body.innerHTML = "<h1>" + msg + "</h1>";
		throw new Error(msg);
	}
};

let error_caught = false;

window.addEventListener("error", e => {
    // report first error only
    if (error_caught) return;
	let i = e.filename.indexOf("//") + 2;
	i += e.filename.substring(i).indexOf("/") + 1;
	const filename = e.filename.substring(i);
    document.body.innerHTML = `<h1>${e.error}<br>${filename}<br>Line ${e.lineno}</h1>`;
});

window.addEventListener('unhandledrejection', e => {
    if (error_caught) return;
	if (typeof(e.reason.stack) !== 'undefined') {
	    document.body.innerHTML = `<h1>${e.reason}<br>${e.reason.message}<br>${e.reason.stack}</h1>`;
	} else {
	    document.body.innerHTML = `<h1>${e.reason}<br>${e.reason.message}</h1>`;
	}
});

window.log = m => console.log(m);

///////////////////////////////////////////////////////////////////////////////
//
// canvas
//
///////////////////////////////////////////////////////////////////////////////

// alpha === false speeds up drawing of transparent images
window.ctx = canvas.getContext('2d', { alpha: false });

let design_width  = 1000 ;
let design_height = 1000 ;
let scale         = 1    ;
let left          = 0    ;
let top           = 0    ;

window.set_design_size = function(w, h) {
	design_width  = w;
	design_height = h;
	adjust_canvas();
};

// Convert mouse and touch event coords to design coords.
window.design_coords = e => {
	return {
		x: (e.pageX - left) / scale,
		y: (e.pageY - top ) / scale
	};
};

window.adjust_canvas = _ => {
    const sx          = window.innerWidth  / design_width ;
    const sy          = window.innerHeight / design_height;
    scale             = Math.min(sx, sy);
	canvas.width      = scale * design_width ;
	canvas.height     = scale * design_height;
	left              = (window.innerWidth  - canvas.width ) / 2;
	top               = (window.innerHeight - canvas.height) / 2;
	canvas.style.left = left;
	canvas.style.top  = top ;
	ctx.setTransform(scale, 0, 0, scale, 0, 0);
}

window.addEventListener('resize', adjust_canvas);

adjust_canvas();

///////////////////////////////////////////////////////////////////////////////////////////////
//
// audio
//
// init_audio is called with every click on the canvas with <canvas onclick="init_audio();"
// This will run before all other click handlers. 
//
///////////////////////////////////////////////////////////////////////////////////////////////

window.audio     = null;
window.main_gain = null;
window.gain      = null; // used by pages

window.init_audio = _ => {
	// this function must run in click handler to work on apple hardware
	if (audio === null) {
		audio = new (window.AudioContext || window.webkitAudioContext)();
	}
	if (audio.state === "suspended") {
		audio.resume();
	}
	if (main_gain === null) {
		main_gain = audio.createGain();
		main_gain.gain.value = 1;
		main_gain.connect(audio.destination);
	}
};

window.silence_on = _ => {
	main_gain.gain.setTargetAtTime(0, audio.currentTime, .1);
};

window.silence_off = _ => {
	main_gain.gain.setTargetAtTime(1, audio.currentTime, .1);
};

///////////////////////////////////////////////////////////////////////////////////////////////
//
// local storage
//
///////////////////////////////////////////////////////////////////////////////////////////////

const version = "music_0_";

window.set_item = (key, item) => {
	localStorage.setItem(version + key, JSON.stringify(item));
};

window.get_item = (key, _default) => {
	let item = localStorage.getItem(version + key);
	if (item === null) {
		set_item(key, _default);
		return _default;
	} else {
		return JSON.parse(item);
	}
};

///////////////////////////////////////////////////////////////////////////////////
//
// color palette
//
///////////////////////////////////////////////////////////////////////////////////

window.colors = {
	red    : [243, 140, 105],
	green  : [ 64, 216, 122],
	blue   : [ 29, 225, 220],
	yellow : [242, 244,  44],
	black  : [ 72,  55,  55],
	white  : [174, 201, 201]
};

const rgb_red    = `rgb(${colors.red   [0]}, ${colors.red   [1]}, ${colors.red   [2]})`;
const rgb_green  = `rgb(${colors.green [0]}, ${colors.green [1]}, ${colors.green [2]})`;
const rgb_blue   = `rgb(${colors.blue  [0]}, ${colors.blue  [1]}, ${colors.blue  [2]})`;
const rgb_yellow = `rgb(${colors.yellow[0]}, ${colors.yellow[1]}, ${colors.yellow[2]})`;
const rgb_black  = `rgb(${colors.black [0]}, ${colors.black [1]}, ${colors.black [2]})`;
const rgb_white  = `rgb(${colors.white [0]}, ${colors.white [1]}, ${colors.white [2]})`;

////////////////////////////////////////////////////////////////////////////////////
//
// bg
//
////////////////////////////////////////////////////////////////////////////////////

function c_bg(rgb) {
	this.rgb = rgb;
}

c_bg.prototype.draw = function() {
	ctx.fillStyle = this.rgb;
	ctx.fillRect(0, 0, design_width, design_height);
};

c_bg.prototype.click = function() {
	return false;
};
	
window.bg_red    = new c_bg(rgb_red   );
window.bg_green  = new c_bg(rgb_green );
window.bg_blue   = new c_bg(rgb_blue  );
window.bg_yellow = new c_bg(rgb_yellow);
window.bg_black  = new c_bg(rgb_black );
window.bg_white  = new c_bg(rgb_white );

////////////////////////////////////////////////////////////////////////////////////
//
// image
//
////////////////////////////////////////////////////////////////////////////////////

function c_image(src, x = 0, y = 0, s = 1) {
    this.image     = new Image();
    this.image.src = src;
    this.x         = x;
    this.y         = y;
    this.s         = s;
}

c_image.prototype.clone = function(x = 0, y = 0, s = 1) {
    return new c_image(this.image.src, x, y, s);
};

c_image.prototype.draw = function(x = 0, y = 0, s = 1) {
	if (this.image.complete) {
		const dx      = this.x + x           ;
		const dy      = this.y + y           ;
		const sx      = 0                    ;
		const sy      = 0                    ;
	    const sWidth  = this.image.width     ;
	    const sHeight = this.image.height    ;
	    const dWidth  = sWidth * this.s * s  ;
	    const dHeight = sHeight * this.s * s ;
		ctx.drawImage(this.image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);		
	} else {
		if (this.image.onload === null) {
			this.image.onload = on_resize;
		}
	}
};

const click_test_canvas = document.createElement('canvas');
const click_test_ctx    = click_test_canvas.getContext("2d", { willReadFrequently: true });

c_image.prototype.click = function() {
    if (!this.image.complete) {
		return false;
	}
	click_test_canvas.width  = design_width; 
	click_test_canvas.height = design_height;
    click_test_ctx.setTransform(1, 0, 0, 1, 0, 0);
    click_test_ctx.clearRect(0, 0, click_test_canvas.width, click_test_canvas.height);
    const dx      = this.x            ;
    const dy      = this.y            ;
    const sx      = 0                 ;
    const sy      = 0                 ;
    const sWidth  = this.image.width  ;
    const sHeight = this.image.height ;
    const dWidth  = sWidth * this.s   ;
    const dHeight = sHeight * this.s  ;
	click_test_ctx.drawImage(this.image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    const image_data = click_test_ctx.getImageData(0, 0, click_test_canvas.width, click_test_canvas.height);
    let x = Math.floor(click_x);
    let y = Math.floor(click_y);
    const i = Math.floor((image_data.width * y + x) * 4);
	return image_data.data[i] !== 0;
};

window.image = (src, x = 0, y = 0, s = 1) => {
    return new c_image(src, x, y, s);
};

//////////////////////////////////////////////////////////////////////////////////////
//
// button
//
//////////////////////////////////////////////////////////////////////////////////////

function c_button(border_image, color_image, f = null) {
	this.border_image = border_image;
	this.color_image  = color_image;
	this.f            = f;
}

c_button.prototype.draw = function() {
	this.border_image.draw();
	this.color_image.draw();
};

c_button.prototype.click = function() {
	if (this.color_image.click()) {
		if (this.f !== null) this.f();
		return true;
	} else {
		return false;
	}
};

window.button = (border_image, color_image, f = null) => {
	return new c_button(border_image, color_image, f);
};

//////////////////////////////////////////////////////////////////////////////////////
//
// button group
//
//////////////////////////////////////////////////////////////////////////////////////

function c_button_group(buttons, f = null) {
	this.buttons = buttons;
	this.f       = f;
}

c_button_group.prototype.draw = function() {
	this.buttons.forEach(o => o.draw());
};

c_button_group.prototype.click = function() {
	if (this.buttons.some(o => o.click())) {
		if (this.f !== null) this.f();
		return true;
	} else {
		return false;
	}
};

window.button_group = (buttons, f = null) => {
	return new c_button_group(buttons, f);
};


//////////////////////////////////////////////////////////////////////////////////////
//
// checkbox
//
//////////////////////////////////////////////////////////////////////////////////////


function c_checkbox2(off_button, on_button) {
	this.off_button = off_button;
	this.on_button  = on_button ;
	this.on           = false   ;
}

c_checkbox2.prototype.draw = function() {
	if (this.on) {
		if (this.on_button !== null) this.on_button.draw();
	} else {
		this.off_button.draw();	
	}
};

c_checkbox2.prototype.click = function() {
	if (this.on) {
		if (this.on_button === null) {
			return false;
		} else {
			if (this.on_button.click()) {
				this.on = false;
				return true;
			} else return false;
		}
	} else {
		if (this.off_button.click()) {
			this.on = true;
			return true;
		} else {
			return false;
		}
	}
};

window.checkbox2 = (off_button, on_button = null) => {
	return new c_checkbox2(off_button, on_button);
};

///////////////////////////////////////

// function c_checkbox(border_image, off_image, on_func, on_image, off_func) {
// 	this.border_image = border_image;
// 	this.off_image    = off_image   ;
// 	this.on_image     = on_image    ;
// 	this.off_func     = off_func    ;
// 	this.on_func      = on_func     ;
// 	this.on           = false       ;
// }

// c_checkbox.prototype.draw = function() {
// 	if (this.on) {
// 		if (this.on_image === null) return;
// 		this.on_image.draw();
// 	} else {
// 		this.off_image.draw();
// 	}
// 	this.border_image.draw();
// };

// c_checkbox.prototype.click = function() {
// 	if (this.on && this.on_image === null) return false;
// 	if (this.off_image.click()) {
// 		if (this.on) {
// 			if (this.off_func !== null) {
// 				this.off_func();
// 			}
// 			this.on = false;
// 		} else {
// 			if (this.on_func !== null) {
// 				this.on_func();
// 			}
// 			this.on = true;
// 		}
// 		return true;
// 	} else {
// 		return false;
// 	}
// };

// window.checkbox = (border_image, off_image, on_func = null, on_image = null, off_func = null) => {
// 	return new c_checkbox(border_image, off_image, on_func, on_image, off_func);
// };

////////////////////////////////////////////////////////////////////////////////////////
//
// once
//
////////////////////////////////////////////////////////////////////////////////////////

function c_once(t, action, buttons) {
    this.action = action;
    this.t       = t;
    this.buttons = buttons;
    this.i       = null;
}

c_once.prototype.draw = function() {
	if (this.i === null) return;
    this.buttons[this.i].draw();
};

c_once.prototype.next = function() {
	if (this.i === null) return;
	++this.i;
	if (this.i === this.buttons.length) {
		this.i  = null;
        if (this.action !== null) this.action();
    } else {
        setTimeout(this.next.bind(this), this.t);
    }
	on_resize();
};

c_once.prototype.start = function() {
	if (this.i !== null) return;
	this.i = 0;
	setTimeout(this.next.bind(this), this.t);
	on_resize();
};

c_once.prototype.click = function() {
	if (this.i === null) return false;
    if (this.i !== 0) {
        return;
	} else if (this.buttons[0].click()) {
		this.next();
	}
};

window.once = (t, action, images) => {
    return new c_once(t, action, images);
};


//////////////////////////////////////////////////////////////////////////////////////
//
// animated button
//
//////////////////////////////////////////////////////////////////////////////////////

const c_anim_button_action = function(f) {
	this.checkbox.on = false;
	if (f !== null) f();
}

function c_anim_button(buttons, t, f) {
	assert(buttons.length > 1);
	this.checkbox = checkbox2(buttons[0], null);
	this.once     = once(t, c_anim_button_action.bind(this, f), buttons.slice(1));
}

c_anim_button.prototype.draw = function() {
	this.checkbox.draw();
	this.once.draw();
};

c_anim_button.prototype.click = function() {
	if (this.checkbox.click()) {
		this.once.start();
	}
};

window.anim_button = (buttons, t, f = null) => new c_anim_button(buttons, t, f);

//////////////////////////////////////////////////////////////////////////////////////
//
// radio buttons
//
//     off_func called before on_func
//
//////////////////////////////////////////////////////////////////////////////////////

function c_radio_button(border_image, off_image, on_image, off_func, on_func) {
	this.border_image = border_image;
	this.off_image    = off_image   ;
	this.on_image     = on_image    ;
	this.off_func     = off_func    ;
	this.on_func      = on_func     ;
	this.on           = false       ;
}

c_radio_button.prototype.draw = function() {
	if (this.on) {
		this.on_image.draw();
	} else {
		this.off_image.draw();
	}
	this.border_image.draw();
};

c_radio_button.prototype.click = function() {
	return this.off_image.click();
};

c_radio_button.prototype.set_off = function() {
	assert(this.on);
	if (this.on) {
		if (this.off_func !== null) {
			this.off_func();
		}
		this.on = false;
	}
};

c_radio_button.prototype.set_on = function() {
	assert(!this.on);
	if (!this.on) {
		if (this.on_func !== null) {
			this.on_func();
		}
		this.on = true;
	}
};

window.radio_button = (border_image, off_image, on_image, off_func = null, on_func = null) => {
	return new c_radio_button(border_image, off_image, on_image, off_func, on_func);
};

function c_radio_buttons(radio_buttons) {
	this.radio_buttons = radio_buttons;
	this.on_button = null;
}

c_radio_buttons.prototype.draw = function() {
	this.radio_buttons.forEach(b => { b.draw(); });
}

c_radio_buttons.prototype.click = function() {
	for (let i = 0; i < this.radio_buttons.length; ++i) {
		if (this.radio_buttons[i].click()) {
			if (this.radio_buttons[i] === this.on_button) {
				this.radio_buttons[i].set_off();
				this.on_button = null;
			} else {
				if (this.on_button !== null) {
					this.on_button.set_off();
				}
				this.radio_buttons[i].set_on();				
				this.on_button = this.radio_buttons[i];
			}
			return true;
		}
	}
	return false;
};

window.radio_buttons = (...radio_buttons) => {
	return new c_radio_buttons(radio_buttons);
};

///////////////////////////////////////////////////////////////////////////////////////////
//
// page
//
///////////////////////////////////////////////////////////////////////////////////////////

window.back_button = button(
    image("./global/images/upper_left_border.png"),
    image("./global/images/upper_left_red.png")
);

window.silence_button = checkbox2(
    button(
		image("./global/images/upper_right_border.png"), 
		image("./global/images/upper_right_green.png"), 
		silence_off
	),
    button(
		image("./global/images/upper_right_border.png"), 
		image("./global/images/upper_right_white.png"), 
		silence_on
	)
);

window.on_click  = null; // set in page start func
window.click_x   = null;
window.click_y   = null;

window.on_resize = null; // set in page start func

canvas.addEventListener('click', e => {
    click_x = (e.pageX - left) / scale;
	click_y = (e.pageY - top ) / scale;
	if (on_click !== null) on_click();
});

addEventListener('resize', _ => {
	if (on_resize !== null) on_resize();
});

///////////////////////////////////////////////////////////////////////////////
//
// animation
//
///////////////////////////////////////////////////////////////////////////////

// window.schedule = (...args) => {
// 	let wait = 0;
// 	args.forEach(a => {
// 		for (let i = a.length - 1; i >= 0; --i) {
// 			if (Number.isInteger(a[i])) {
// 				wait += a[i];
// 				a.splice(i, 1);
// 			}
// 		}
// 		setTimeout(_ => {
// 			a.forEach(o => {
// 				if (typeof o === "function") {
// 					o(); 
// 				} else {
// 					assert(o.draw !== undefined);
// 					o.draw();
// 				}
// 			});
// 		}, wait);
// 	});
// }

// window.once = (...args) => {
//     const q = args.slice();
//     return _ => {
//         const first = q.shift();
//         if (first === undefined || first === null) {
//             return;
//         } else if (Array.isArray(first)) {
//             first.forEach(f => {
//                 if (typeof f === "boolean") {
//                     if (f) q.unshift(first);
//                 } else {
//                     f();
//                 }
//             });
//         } else {
//             first();
//         }
//     };
// }

// window.loop = (...args) => {
//     const list = args.slice();
// 	let i = 0;
//     return _ => {
// 		const o = list[i];
// 		if (o === null) {
// 			// noop
//         } else if (Array.isArray(o)) {
//             o.forEach(oo => { oo(); });
//         } else {
// 			o();
// 		}
// 		if (++i === list.length) i = 0;
//     };
// }
