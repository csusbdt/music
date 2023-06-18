import start_home from "../home/index.js";
import c_img      from "./img.js";
import c_wave     from "./wave.js";
import c_button   from "./button.js";

const red    = new c_img("./compose/images/red.png"   , 120, 205, 36);
const green  = new c_img("./compose/images/green.png" , 120, 205, 36);
const blue   = new c_img("./compose/images/blue.png"  , 120, 205, 36);
const yellow = new c_img("./compose/images/yellow.png", 120, 205, 36);
const white  = new c_img("./compose/images/white.png" , 120, 205, 36);
const black  = new c_img("./compose/images/black.png" , 120, 205, 36);
const border = new c_img("./compose/images/border.png", 120, 205, 36);

Object.setPrototypeOf(c_on_button.prototype      , c_button.prototype);
Object.setPrototypeOf(c_volume_button.prototype  , c_button.prototype);
Object.setPrototypeOf(c_binaural_button.prototype, c_button.prototype);

function c_on_button(wave, x = 0, y = 0) {
	c_button.call(this, [blue, green], border, x, y);
	this.wave = wave;
}

c_on_button.prototype.click = function() {
	if (!c_button.prototype.click.call(this)) {
		return false;
	} else if (this.i === 0) {
		this.wave.stop();
	} else {
		if (window.stop_page_audio !== null) {
			window.stop_page_audio();
			assert(window.stop_page_audio === null);
		}
		this.wave.start();
	}
	return true;
};

function c_volume_button(wave, x = 0, y = 0) {
	c_button.call(this, [white, green, red, yellow], border, x, y);
	this.wave = wave;
}

c_volume_button.prototype.click = function() {
	if (!c_button.prototype.click.call(this)) {
		return false;
	} else {
		this.wave.volume([.4, .6, .8, 1][this.i]);
	}
	return true;
};

function c_binaural_button(wave, x = 0, y = 0) {
	c_button.call(this, [blue, green, red, yellow, white, black], border, x, y);
	this.wave = wave;
}

// deep sleep      (delta .5 - 4) 
// light sleep     (theta 4 - 8)
// idle            (alpha 8 - 12)
// attentiveness   (beta 12 - 30)
// problem-solving (gamma 25 - 100)
c_binaural_button.prototype.click = function() {
	if (!c_button.prototype.click.call(this)) {
		return false;
	} else {
		this.wave.binaural([0, 2, 4, 8, 16, 32][this.i]);
		return true;
	}
};

const waves = [
	new c_wave(1, 80, 0, 0, null),
	new c_wave(1, 80, 0, 0, null)
];

const buttons = [
	new c_on_button      (waves[0], 300, 300),
	new c_volume_button  (waves[0], 300, 400),
	new c_binaural_button(waves[0], 300, 500),
	
	new c_on_button      (waves[1], 400, 300),
	new c_volume_button  (waves[1], 400, 400),
	new c_binaural_button(waves[1], 400, 500)
];

const is_playing = _ => {
	return waves.some(wave => wave.g !== null);
};

const click_page = _ => {
	if (buttons.some(button => button.click())) {
		on_resize();
	}
};

const draw_page = _ => {
	bg_blue.draw();
	buttons.forEach(button => button.draw());
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

