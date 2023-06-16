import start_away from "../index.js";

function c_tone(f, b = 0) {
	this.f = f   ;
	this.b = b   ;
	this.g = null;
}

c_tone.prototype.start = function() {
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
	this.g.gain.setTargetAtTime(1, audio.currentTime, .1);
	return this;
};

c_tone.prototype.stop = function() {
	assert(this.g !== null);
	this.g.gain.setTargetAtTime(0, audio.currentTime, .05);
	let g = this.g;
	this.g = null;
	setTimeout(_ => g.disconnect(), 1000);
};

const tone = (f, b = 0) => new c_tone(f, b);

const tones = [
	tone(PHI             , 1),
	tone(scale(6, 100, 0), 3),
	tone(scale(6, 100, 1), 3),
	tone(scale(6, 100, 2), 3),
	tone(scale(6, 100, 3), 3),
	tone(scale(6, 100, 4), 3),
	tone(scale(6, 100, 5), 3)
];

function c_img(src) {
    this.image     = new Image();
    this.image.src = src;
}

c_img.prototype.draw = function() {	
	if (this.image.complete) {
		ctx.drawImage(this.image, 0, 0);
	} else {
		this.image.onload = on_resize;
	}
};

const img = n => new c_img("./away/far_away/images/" + n + ".png");
const click = img => click_test(img.image);

const borders = [
	img("border_0"),
	img("border_1"),
	img("border_2"),
	img("border_3"),
	img("border_4"),
	img("border_5"),
	img("border_6")
];

const colors = [
	[ img("white_0"), img("green_0") ],
	[ img("white_1"), img("green_1") ],
	[ img("white_2"), img("green_2") ],
	[ img("white_3"), img("green_3") ],
	[ img("white_4"), img("green_4") ],
	[ img("white_5"), img("green_5") ],
	[ img("white_6"), img("green_6") ]
];

const state = Array(borders.length).fill(0);

const is_playing = _ => state.some(i => i === 1);

const stop_page_audio = _ => {
	assert(on_resize !== draw_page); 
	assert(is_playing());
	window.stop_page_audio = null;
	for (let i = 0; i < state.length; ++i) {
		if (state[i] === 1) {
			state[i] = 0;
			tones[i].stop();
		}
	}
};

const click_page = _ => {
	if (back_button.click()) {
		on_click = null;
		if (is_playing()) {
			window.stop_page_audio = stop_page_audio;
		} 
		start_away();
	} else if (silence_button.click()) { 
		return on_resize();
	} else for (let i = 0; i < state.length; ++i) {
		if (click(colors[i][0])) {
			if (!is_playing()) {
				if (window.stop_page_audio !== null) {
					window.stop_page_audio();
				}
			}
			if (state[i] === 0) {
				state[i] = 1;
				tones[i].start();
			} else {
				state[i] = 0;
				tones[i].stop();
			}
			on_resize();
			return;
		}
	}
};

const draw_page = _ => {
	bg_blue.draw();
	for (let i = 0; i < state.length; ++i) {
		colors[i][state[i]].draw();
		borders[i].draw();
	}
	back_button.draw();
	silence_button.draw();
};

export default _ => {
	if (is_playing()) {
		assert(window.stop_page_audio === stop_page_audio);
		window.stop_page_audio = null;
	}
	set_item('page', "./away/far_away/index.js");
	on_resize = draw_page;
	on_click = click_page;
	on_resize();
};
