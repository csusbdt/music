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

///////////////////////////////////////////////////////////////////////////////
//
// click handling
//
///////////////////////////////////////////////////////////////////////////////

let click_x    = null;
let click_y    = null;
let click_func = null;

// may need these later
//window._x = _ => { return click_x; };
//window._y = _ => { return click_y; };

window.set_click = f => {
    click_func = f;
}

canvas.addEventListener('click', e => {
    if (click_func === null) return;
    click_x = (e.pageX - left) / scale;
	click_y = (e.pageY - top ) / scale;
    click_func(click_x, click_y);
});

window.circle = function(x, y, r) {
	return (dx = 0, dy = 0, dr = 0) => { 
        return (x + dx - click_x) * (x + dx - click_x) + (y + dy - click_y) * (y + dy - click_y) < (r + dr) * (r + dr); 
    };
};

window.rect = function(left, top, right, bottom) {
	return _ => { 
        return left <= click_x && top <= click_y && click_x < right && click_y < bottom; 
    };
};

// window.pixels = function(src) {
// 	return _ => { 
//         return left <= click_x && top <= click_y && click_x < right && click_y < bottom; 
//     };
// };

window.shapes = function(..._shapes) {
	for (let i = 0; i < _shapes.length; ++i) {
		if (_shapes[i]()) return true;
	}
	return false;
};

///////////////////////////////////////////////////////////////////////////////
//
// drawing
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
    if (!this.image.complete) return false;
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

// window.img = (src, x = 0, y = 0, s = 1) => {
//     return new c_image(src, x, y, s);
// };

// window.click_image = (src, x = 0, y = 0, s = 1) => {
//     const image = new c_image(src, x, y, s);
//     return image.click;
// };

window.image = (src, x = 0, y = 0, s = 1) => {
    return new c_image(src, x, y, s);
};

// let draw_id   = null;
// let draw_func = null;

// window.set_draw = (t, f) => {
//     if (draw_id !== null) clearInterval(draw_id);
//     draw_func = f;
// 	if (t === undefined) {
// 		draw_func = null;
// 	} else {
// 	    draw_id = setInterval(draw_func, t);
// 		draw_func();
// 	}
// };

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
// animation
//
///////////////////////////////////////////////////////////////////////////////

window.schedule = (...args) => {
	let wait = 0;
	args.forEach(a => {
		for (let i = a.length - 1; i >= 0; --i) {
			if (Number.isInteger(a[i])) {
				wait += a[i];
				a.splice(i, 1);
			}
		}
		setTimeout(_ => {
			a.forEach(o => {
				if (typeof o === "function") {
					o(); 
				} else {
					assert(o.draw !== undefined);
					o.draw();
				}
			});
		}, wait);
	});
}

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

function c_page(draw_func, click_func, start_func = null, exit_func = null) {
    this.draw_func  = draw_func;
    this.click_func = click_func;
    this.start_func = start_func;
    this.exit_func = exit_func;
    this.back_func = null;
}

let current_page  = null;
let previous_page = null;

c_page.prototype.start = function(back_func = null) {
	current_page = this;
    this.back_func = back_func;
    addEventListener('resize', this.draw_func);
    if (this.start_func !== null) {
        this.start_func();
    }
    this.draw_func();
    set_click(this.click_func);
};

c_page.prototype.page_start = function() {
    return this.start.bind(this);
};

c_page.prototype.exit = function(destination_page_start = null) {
	previous_page = this;
    removeEventListener('resize', this.draw_func);
    set_click(null); // probably not needed, but just in case
    if (this.exit_func !== null) {
        this.exit_func();
    } else if (destination_page_start === null) {
        this.back_func();
    } else {
        destination_page_start(this.page_start());
    }
};

c_page.prototype.back = function() {
	assert(this.back_func !== null);
	this.exit(this.back_func);
    // removeEventListener('resize', this.draw_func);
    // set_click(null);
    // if (this.exit_func !== null) {
    //     this.exit_func();
    // // }
    // // if (destination_page_start === null) {
    // //     this.back_func();
    // } else {
    //     destination_page_start(this.page_start());
    // }
};

c_page.prototype.page_exit = function(destination_page_start = null) {
    return this.exit.bind(this, destination_page_start);
};

window.page = (draw_func, click_func, start_func = null, exit_func = null) => {
    return new c_page(draw_func, click_func, start_func, exit_func);
};

////////////////////////////////////////////////////////////////////////////////////
//
// button
//
////////////////////////////////////////////////////////////////////////////////////

function c_button(t, action, ...src) {
    this.action = action;
    this.t      = t;
    this.images = src.map(s => { return image(s); });
    this.i      = 0;
    this.id     = null;
}

c_button.prototype.draw = _ => {
    this.images[this.i].draw();
};

c_button.prototype.click = _ => {
    if (this.i !== 0) {
        return;
    } else if (this.images.length === 1) {
        this.action();
    } else {
        this.i = 1;
        draw();
        this.id = setTimeout(_ => {
            ++this.i;
            if (this.i === this.images.length) {
                this.i = 0;
                this.id = null;
                this.action();
            } else {
                draw();
            } 
        }.bind(this), this.t);
    }
}

window.button = (t, action, ...src) => {
    return new c_button(action, t, src);
};

