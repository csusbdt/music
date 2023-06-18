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
	c_button.call(this, [white, red], border, x, y);
	this.wave = wave;
}

c_on_button.prototype.stop = function() {
	if (this.i !== 0) {
		this.i = 0;
		this.wave.stop();
	}
};

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

const on_buttons = [buttons[0], buttons[3]];

const is_playing = _ => {
	return waves.some(wave => wave.g !== null);
};

const click_page = _ => {
	if (back_button.click()) {
		if (is_playing()) window.stop_page_audio = stop_page_audio;
		start_home();
	} else if (buttons.some(button => button.click())) {
		on_resize();
	}
};

const draw_page = _ => {
	bg_blue.draw();
	buttons.forEach(button => button.draw());
	back_button.draw();
};

const stop_page_audio = _ => {
	assert(is_playing());
	window.stop_page_audio = null;
	on_buttons.forEach(button => button.stop());
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
