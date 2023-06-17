import start_home from "../home/index.js";

function c_img(src, cx = 0, cy = 0, cr = null) {
    this.image     = new Image();
    this.image.src = src;
	this.cx         = cx; 
	this.cy         = cy; 
	this.cr         = cr;
}

c_img.prototype.draw = function(x = 0, y = 0) {	
	if (this.image.complete) {
		ctx.drawImage(this.image, x, y);
	} else {
		this.image.onload = on_resize;
	}
};

c_img.prototype.click = function(draw_x = 0, draw_y = 0) {
	if (!this.image.complete) return false;
	if (this.r === null) {
		return will_click(this.image, draw_x, draw_y);
	} else {
		const cx = this.cx + draw_x;
		const cy = this.cy + draw_y;
		const dx = cx - click_x;
		const dy = cy - click_y;
		return dx * dx + dy * dy < this.cr * this.cr;
	}
};

const red    = new c_img("./compose/images/red.png"   , 120, 205, 36);
const green  = new c_img("./compose/images/green.png" , 120, 205, 36);
const blue   = new c_img("./compose/images/blue.png"  , 120, 205, 36);
const yellow = new c_img("./compose/images/yellow.png", 120, 205, 36);
const white  = new c_img("./compose/images/white.png" , 120, 205, 36);
const border = new c_img("./compose/images/border.png", 120, 205, 36);

function c_button(colors, border, actions, x = 0, y = 0) {
	if (!Array.isArray(colors)) colors = [colors];
	this.colors = colors;
	this.border = border;
	if (!Array.isArray(actions)) actions = [actions];
	this.actions = actions;
	this.x = x;
	this.y = y;
	this.i = 0;
}

c_button.prototype.draw = function() {
	this.colors[this.i].draw(this.x, this.y);
	this.border.draw(this.x, this.y);
};

c_button.prototype.click = function() {
	if (this.colors[0].click(this.x, this.y)) {
		if (++this.i === this.colors.length) this.i = 0;
		this.actions[this.i].call(this);
		return true;
	} else {
		return false;
	}
};

function c_wave(v = 0, f = 0, b = 0, w = 0, d = null) {
	this.v = v;
	this.f = f;
	this.b = b;
	this.w = w;
	this.d = d; // null=always playing, 0=not playing, otherwise seconds of duration
	this.g       = null;
	this.o_left  = null;
	this.o_right = null;
	this.o_w     = null;
	this.id      = null;
}

c_wave.prototype.start = function() {
	assert(this.g === null);
	this.g = audio.createGain();
	this.g.connect(gain);
	this.g.gain.value = 0;
	const merger = new ChannelMergerNode(audio);
	merger.connect(this.g);
	this.o_left  = audio.createOscillator();
	this.o_right = audio.createOscillator();
	this.o_left.connect(merger, 0, 0);
	this.o_right.connect(merger, 0, 1);
	this.o_left.frequency.value = this.f; 
	this.o_right.frequency.value = this.f + this.b;
	this.o_left.start();
	this.o_right.start();
	this.o_w = audio.createOscillator();
	this.o_w.frequency.value = 0;
	this.o_w.connect(this.g);
	this.o_w.start();
	this.g.gain.setTargetAtTime(this.v, audio.currentTime, .05);
	if (this.d !== null) {
		this.id = setTimeout(function() {
			this.id = null;
			this.stop();
		}.bind(this), this.d * 1000);
	}
	return this;
};

c_wave.prototype.stop = function() {
	assert(this.g !== null);
	if (this.id !== null) {
		clearTimeout(this.id);
		this.id = null;
	}
	this.g.gain.setTargetAtTime(0, audio.currentTime, .05);
	let g = this.g;
	this.g = null;
	setTimeout(_ => g.disconnect(), 1000);
};

const wave = new c_wave(1, 100, 3, 3, null);

const button = new c_button([blue, red], border, [
	function() {
		wave.stop();
	},
	function() { 
		if (window.stop_page_audio !== null) {
			window.stop_page_audio();
			assert(window.stop_page_audio === null);
		}
		wave.start(); 
	}
], 300, 300);

const is_playing = _ => {
	return wave.g !== null;
};

const click_page = _ => {
	if (button.click()) {
		on_resize();
	}
};

const draw_page = _ => {
	bg_blue.draw();
	button.draw();
//	back_button.draw();
//	silence_button.draw();
};

const stop_page_audio = _ => {
	assert(is_playing());
	window.stop_page_audio = null;
	wave.stop();
	assert(!is_playing());
};

export default _ => {
	if (is_playing()) {
		assert(window.stop_page_audio === stop_page_audio);
		window.stop_page_audio = null;
	}	
	set_item('page', "./compose/index.js");
	on_click = click_page;	
	on_resize = draw_page;
	on_resize();
};


/*
const cols = 7;
const rows = 8;
const waves = [];

const row_y = row => -12 + 100 * row;
const col_x = col => 0 + 122 * col;


const on_colors       = [ blue , green, red ];
const volume_colors   = [ white, green, red, yellow ];
const octave_colors   = [ white, green, red, yellow ];
const step_colors     = [ white, green, red, yellow ];
const halfstep_colors = [ white, red ];
const waver_colors    = [ white, green, red, yellow ];
const binaural_colors = [ white, green, red, yellow ];
const duration_colors = [ white, green, red, yellow ];

const colors = [
	on_colors      ,
	volume_colors  ,
	octave_colors  ,
	step_colors    ,
	halfstep_colors,
	waver_colors   ,
	binaural_colors,
	duration_colors
];

function c_wave() {
	this.on_i       = 0; // 0=off, 1=play duration, 2=play continuously
	this.volume_i   = 1;
	this.octave_i   = 1;
	this.step_i     = 0;
	this.halfstep_i = 0;
	this.waver_i    = 0;
	this.binaural_i = 0;
	this.duration_i = 0;
	this.g          = null;
}

c_wave.prototype.start = function() {
	assert(this.g === null);
	this.g = audio.createGain();
	this.g.connect(gain);
	this.g.gain.value = 0;
	const merger = new ChannelMergerNode(audio);
	merger.connect(this.g);
	this.o_left  = audio.createOscillator();
	this.o_right = audio.createOscillator();
	this.o_left.connect(merger, 0, 0);
	this.o_right.connect(merger, 0, 1);
	this.o_left.frequency.value = 0; 
	this.o_right.frequency.value = 0;
	this.o_left.start();
	this.o_right.start();
	this.o_w = audio.createOscillator();
	this.o_w.frequency.value = 0;
	this.o_w.connect(this.g);
	this.o_w.start();
	this.id = null;
//	this.g.gain.setTargetAtTime(0, audio.currentTime, .1);
	return this;
};

c_wave.prototype.stop = function() {
	assert(this.g !== null);
	this.g.gain.setTargetAtTime(0, audio.currentTime, .05);
	let g = this.g;
	this.g = null;
	setTimeout(_ => g.disconnect(), 1000);
};

c_wave.prototype.draw = function(c) {
	assert(c !== undefined);
	on_colors      [this.on_i      ].draw(col_x(c), row_y(0));
	volume_colors  [this.volume_i  ].draw(col_x(c), row_y(1));
	octave_colors  [this.octave_i  ].draw(col_x(c), row_y(2));
	step_colors    [this.step_i    ].draw(col_x(c), row_y(3));
	halfstep_colors[this.halfstep_i].draw(col_x(c), row_y(4));
	waver_colors   [this.waver_i   ].draw(col_x(c), row_y(5));
	binaural_colors[this.binaural_i].draw(col_x(c), row_y(6));
	duration_colors[this.duration_i].draw(col_x(c), row_y(7));
};

c_wave.prototype.duration = function() {
	return [.25, .50, .75, 1][this.duration_i];
};

c_wave.prototype.update_frequency = function() {
	const f_left = scale(4, Math.pow(2, this.octave_i) * 60, 2 * this.step_i + this.halfstep_i);
	const f_right = f_left + [0, 2, 3, 5][this.binaural_i]; 
	this.o_left.frequency.setTargetAtTime(f_left, audio.currentTime, .1);
	this.o_right.frequency.setTargetAtTime(f_right, audio.currentTime, .1);
};

c_wave.prototype.next = function(r) {
	if (r === 0) {
		if (++this.on_i === 3) this.on_i = 0;
	} else if (r === 1) {
		if (++this.volume_i === 4) this.volume_i = 0;
		const v = [0, 0.33, 0.66, 1][this.volume_i];
		this.g.gain.setTargetAtTime(v, audio.currentTime, .1);
	} else if (r === 2) {
		if (++this.octave === 4) this.octave = 0;
		this.update_frequency();
	} else if (r === 3) {
		if (++this.step_i === 4) this.step_i = 0;
		this.update_frequency();
	} else if (r === 4) {
		if (++this.halfstep_i === 2) this.halfstep_i = 0;
		this.update_frequency();
	} else if (r === 5) {
		if (++this.waver_i === 4) this.waver_i = 0;
		const w = [0, 2, 3, 5][this.waver_i];
		this.o_w.frequency.setTargetAtTime(w, audio.currentTime, .1);
	} else if (r === 6) {
		if (++this.binaural_i === 4) this.binaural_i = 0;
		this.update_frequency();
	} else if (r === 7) {
		if (++this.duration_i === 4) this.duration_i = 0;
	}
};

const schedule = function() {
	let d = 0;
	waves.forEach(wave => {
		if (wave.on === 1) {
			d += wave.duration;
			const v = volume
			wave.g.gain.setTargetAtTime(v, audio.currentTime, .1);
		}
	});
	
	this.id = setTimeout(this.schedule.bind(this), d);
};


const click_buttons = _ => {
	for (let c = 0; c < cols; ++c) {
		for (let r = 0; r < rows; ++r) {
			if (click(red, col_x(c), row_y(r))) {
				if (waves.length === 0) start_waves();
				waves[c].next(r);
				on_resize();
				return true;
			}
		}
	}
	return false;
};

const draw_colors = _ => {
	if (waves.length === 0) {
		for (let c = 0; c < cols; ++c) {
			for (let r = 0; r < rows; ++r) {
				if (r === 0) blue.draw(col_x(c), row_y(r));
				else white.draw(col_x(c), row_y(r));
			}
		}
	} else {
		for (let c = 0; c < cols; ++c) {
			waves[c].draw(c);
		}
	}
};

const draw_borders = _ => {
	for (let col = 0; col < cols; ++col) {
		for (let row = 0; row < rows; ++row) {
			border.draw(col_x(col), row_y(row));
		}		
	}
};

const stop_waves = _ => {
	assert(waves.length !== 0);
	waves.forEach(w => w.stop());
	waves.length = 0;
};

const start_waves = _ => {
	assert(waves.length === 0);
	assert(on_resize = draw_page);
	if (window.stop_page_audio !== null) {
		window.stop_page_audio();
		assert(window.stop_page_audio === null);
	}
	for (let col = 0; col < cols; ++col) {
		waves.push(new c_wave().start());
	}
};
*/



// const start_page_audio = _ => {
// 	assert(!playing);
// 	if (window.stop_page_audio !== null) {
// 		window.stop_page_audio();
// 		window.stop_page_audio = stop_page_audio;
// 	}
// 	playing = true;
// };


// const click_buttons = _ => {
// 	if (click_on()) {
// 		if (window.stop_page_audio !== stop_page_audio && window.stop_page_audio !== null) {
// 			window.stop_page_audio();
// 			window.stop_page_audio = stop_page_audio;
// 		}
// 		++on_i < 3 || (on_i = 0);
// 		return true;
// 	}
// };

//const next = (i, n) => ++i < n || i = 0;

