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
    
	// let w             = window.innerWidth;
	// let h             = window.innerHeight;
	// scale             = Math.min(w / design_width, h / design_height);
	// canvas.width      = scale * design_width;
	// canvas.height     = scale * design_height;
	// left              = (w - canvas.width ) / 2;
	// top               = (h - canvas.height) / 2;
	// canvas.style.left = left;
	// canvas.style.top  = top;
	// ctx.setTransform(scale, 0, 0, scale, 0, 0);
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
	return _ => { 
        return (x - click_x) * (x - click_x) + (y - click_y) * (y - click_y) < r * r; 
    };
};

window.rect = function(left, top, right, bottom) {
	return _ => { 
        return left <= click_x && top <= click_y && click_x < right && click_y < bottom; 
    };
};

///////////////////////////////////////////////////////////////////////////////
//
// drawing
//
///////////////////////////////////////////////////////////////////////////////

function c_image(src, x, y, s) {
    this.image     = new Image();
    this.image.src = src;
    this.x         = x;
    this.y         = y;
    this.s         = s;
}

c_image.prototype.draw = function(x, y, s) {
    const sx      = 0                    ;
    const sy      = 0                    ;
    const sWidth  = this.image.width     ;
    const sHeight = this.image.height    ;
    const dx      = this.x + x           ;
    const dy      = this.y + y           ;
    const dWidth  = sWidth * this.s * s  ;
    const dHeight = sHeight * this.s * s ;
	ctx.drawImage(this.image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);
};

window.image = (src, x = 0, y = 0, s = 1) => {
    const image = new c_image(src, x, y, s);
    return (x = 0, y = 0, s = 1) => {
        image.draw(x, y, s);
    }
};

let draw_id   = null;
let draw_func = null;

window.set_draw = (t, f) => {
    if (draw_id !== null) clearInterval(draw_id);
    draw_func = f;
    draw_id = setInterval(draw_func, t);
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

window.bg_red = _ => {
	ctx.fillStyle = rgb_red;
	ctx.fillRect(0, 0, design_width, design_height);
};

window.bg_green = _ => {
	ctx.fillStyle = rgb_green;
	ctx.fillRect(0, 0, design_width, design_height);
};

window.bg_blue = _ => {
	ctx.fillStyle = rgb_blue;
	ctx.fillRect(0, 0, design_width, design_height);
};

window.bg_yellow = _ => {
	ctx.fillStyle = rgb_yellow;
	ctx.fillRect(0, 0, design_width, design_height);
};

window.bg_black = _ => {
	ctx.fillStyle = rgb_black;
	ctx.fillRect(0, 0, design_width, design_height);
};

window.bg_white = _ => {
	ctx.fillStyle = rgb_white;
	ctx.fillRect(0, 0, design_width, design_height);
};

///////////////////////////////////////////////////////////////////////////////
//
// animation
//
///////////////////////////////////////////////////////////////////////////////

window.once = (...args) => {
    const q = args.slice();
    return _ => {
        const first = q.shift();
        if (first === undefined || first === null) {
            return;
        } else if (Array.isArray(first)) {
            first.forEach(f => {
                if (typeof f === "boolean") {
                    if (f) q.unshift(first);
                } else {
                    f();
                }
            });
        } else {
            first();
        }
    };
}