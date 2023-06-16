import start_home from "../home/index.js";

function c_wave(f, v, b = 0, w = 0) {
	this.f = f   ;
	this.v = v   ;
	this.b = b   ;
	this.w = w   ;
	this.g = null;
}

c_wave.prototype.start = function() {
	assert(this.g === null);
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
	const o_w = audio.createOscillator();
	o_w.frequency.value = this.w;
	o_w.connect(this.g);
	o_w.start();
	this.g.gain.setTargetAtTime(1, audio.currentTime, .1);
	return this;
};

c_wave.prototype.stop = function() {
	assert(this.g !== null);
	this.g.gain.setTargetAtTime(0, audio.currentTime, .05);
	let g = this.g;
	this.g = null;
	setTimeout(_ => g.disconnect(), 1000);
};

const wave = (f, v, b = 0, w = 0) => new c_wave(f, v, b, w);

function c_img(src, x = 0, y = 0) {
    this.image     = new Image();
    this.image.src = src;
	this.x         = x;
	this.y         = y;
}

c_img.prototype.draw = function(x = 0, y = 0) {	
	if (this.image.complete) {
		ctx.drawImage(this.image, this.x + x, this.y + y);
	} else {
		this.image.onload = on_resize;
	}
};

const img   = (  n, x = 0, y = 0) => new c_img("./compose/images/" + n + ".png", x, y);
const click = (img, x = 0, y = 0) => click_test(img.image, img.x + x, img.y + y);

const red    = img("red"   ); 
const green  = img("green" ); 
const blue   = img("blue"  ); 
const yellow = img("yellow"); 
const white  = img("white" ); 
const black  = img("black" ); 
const border = img("border"); 

const volume_colors   = [ blue, white, green, red, yellow ];
const octave_colors   = [ white, green, red, yellow ];
const step_colors     = [ white, green, red, yellow ];
const halfstep_colors = [ white, red ];
const waver_colors    = [ white, green, red, yellow ];
const binaural_colors = [ white, green, red, yellow ];
const duration_colors = [ white, green, red, yellow ];

const colors = [
	volume_colors  ,
	octave_colors  ,
	step_colors    ,
	halfstep_colors,
	waver_colors   ,
	binaural_colors,
	duration_colors
];

const waves = [];

const cols = 7;

const volume    = Array(cols).fill(0);
const octave    = Array(cols).fill(0);
const step      = Array(cols).fill(0);
const halfstep  = Array(cols).fill(0);
const waver     = Array(cols).fill(0);
const binaural  = Array(cols).fill(0);
const duration  = Array(cols).fill(0);

const state = [
	volume  , 
	octave  , 
	step    , 
	halfstep, 
	waver   , 
	binaural, 
	duration	
];

const rows = state.length;

const next_volume = c => {
	if (++volume[c] === volume_colors.length) volume[c] = 0;
};

const next_octave = c => {
	if (++octave[c] === octave_colors.length) octave[c] = 0;
};

const next_step = c => {
	if (++step[c] === step_colors.length) step[c] = 0;
};

const next_halfstep = c => {
	if (++halfstep[c] === halfstep_colors.length) halfstep[c] = 0;
};

const next_waver = c => {
	if (++waver[c] === waver_colors.length) waver[c] = 0;
};

const next_binaural = c => {
	if (++binaural[c] === binaural_colors.length) binaural[c] = 0;
};

const next_duration = c => {
	if (++duration[c] === duration_colors.length) duration[c] = 0;
};

const next = [
	next_volume  , 
	next_octave  , 
	next_step    , 
	next_halfstep, 
	next_waver   , 
	next_binaural, 
	next_duration
];

const row_y = row => 0 + 110 * row;
const col_x = col => 0 + 122 * col;

const click_buttons = _ => {
	for (let c = 0; c < cols; ++c) {
		for (let r = 0; r < rows; ++r) {
			if (click(red, col_x(c), row_y(r))) {
				if (waves.length === 0) {
					on_click = null;
					start_waves(_ => {
						on_click = page_click;
						next[r](c);
						on_resize();
					});
				} else {
					next[r](c);
					on_resize();
				}
				return;
			}
		}
	}
	return false;
};

const draw_colors = _ => {
	for (let c = 0; c < cols; ++c) {
		for (let r = 0; r < rows; ++r) {
			colors[r][state[r][c]].draw(col_x(c), row_y(r));			
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
		waves.push(wave(scale(6, 100, 0), 1, 3, 0).start());
	}
};

const stop_page_audio = _ => {
	assert(on_resize !== draw_page); 
	assert(waves.length !== 0);
	window.stop_page_audio = null;
	stop_waves();
};

const click_page = _ => {
	if (back_button.click()) {
		if (waves.length !== 0) {
			window.stop_page_audio = stop_page_audio;
		}
		start_home();
	} 
	else if (silence_button.click()) on_resize();
	else if (waves.length === 0) start_waves();
	else click_buttons();
};

const draw_page = _ => {
	bg_blue.draw();
	back_button.draw();
	silence_button.draw();
	draw_colors();
	draw_borders();
};

export default _ => {
	if (waves.length !== 0) {
		assert(window.stop_page_audio === stop_page_audio);
		window.stop_page_audio = null;
	}	
	set_item('page', "./compose/index.js");
	on_click = click_page;	
	on_resize = draw_page;
	on_resize();
};
