import start_home from "../home/index.js";

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

// const waver_tone_0 = tone(PHI, 1, 0);
// const waver_tone_0 = tone(scale(6, 240, 0), 1, 3);

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

const stop_waves = (cb = null) => {
	assert(waves.length !== 0);
	assert(window.stop_page_audio === null);
	waves.length = 0;
	stop_audio(cb);
};

const start_waves = cb => {
	assert(cb !== undefined);
	assert(waves.length === 0);
	assert(on_resize = draw_page);
	if (window.stop_page_audio !== null) {
		on_click = null;
		window.stop_page_audio(_ => {
			assert(window.stop_page_audio === null);
			assert(gain === null);
			on_click = click_page;
			start_waves(cb);
		});
	} else {
		start_audio();
		for (let col = 0; col < cols; ++col) {

// HERE
///////////////////////////////////////////////////////////////////////////////////////////	
			waves.push(tone(120, 1, 3));
		}
		cb();
//		click_page();
	}
};

const stop_page_audio = (cb = null) => {
	assert(on_resize !== draw_page); 
	assert(waves.length !== 0);
	window.stop_page_audio = null;
	stop_waves(cb);
};

const click_page = _ => {
	if (back_button.click()) {
		window.stop_page_audio = stop_page_audio;
		start_home();
	} 
	else if (waves.length === 0) start_waves();
	else click_buttons();
};

const draw_page = _ => {
	bg_blue.draw();
	back_button.draw();
	draw_colors();
	draw_borders();
};

export default _ => {
	if (waves.length !== 0) {
		assert(window.stop_page_audio === stop_page_audio);
		assert(gain !== null);
		window.stop_page_audio = null;
	}	
	set_item('page', "./compose/index.js");
	on_click = click_page;	
	on_resize = draw_page;
	on_resize();
};
