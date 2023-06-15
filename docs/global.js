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

///////////////////////////////////////////////////////////////////////////////////////////////
//
// audio
//
// init_audio is called with every click on the canvas with <canvas onclick="init_audio();"
// This will run before all other click handlers. 
//
///////////////////////////////////////////////////////////////////////////////////////////////

window.audio   = null;
let main_gain  = null; // used by silence button
window.gain    = null; // used by pages

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

let reset_page = null;

window.start_audio = (new_reset_page = null) => {
	return new Promise(resolve => {
		if (reset_page !== null) {
			reset_page();
		}
		reset_page = new_reset_page;
		if (gain !== null) {
			stop_audio().then(_ => {
				gain = audio.createGain();
				gain.connect(main_gain);
				resolve();
			});
		} else {
			gain = audio.createGain();
			gain.connect(main_gain);
			resolve();
		}
	});
};

window.stop_audio = _ => {
	reset_page = null;
	return new Promise(resolve => {
		if (gain === null) {
			resolve();
		} else {
			gain.gain.setTargetAtTime(0, audio.currentTime, .05);
			setTimeout(_ => {
				gain.disconnect();
				gain = null;
				resolve();
			}, 60);
		}
	});
};

///////////////////////////////////////////////////////////////////////////////////////////////
//
// c_tone
//
///////////////////////////////////////////////////////////////////////////////////////////////

function c_tone(f, v = 1, b = 0) {
	this.f = f;
	this.v = v;
	this.b = b;
	this.g = null;
}

c_tone.prototype.start = function() {
	if (this.g === null) {
		this.g = audio.createGain();
		this.g.connect(gain);
		this.g.gain.value = 0;
		const merger = new ChannelMergerNode(audio);
		merger.connect(this.g);
		const o_left  = audio.createOscillator();
		const o_right = audio.createOscillator();
		o_left.connect(merger, 0, 0);
		o_right.connect(merger, 0, 1);
		o_left.frequency.value = this.f; 
		o_right.frequency.value = this.f + this.b;
		o_left.start();
		o_right.start();
	}
	this.g.gain.setTargetAtTime(this.v, audio.currentTime, .1);
};

c_tone.prototype.stop = function() {
	if (this.g !== null) {
		this.g.gain.setTargetAtTime(0, audio.currentTime, .1);
		this.g = null;
	}
};

window.tone = (f, v = 1, b = 0) => new c_tone(f, v, b);

///////////////////////////////////////////////////////////////////////////////
//
// canvas
//
///////////////////////////////////////////////////////////////////////////////

// alpha === false speeds up drawing of transparent images
window.ctx = canvas.getContext('2d', { alpha: false });

const click_test_canvas = document.createElement('canvas');
const click_test_ctx    = click_test_canvas.getContext("2d", { willReadFrequently: true });

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
	
	click_test_canvas.width  = design_width / 4; 
	click_test_canvas.height = design_height / 4;
    click_test_ctx.setTransform(1, 0, 0, 1, 0, 0);
};

window.on_resize = null; // should set when page starts

window.addEventListener('resize', _ => {
	adjust_canvas();
	if (on_resize !== null) on_resize();
});

adjust_canvas();

///////////////////////////////////////////////////////////////////////////////
//
// click handling 
//
///////////////////////////////////////////////////////////////////////////////

window.on_click  = null; // should set when page starts
window.click_x   = null;
window.click_y   = null;

canvas.addEventListener('click', e => {
	init_audio();
    click_x = (e.pageX - left) / scale;
	click_y = (e.pageY - top ) / scale;
	if (on_click !== null) on_click();
});

// pixel perfect click detection
window.click_test = (images, x = 0, y = 0, s = 1) => {
	if (!Array.isArray(images)) images = [images];
	for (let i = 0; i < images.length; ++i) {
		if (!images[i].complete) return false;
	}
    click_test_ctx.clearRect(0, 0, click_test_canvas.width, click_test_canvas.height);
    const dx      = x            ;
    const dy      = y            ;
    const sx      = 0            ;
    const sy      = 0            ;
	for (let i = 0; i < images.length; ++i) {
		const image   = images[i]      ;
	    const sWidth  = image.width  ;
	    const sHeight = image.height ;
	    const dWidth  = sWidth * s   ;
	    const dHeight = sHeight * s  ;
		click_test_ctx.drawImage(image, sx, sy, sWidth, sHeight, dx/4, dy/4, dWidth/4, dHeight/4);		
	}
    const image_data = click_test_ctx.getImageData(0, 0, click_test_canvas.width, click_test_canvas.height);
    let int_x = Math.floor(click_x / 4);
    let int_y = Math.floor(click_y / 4);
    const i = Math.floor((image_data.width * int_y + int_x) * 4);
	return image_data.data[i] !== 0;
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
// bg obj
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

function c_image(src, x = 0, y = 0, s = 1, f = null) {
    this.image     = new Image();
    this.image.src = src;
    this.x         = x;
    this.y         = y;
    this.s         = s;
    this.f         = f;
}

c_image.prototype.clone = function(x = 0, y = 0, s = 1, f = null) {
    return new c_image(this.image.src, x, y, s, f);
};

c_image.prototype.draw = function() {
	if (this.image.complete) {
		const dx      = this.x           ;
		const dy      = this.y           ;
		const sx      = 0                ;
		const sy      = 0                ;
	    const sWidth  = this.image.width ;
	    const sHeight = this.image.height;
	    const dWidth  = sWidth * this.s  ;
	    const dHeight = sHeight * this.s ;
		ctx.drawImage(this.image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);		
	} else {
		if (this.image.onload === null) {
			this.image.onload = on_resize;
		}
	}
};

c_image.prototype.click = function() {
	if (click_test(this.image, this.x, this.y, this.s)) {
		if (this.f !== null) this.f();
		return true;
	} else {
		return false;
	}
};

window.image = (src, x = 0, y = 0, s = 1, f = null) => {
    return new c_image(src, x, y, s, f);
};

////////////////////////////////////////////////////////////////////////////////////
//
// image obj
//
////////////////////////////////////////////////////////////////////////////////////

function c_img(src, x = 0, y = 0, s = 1, on_click = null) {
	assert(typeof src === 'string');
    this.image     = new Image();
    this.image.src = src;
    this.x         = x;
    this.y         = y;
    this.s         = s;
	this.on_click  = on_click;
	this.started   = false;
}

c_img.prototype.clone = function(x = 0, y = 0, s = 1, on_click = null) {
    return new c_img(this.image.src, x, y, s, on_click);
};

c_img.prototype.start = function() {
	if (this.started) return;
	this.started = true;
	return this;
};

c_img.prototype.stop = function() {
	if (!this.started) return;
	this.started = false;
	return this;
};

c_img.prototype.draw = function() {
	if (!this.started) return;
	if (this.image.complete) {
		const dx      = this.x           ;
		const dy      = this.y           ;
		const sx      = 0                ;
		const sy      = 0                ;
	    const sWidth  = this.image.width ;
	    const sHeight = this.image.height;
	    const dWidth  = sWidth * this.s  ;
	    const dHeight = sHeight * this.s ;
		ctx.drawImage(this.image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);		
	} else {
		if (this.image.onload === null) {
			this.image.onload = on_resize;
		}
	}
};

c_img.prototype.click = function() {
	if (this.started && click_test(this.image, this.x, this.y, this.s)) {
		if (this.on_click !== null) this.on_click(this);
		return true;
	} else {
		return false;
	}
};

window.img = (src, x = 0, y = 0, s = 1, on_click = null) => {
    return new c_img(src, x, y, s, on_click);
};

////////////////////////////////////////////////////////////////////////////////////
//
// obj
//
// obj adds on_click and start/stop to images
//
////////////////////////////////////////////////////////////////////////////////////

// function c_obj(objs, on_click = null) {
// 	if (!Array.isArray(objs)) objs = [objs];
//     this.objs     = objs;
// 	this.on_click = on_click;
// 	this.started  = false;
// }

// c_obj.prototype.start = function() {
// 	if (this.started) return;
// 	this.started = true;
// 	this.objs.forEach(o => o.start !== undefined && o.start());
// 	return this;
// };

// c_obj.prototype.stop = function() {
// 	if (!this.started) return;
// 	this.started = false;
// 	this.objs.forEach(o => o.stop !== undefined && o.stop());
// };

// c_obj.prototype.draw = function() {
// 	if (!this.started) return;
// 	this.objs.forEach(o => o.draw());
// };

// c_obj.prototype.click = function() {
// 	if (!this.started) return false;
// 	for (let i = 0; i < this.objs.length; ++i) {
// 		const o = this.objs[i];
// 		if (o.click()) {
// 			if (this.on_click !== null) this.on_click(o);
// 			return true;
// 		}
// 	}
// 	return false;
// };

// window.obj = (objs, on_click = null) => {
//     return new c_obj(objs, on_click);
// };

// window.obj_pair = (first, second, on_click = null) => {
// 	return new c_obj([first, second], on_click);
// };

///////////////////////////////////////////////////////////////////////////////////////////////////////
//
// objs
//
///////////////////////////////////////////////////////////////////////////////////////////////////////

function c_objs(objs, on_click = null) {
	assert(Array.isArray(objs));
	this.objs    = objs     ;
	this.on_click = on_click;
	this.started = false    ;
}

c_objs.prototype.stop = function() {
	if (this.started) {
		this.started = false;
		this.objs.forEach(o => o.stop());
	}
	return this;
};

c_objs.prototype.start = function() {
	if (!this.started) {
		this.started = true;
		this.objs.forEach(o => o.start());
	}
	return this;
};

c_objs.prototype.draw = function() {
	if (this.started) this.objs.forEach(o => o.draw());
};

c_objs.prototype.click = function() {
	if (this.started && this.objs.some(o => o.click())) {
		if (this.on_click !== null) this.on_click(this);
		return true;
	} else {
		return false;
	}
};

window.objs = (objs, on_click = null) => new c_objs(objs, on_click);


///////////////////////////////////////////////////////////////////////////////////////////////////////
//
// obj_list
//
// only one obj in list is in started state
//
///////////////////////////////////////////////////////////////////////////////////////////////////////

function c_obj_list(objs, on_click = null) {
	assert(Array.isArray(objs));
	this.objs     = objs    ;
	this.on_click = on_click;
	this.i        = 0       ;
	this.started  = false   ;
}

c_click_seq.prototype.stop = function() {
	assert(this.started);
	this.started = false;
	this.obj(this.i).stop(this);
	this.i = 0;
	return this;
};

c_click_seq.prototype.start = function() {
	assert(!this.started); 
	this.started = true;
	this.i = 0;
	this.objs[0].start(this);
	return this;
};

c_click_seq.prototype.draw = function() {
	if (this.started) this.objs[this.i].draw();
};

c_click_seq.prototype.click = function() {
	if (this.started && this.objs[this.i].click()) {
		if (++this.i === this.objs.length) {
			this.i = 0;
		}
		if (this.on_click !== null) this.on_click(this);
		return true;
	} else {
		return false;
	}
};

window.obj_list = (objs, on_click = null) => new c_obj_list(objs, on_click);


///////////////////////////////////////////////////////////////////////////////////////////////////////
//
// click_seq
//
// allows user to click through a list of objs
//
///////////////////////////////////////////////////////////////////////////////////////////////////////

function c_click_seq(objs, on_click = null) {
	assert(Array.isArray(objs));
	this.objs     = objs    ;
	this.on_click = on_click;
	this.i        = 0       ;
	this.started  = false   ;
}

c_click_seq.prototype.stop = function() {
	if (this.started) {
		this.i = 0;
		this.started = false;
		this.objs.forEach(o => o.stop(this));
	}
	return this;
};

c_click_seq.prototype.start = function() {
	if (!this.started) {
		this.i = 0;
		this.started = true;
		//this.objs(this.i).start(this);
		this.objs.forEach(o => o.start(this));
	}
	return this;
};

c_click_seq.prototype.draw = function() {
	if (this.started) this.objs[this.i].draw();
};

c_click_seq.prototype.click = function() {
	if (this.started && this.objs[this.i].click()) {
		if (++this.i === this.objs.length) {
			this.i = 0;
		}
		if (this.on_click !== null) this.on_click(this);
		return true;
	} else {
		return false;
	}
};

window.click_seq = (objs, on_click = null) => new c_click_seq(objs, on_click);

//////////////////////////////////////////////////////////////////////////////////////
//
// c_obj_seq
//
// a click starts animation 
//
//////////////////////////////////////////////////////////////////////////////////////

function c_obj_seq(objs, t, on_end = null) {
	assert(Array.isArray(objs));
	this.objs = objs;
	this.t = t;
	this.on_end = on_end;
	this.i = 0;
	this.started  = false;
	this.id = null;
}

function c_obj_seq_next() {
	if (!this.started) return;
	if (++this.i === this.objs.length) {
		this.i = 0;
		this.started = false;
		clearInterval(this.id);
		this.id = null;
		if (this.on_end !== null) this.on_end(this);
	}
	on_resize();
}

c_obj_seq.prototype.start = function() {
	if (this.started) return;
	this.started = true;
	this.objs.forEach(o => o.start(this));
	this.i = 0;
	this.id = setInterval(c_obj_seq_next.bind(this), this.t);
	return this;
};

c_obj_seq.prototype.stop = function() {
	if (!this.started) return;
	this.started = false;
	this.objs.forEach(o => o.stop(this));
	this.i = 0;
	return this;
};

c_obj_seq.prototype.draw = function() {
	if (!this.started) return;
	this.objs[this.i].draw();
};

c_obj_seq.prototype.click = function() {
	return false;
};

window.obj_seq = (objs, t, on_end = null) => {
	return new c_obj_seq(objs, t, on_end);
}


//////////////////////////////////////////////////////////////////////////////////////
//
// pair 2
//
//////////////////////////////////////////////////////////////////////////////////////

function c_pair2(first, second, on_click = null) {
	this.first    = first;
	this.second   = second;
	this.on_click = on_click;
}

c_pair2.prototype.draw = function() {
	this.first.draw();
	this.second.draw();
};

c_pair2.prototype.click = function() {
	if (this.first.click() || this.second.click()) {
		if (this.on_click !== null) this.on_click(this);
		return true;
	} else {
		return false;
	}
};

window.pair2 = (first, second, on_click = null) => {
	return new c_pair2(first, second, on_click);
};

//////////////////////////////////////////////////////////////////////////////////////
//
// pair
//
//////////////////////////////////////////////////////////////////////////////////////

function c_pair(first_image, second_image, f = null) {
	this.first_image  = first_image;
	this.second_image = second_image;
	this.f            = f;
}

c_pair.prototype.draw = function() {
	this.first_image.draw();
	this.second_image.draw();
};

c_pair.prototype.click = function() {
	const images = [this.first_image.image, this.second_image.image];
	if (click_test(images, this.x, this.y, this.s)) {
		if (this.first_image.f  !== null) this.first_image.f() ;
		if (this.second_image.f !== null) this.second_image.f();
		if (this.f              !== null) this.f()             ;
		return true;
	} else {
		return false;
	}
};

window.pair = (first_image, second_image, f = null) => {
	return new c_pair(first_image, second_image, f);
};

//////////////////////////////////////////////////////////////////////////////////////
//
// loop
//
//////////////////////////////////////////////////////////////////////////////////////

function c_loop(objs, t) {
	assert(Array.isArray(objs));
    this.objs    = objs;
    this.t       = t;
    this.i       = 0;
    this.id      = null;
	this.started = false;
}

c_loop.prototype.start = function() {
	if (this.started) return;
	this.started = true;
	this.id = setTimeout(this.next.bind(this), this.t);
	on_resize();
};

c_loop.prototype.stop = function() {
	if (!this.started) return;
	this.started = false;
	if (this.id !== null) {
		clearTimeout(this.id);
		this.id = null;
	}
	on_resize();
};

c_loop.prototype.draw = function() {
	if (!this.started) return;
    this.objs[this.i].draw();
};

c_loop.prototype.next = function() {
	if (!this.started) return;
	if (++this.i === this.objs.length) this.i = 0;
    this.id = setTimeout(this.next.bind(this), this.t);
	on_resize();
};

window.loop = (objs, t = 300) => {
    return new c_loop(objs, t);
};

//////////////////////////////////////////////////////////////////////////////////////
//
// array
//
//////////////////////////////////////////////////////////////////////////////////////

function c_array(images, f = null) {
	this.images = images;
	this.f      = f;
}

c_array.prototype.draw = function() {
	this.images.forEach(image => image.draw());
};

// -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
// call to click_test needs to be fixed
//
c_array.prototype.click = function() {
	if (click_test(this.images.map(i => i.image), this.x, this.y, this.s)) {
		this.images.forEach(image => { if (image.f !== null) image.f(); });
		if (this.f !== null) this.f();
		return true;
	} else {
		return false;
	}
};

window.array = (images, f = null) => {
	return new c_array(images, f);
};

//////////////////////////////////////////////////////////////////////////////////////
//
// checkbox 2
//
//////////////////////////////////////////////////////////////////////////////////////

function c_checkbox2(o_off, o_on, f_on = null, f_off = null) {
	this.o_off = o_off;
	this.o_on  = o_on ;
	this.f_on  = f_on ;
	this.f_off = f_off;
	this.on    = false;
}

c_checkbox2.prototype.draw = function() {
	if (this.on) {
		if (this.o_on !== null) this.o_on.draw();
	} else {
		this.o_off.draw();	
	}
};

c_checkbox2.prototype.set_off = function() {
	if (this.on) {
		this.on = false;
		on_resize();
	}
};

c_checkbox2.prototype.set_on = function() {
	if (!this.on) {
		this.on = true;
		on_resize();
	}
};

c_checkbox2.prototype.click = function() {
	if (this.on) {
		if (this.o_on === null) {
			return false;
		} else {
			if (this.o_on.click()) {
				this.on = false;
				if (this.f_off !== null) this.f_off();
				return true;
			} else {
				return false;
			}
		}
	} else {
		if (this.o_off.click()) {
			this.on = true;
			if (this.f_on !== null) this.f_on();
			return true;
		} else {
			return false;
		}
	}
};

window.checkbox2 = (o_off, o_on = null, f_on = null, f_off = null) => {
	return new c_checkbox2(o_off, o_on, f_on, f_off);r
};

//////////////////////////////////////////////////////////////////////////////////////
//
// checkbox
//
//////////////////////////////////////////////////////////////////////////////////////

function c_checkbox(off_array, on_array) {
	this.off_array = off_array;
	this.on_array  = on_array ;
	this.on        = false    ;
}

c_checkbox.prototype.draw = function() {
	if (this.on) {
		if (this.on_array !== null) this.on_array.draw();
	} else {
		this.off_array.draw();	
	}
};

c_checkbox.prototype.click = function() {
	if (this.on) {
		if (this.on_array === null) {
			return false;
		} else {
			if (this.on_array.click()) {
				this.on = false;
				return true;
			} else return false;
		}
	} else {
		if (this.off_array.click()) {
			this.on = true;
			return true;
		} else {
			return false;
		}
	}
};

window.checkbox = (off_array, on_array = null) => {
	return new c_checkbox(off_array, on_array);
};

////////////////////////////////////////////////////////////////////////////////////////
//
// once 2
//
////////////////////////////////////////////////////////////////////////////////////////

function c_once2(objs, t = 100, on_end = null) {
	assert(Array.isArray(objs));
    this.objs    = objs;
    this.on_end  = on_end;
    this.t       = t;
    this.i       = 0;
	this.id      = null;
	this.started = false;
}

c_once2.prototype.start = function() {
	if (this.started) return;
	this.started = true;
	this.i  = 0;
	this.id = setTimeout(this.next.bind(this), this.t);
	on_resize();
};

c_once2.prototype.stop = function() {
	if (!this.started) return;
	this.started = false;
	this.i = 0;
	if (this.id !== null) {
		cancelTimeout(this.id);
		this.id = null;
	}
	on_resize();
};

c_once2.prototype.draw = function() {
	if (!this.started) return;
    this.objs[this.i].draw();
};

c_once2.prototype.next = function() {
	if (!this.started) return;
	if (++this.i === this.objs.length) {
		this.i = 0;
		this.id = null;
		this.started = false;
        if (this.on_end !== null) this.on_end();
    } else {
        setTimeout(this.next.bind(this), this.t);
    }
	on_resize();
};

window.once2 = (objs, t = 100, on_end = null) => {
    return new c_once2(objs, t, on_end);
};

////////////////////////////////////////////////////////////////////////////////////////
//
// once
//
////////////////////////////////////////////////////////////////////////////////////////

function c_once(t, f, objs) {
    this.t     = t;
    this.f     = f;
    this.objs  = objs;
    this.i     = null;
}

c_once.prototype.draw = function() {
	if (this.i === null) return;
    this.objs[this.i].draw();
};

c_once.prototype.next = function() {
	if (this.i === null) return;
	++this.i;
	if (this.i === this.objs.length) {
		this.i = null;
        if (this.f !== null) this.f();
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
	if (this.i === 0) {
		if (this.objs[0].click()) {
			this.next();
			return true;
		}
	}
    return false;
};

window.once = (t, f, objs) => {
    return new c_once(t, f, objs);
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

function c_anim_button(objs, t, f) {
	assert(objs.length > 1);
	this.checkbox = checkbox(objs[0], null);
	this.once     = once(t, c_anim_button_action.bind(this, f), objs.slice(1));
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

window.anim_button = (objs, t, f = null) => new c_anim_button(objs, t, f);

//////////////////////////////////////////////////////////////////////////////////////
//
// radio buttons 2
//
//     off_func called before on_func
//
//////////////////////////////////////////////////////////////////////////////////////




// function c_radio_buttons2(radio_buttons) {
// 	this.radio_buttons = radio_buttons;
// }

// c_radio_buttons2.prototype.draw = function() {
// 	this.radio_buttons.forEach(radio_button => radio_button.draw());
// }

// c_radio_buttons2.prototype.click = function() {
// 	let on_radio_button = null;
// 	for (let i = 0; i < this.radio_buttons.length; ++i) {
// 		if (this.radio_buttons[i].on) {
// 			on_radio_button = this.radio_buttons[i];
// 			break;
// 		}
// 	}
// 	for (let i = 0; i < this.radio_buttons.length; ++i) {
// 		if (this.radio_buttons[i].click()) {
// 			on_checkbox.set_off();
			
// 			if (this.radio_buttons[i] === this.on_button) {
// 				this.radio_buttons[i].set_off();
// 				this.on_button = null;
// 			} else {
// 				if (this.on_button !== null) {
// 					this.on_button.set_off();
// 				}
// 				this.radio_buttons[i].set_on();				
// 				this.on_button = this.radio_buttons[i];
// 			}
// 			return true;
// 		}
// 	}
// 	return false;
// };

// window.radio_buttons2 = (checkboxes) => {
// 	return new c_radio_buttons2(checkboxes);
// };


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

c_radio_buttons.prototype.clear = function() {
	if (this.on_button !== null) {
		this.on_button.set_off();
		this.on_button = null;
	}
};

window.radio_buttons = (...radio_buttons) => {
	return new c_radio_buttons(radio_buttons);
};

///////////////////////////////////////////////////////////////////////////////////////////
//
// page
//
///////////////////////////////////////////////////////////////////////////////////////////

window.back_button = pair2(
    image("./global/images/upper_left_green.png"   ),
    image("./global/images/upper_left_border.png")
);

window.silence_button = checkbox2(
    pair2(
		image("./global/images/upper_right_green.png" ),
		image("./global/images/upper_right_border.png"), 
		silence_on
	),
    pair2(
		image("./global/images/upper_right_white.png" ),
		image("./global/images/upper_right_border.png"), 
		silence_off
	)
);

// window.on_click  = null; // set in page start func
// window.click_x   = null;
// window.click_y   = null;

// window.on_resize = null; // set in page start func

// canvas.addEventListener('click', e => {
// 	init_audio();
//     click_x = (e.pageX - left) / scale;
// 	click_y = (e.pageY - top ) / scale;
// 	if (on_click !== null) on_click();
// });

// addEventListener('resize', _ => {
// 	if (on_resize !== null) on_resize();
// });

// window.start_page = (draw_list, click_list, start_list = null, pathname = null) => {
// 	on_resize = _ => draw_list.forEach(o => o.draw());
// 	on_click  = _ => click_list.some(o => o.click());
// 	if (start_list !== null) start_list.forEach(o => o.start());
// 	if (pathname !== null) set_item('page', pathname);
// 	draw();
// }

///////////////////////////////////////////////////////////////////////////////////////////
//
// math stuff
//
///////////////////////////////////////////////////////////////////////////////////////////

window.PHI = 1.61803398875;

// See http://www.phy.mtu.edu/~suits/NoteFreqCalcs.html
window.scale = (octave_tones, base_frequency, half_notes_away_from_base) => {
	return base_frequency * Math.pow(Math.pow(2, 1.0 / octave_tones), half_notes_away_from_base);
};
