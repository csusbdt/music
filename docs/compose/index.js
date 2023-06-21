import start_home from "../home/index.js"   ;
import c_img      from "../global/img.js"   ;
import c_button   from "../global/button.js";
import c_wave     from "./wave.js"          ;

const upper_right_green  = new c_img("./global/images/upper_right_green.png" );
const upper_right_border = new c_img("./global/images/upper_right_border.png");

const red    = new c_img("./compose/images/red.png"   , 120, 205, 36);
const green  = new c_img("./compose/images/green.png" , 120, 205, 36);
const blue   = new c_img("./compose/images/blue.png"  , 120, 205, 36);
const yellow = new c_img("./compose/images/yellow.png", 120, 205, 36);
const white  = new c_img("./compose/images/white.png" , 120, 205, 36);
const black  = new c_img("./compose/images/black.png" , 120, 205, 36);
const border = new c_img("./compose/images/border.png", 120, 205, 36);

Object.setPrototypeOf(c_on_button.prototype       , c_button.prototype);
Object.setPrototypeOf(c_volume_button.prototype   , c_button.prototype);
Object.setPrototypeOf(c_frequency_button.prototype, c_button.prototype);
Object.setPrototypeOf(c_binaural_button.prototype , c_button.prototype);
Object.setPrototypeOf(c_duration_button.prototype , c_button.prototype);

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

function c_frequency_button(wave, x = 0, y = 0) {
	c_button.call(this, [white, green, red, yellow], border, x, y);
	this.wave = wave;
}

const set_frequency = (wave, octave, steps, halfsteps) => {
	wave.frequency(scale(4, Math.pow(2, octave) * 60, 2 * steps + halfsteps));
};

c_frequency_button.prototype.click = function() {
	if (!c_button.prototype.click.call(this)) {
		return false;
	} else {
		set_frequency(this.wave, 1, this.i, 0);
		return true;
	}
};

function c_duration_button(wave, x = 0, y = 0) {
	c_button.call(this, [white, green, red, yellow], border, x, y);
	this.wave = wave;
}

c_duration_button.prototype.click = function() {
	if (!c_button.prototype.click.call(this)) {
		return false;
	} else {
		// TODO: remove d from wave
		this.wave.d = [null, .50, 1, 2][this.i];
		//this.wave.duration([null, .50, 1, 2][this.i]);
		return true;
	}
};

function c_binaural_button(wave, x = 0, y = 0) {
	c_button.call(this, [blue, green, red, yellow, white, black], border, x, y);
	this.wave = wave;
}

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

const on_buttons = [
	new c_on_button      (waves[0], 200, 200),
	new c_on_button      (waves[1], 300, 200)
];

const buttons = [
	...on_buttons,
	
	new c_duration_button (waves[0], 200, 300),
	new c_frequency_button(waves[0], 200, 400),
	new c_volume_button   (waves[0], 200, 500),
	new c_binaural_button (waves[0], 200, 600),
	
	new c_duration_button (waves[1], 300, 300),
	new c_frequency_button(waves[1], 300, 400),
	new c_volume_button   (waves[1], 300, 500),
	new c_binaural_button (waves[1], 300, 600)
];

let play_id = null;

const play = _ => {
	if (!is_playing()) {
		if (play_id !== null) {
			clearTimeout(play_id);
			play_id = null;
		}
		return;
	}
	let t = 0;
	waves.forEach(wave => {
		if (wave.g !== null) {
			if (wave.d === null) {
				if (wave.g.gain.value < wave.v) {
					wave.g.gain.setTargetAtTime(wave.v, audio.currentTime, .05);
				}
			} else {
				wave.g.gain.setTargetAtTime(wave.v, audio.currentTime + t, .05);
				t += wave.d;
				wave.g.gain.setTargetAtTime(0, audio.currentTime + t, .05);
			}
		}
	});
	if (t > 0) play_id = setTimeout(_ => { 
		play_id = null; 
		play(); 
	}, t * 1000);
};

const is_playing = _ => {
	return waves.some(wave => wave.g !== null);
};

const click_page = _ => {
	if (back_button.click()) {
		if (is_playing()) window.stop_page_audio = stop_page_audio;
		start_home();
		return;
	} else if (upper_right_green.click()) {
		if (window.stop_page_audio !== null) window.stop_page_audio();
		else stop_page_audio();
		on_resize();
	} else if (buttons.some(button => button.click())) {
		on_resize();
	}
	if (is_playing() && play_id === null) {
		play();
	}
};

const draw_page = _ => {
	bg_blue.draw();
	buttons.forEach(button => button.draw());
	back_button.draw();
	upper_right_green.draw();
	upper_right_border.draw();
};

const stop_page_audio = _ => {
	window.stop_page_audio = null;
	on_buttons.forEach(button => button.stop());
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
