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

// window.set_design_size = function(w, h) {
// 	design_width  = w;
// 	design_height = h;
// 	adjust_canvas();
// };

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

///////////////////////////////////////////////////////////////////////////////////////////
//
// audio
//
///////////////////////////////////////////////////////////////////////////////////////////

window.audio = null;

window.init_audio = _ => {
	// this function must run in click handler to work on apple hardware
	if (audio === null) {
		audio = new (window.AudioContext || window.webkitAudioContext)();
	}
	if (audio.state === "suspended") {
		audio.resume();
	}
};

///////////////////////////////////////////////////////////////////////////////////////////
//
// page
//
///////////////////////////////////////////////////////////////////////////////////////////

window.current_page  = null;
window.previous_page = null;
window.click_x       = null;
window.click_y       = null;

canvas.addEventListener('click', e => {
    click_x = (e.pageX - left) / scale;
	click_y = (e.pageY - top ) / scale;
	if (current_page !== null) {
		current_page.click();
	}
});

function c_page(draw_func, click_func, start_func = null, exit_func = null) {
    this.draw_func       = draw_func;
    this.click_func      = click_func;
    this.start_func      = start_func;
    this.exit_func       = exit_func;
    this.back_func       = null;
	this.page_start_func = this.start.bind(this);
	this.page_draw_func  = this.draw.bind(this);
}

c_page.prototype.click = function() {
	if (this.click_func !== null) {
		this.click_func();
	}
};

c_page.prototype.draw = function() {
    this.draw_func();
};

c_page.prototype.start = function(back_func = null) {
	current_page   = this;
    this.back_func = back_func;
    addEventListener('resize', this.page_draw_func);
    if (this.start_func !== null) {
        this.start_func();
    }
    this.draw();
};

c_page.prototype.exit = function(destination_page_start) {
	assert(destination_page_start !== undefined && destination_page_start !== null);
	previous_page = this;
    removeEventListener('resize', this.page_draw_func);
    if (this.exit_func !== null) {
        this.exit_func();
    } 
    destination_page_start(this.page_start_func);
};

c_page.prototype.back = function() {
	assert(this.back_func !== null);
	this.exit(this.back_func);
};

c_page.prototype.page_exit_func = function(destination_page_start) {
	assert(destination_page_start !== undefined);
    return this.exit.bind(this, destination_page_start);
};

c_page.prototype.page_back_func = function() {
    return this.back.bind(this);
};

window.page = (draw_func, click_func, start_func = null, exit_func = null) => {
    return new c_page(draw_func, click_func, start_func, exit_func);
};

///////////////////////////////////////////////////////////////////////////////
//
// color palette
//
///////////////////////////////////////////////////////////////////////////////

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

window.draw_red_bg = _ => {
	ctx.fillStyle = rgb_red;
	ctx.fillRect(0, 0, design_width, design_height);
};

window.draw_green_bg = _ => {
	ctx.fillStyle = rgb_green;
	ctx.fillRect(0, 0, design_width, design_height);
};

window.draw_blue_bg = _ => {
	ctx.fillStyle = rgb_blue;
	ctx.fillRect(0, 0, design_width, design_height);
};

window.draw_yellow_bg = _ => {
	ctx.fillStyle = rgb_yellow;
	ctx.fillRect(0, 0, design_width, design_height);
};

window.draw_black_bg = _ => {
	ctx.fillStyle = rgb_black;
	ctx.fillRect(0, 0, design_width, design_height);
};

window.draw_white_bg = _ => {
	ctx.fillStyle = rgb_white;
	ctx.fillRect(0, 0, design_width, design_height);
};

///////////////////////////////////////////////////////////////////////////////
//
// image
//
///////////////////////////////////////////////////////////////////////////////

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
		this.image.onload = this.draw.bind(this, x, y, s);
	}
};

const c_image_canvas  = document.createElement('canvas');
const c_image_ctx     = c_image_canvas.getContext("2d", { willReadFrequently: true });

c_image.prototype.click = function() {
    if (!this.image.complete) {
		return false;
	}
	c_image_canvas.width  = design_width; 
	c_image_canvas.height = design_height;
    c_image_ctx.setTransform(1, 0, 0, 1, 0, 0);
    c_image_ctx.clearRect(0, 0, c_image_canvas.width, c_image_canvas.height);
    const dx      = this.x            ;
    const dy      = this.y            ;
    const sx      = 0                 ;
    const sy      = 0                 ;
    const sWidth  = this.image.width  ;
    const sHeight = this.image.height ;
    const dWidth  = sWidth * this.s   ;
    const dHeight = sHeight * this.s  ;
	c_image_ctx.drawImage(this.image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
    const image_data = c_image_ctx.getImageData(0, 0, c_image_canvas.width, c_image_canvas.height);
    let x = Math.floor(click_x);
    let y = Math.floor(click_y);
    const i = Math.floor((image_data.width * y + x) * 4);
	return image_data.data[i] !== 0;
};

window.image = (src, x = 0, y = 0, s = 1) => {
    return new c_image(src, x, y, s);
};

////////////////////////////////////////////////////////////////////////////////////
//
// once
//
////////////////////////////////////////////////////////////////////////////////////

function c_once(t, action, images) {
    this.action = action;
    this.t      = t;
    this.images = images;
    this.i      = 0;
}

c_once.prototype.draw = function() {
    this.images[this.i].draw();
};

c_once.prototype.next = function() {
	++this.i;
	if (this.i === this.images.length) {
		this.i  = 0;
        this.action();
    } else {
        current_page.draw_func();
        setTimeout(this.next.bind(this), this.t);
    }
};

c_once.prototype.click = function() {
    if (this.i !== 0) {
        return;
    } else if (this.images[0].click()) {
		this.next();
    }
}

window.once = (t, action, images) => {
    return new c_once(t, action, images);
};

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

//////////////////////////////////////////////////////////////////////////////////////
//
// checkbox
//
//////////////////////////////////////////////////////////////////////////////////////

function c_check_box(border_image, off_image, on_image, off_func, on_func) {
	this.border_image = border_image;
	this.off_image    = off_image   ;
	this.on_image     = on_image    ;
	this.off_func     = off_func    ;
	this.on_func      = on_func     ;
	this.on           = false       ;
}

c_check_box.prototype.draw = function() {
	if (this.on) {
		this.on_image.draw();
	} else {
		this.off_image.draw();
	}
	this.border_image.draw();
};

c_check_box.prototype.click = function() {
	if (this.off_image.click()) {
		if (this.on) {
			if (this.off_func !== null) {
				this.off_func();
			}
			this.on = false;
		} else {
			if (this.on_func !== null) {
				this.on_func();
			}
			this.on = true;
		}
		return true;
	} else {
		return false;
	}
};

window.check_box = (border_image, off_image, on_image, off_func = null, on_func = null) => {
	return new c_check_box(border_image, off_image, on_image, off_func, on_func);
};

//////////////////////////////////////////////////////////////////////////////////////
//
// button
//
//////////////////////////////////////////////////////////////////////////////////////

function c_button(border, colors) {
	if (!Array.isArray(colors)) {
		colors = [colors];
	}
	if (typeof border === 'string') {
		this.border = image(border);
	} else {
		this.border = border;
	}
	this.colors = [];
	colors.forEach(o => {
		if (typeof o === 'string') {
			this.colors.push(image(o));
		} else {
			this.colors.push(o);
		}
	});
	this.i = 0;
	assert(this.colors.length > 0);
}

c_button.prototype.clone = function() {
	const border = this.border.clone();
	const colors = [];
	this.colors.forEach(i => {
		colors.push(i.clone());
	});
	return new c_button(border, colors);
};

c_button.prototype.draw = function() {
	this.border.draw();
	this.colors[this.i].draw();
};

c_button.prototype.click = function() {
	if (this.colors[this.i].click()) {
		if (++this.i === this.colors.length) this.i = 0;
		current_page.draw_func();
		return true;
	}
	return false;
};

window.button = (border, ...colors) => {
	return new c_button(border, colors);
};

	
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
