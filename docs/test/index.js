import c_img   from "../global/img.js"    ;
import c_tone  from "../global/tone.js"   ;
import xbutton from "../global/xbutton.js";
import volume  from "../global/volume.js" ;

const back_button   = xbutton("upper_left_blue");
const audio_blue    = xbutton("upper_right_blue");
const audio_yellow  = xbutton("upper_right_yellow");

let img = n => new c_img("./test/images/" + n + ".png");

const ground_border = img("ground_border");
const ground_green  = img("ground_green");
const sky_red       = img("sky_red");
const sun_border    = img("sun_border");
const sun_yellow    = img("sun_yellow");
const sun_white     = sun_yellow.clone_white();
const ship_blue     = img("ship_blue");
const ship_yellow   = ship_blue.clone_yellow();
const ship_border   = img("ship_border");
const beam_border   = img("beam_border");
const beam_white    = img("beam_white");
const man_border    = img("man_border");
const man_yellow    = img("man_yellow");
const house_blue    = img("house_blue");
const house_border  = img("house_border");
const door_border   = img("door_border");
const door_red      = img("door_red");
const window_border = img("window_border");
const window_yellow = img("window_yellow");
const window_white  = window_yellow.clone_white();

const beam_off     = 0;
const beam_taking  = 1;
const beam_putting = 2;
let beam = beam_off;
const draw_beam  = _ => { 
	if (beam !== beam_off) {
		if (ship === ship_over_valley) {
			draw(beam_white); 
			draw(beam_border);
		} else {
			draw(beam_white, man_outside_house_x, man_outside_house_y); 
			draw(beam_border, man_outside_house_x, man_outside_house_y);
		}
	}
};

const ship_over_valley = 0;
const ship_over_house  = 1;
let ship = ship_over_valley;
const draw_ship  = _ => { 
	if (ship === ship_over_valley) {
		if (man === man_in_ship) draw(ship_yellow); 
		else draw(ship_blue); 
		draw(ship_border); 
	} else {
		if (man === man_in_ship) draw(ship_yellow, man_outside_house_x, man_outside_house_y); 
		else draw(ship_blue, man_outside_house_x, man_outside_house_y); 
		draw(ship_border, man_outside_house_x, man_outside_house_y); 
	}
};
const click_ship = _ => {
	if (ship === ship_over_valley) {
		if (click(ship_blue)) {
			if (beam === beam_taking) {
				man = man_in_ship;
				beam = beam_off;
			} else if (beam === beam_putting) {
				man = man_in_valley;
				beam = beam_off;
			} else if (man === man_in_ship) {
				beam = beam_putting;
			} else if (man === man_in_valley) {
				beam = beam_taking;
			} else {
				ship = ship_over_house;
			}
			return true;
		} else return false;
	} else {
		if (click(ship_blue, man_outside_house_x, man_outside_house_y)) {
			if (beam === beam_taking) {
				man = man_in_ship;
				beam = beam_off;
			} else if (beam === beam_putting) {
				man = man_outside_house;
				beam = beam_off;
			} else if (man === man_outside_house) {
				beam = beam_taking;
			} else {
				ship = ship_over_valley;
			}
			return true;
		} else return false;
	}
};

const man_in_valley       = 0;
const man_in_ship         = 1;
const man_in_house        = 2;
const man_outside_house   = 3;
const man_outside_house_x = -400;
const man_outside_house_y =  200;
let man = man_in_valley;
const draw_man  = _ => { 
	if (man === man_in_valley && beam === beam_off) {
		draw(man_yellow); 
		draw(man_border);
	} else if (man === man_outside_house && beam === beam_off) {
		draw(man_yellow, man_outside_house_x, man_outside_house_y); 
		draw(man_border, man_outside_house_x, man_outside_house_y);
	}
};
const click_man = _ => {
	if (man === man_in_valley && beam === beam_off) {
		if (click(man_yellow)) {
			man = man_in_house;
			return true;
		} else return false;
	} else if (man === man_outside_house && beam === beam_off) {
		if (click(man_yellow, man_outside_house_x, man_outside_house_y)) {
			man = man_in_valley;
			return true;
		} else return false;
	} else return false;
};

const draw_window = _ => { 
	if (sun === sun_off) {
		draw(window_yellow); 
	} else {
		draw(window_white); 
	}
	draw(window_border);
};

const sun_off = 0;
const sun_on  = 1;
let sun = sun_on;
const draw_sun = _ => { 
	if (sun === sun_off) {
		draw(sun_white); 
	} else {
		draw(sun_yellow); 
	}
	draw(sun_border);
};
const click_sun = _ => {
	if (sun_yellow.click()) {
		if (sun === sun_off) {
			sun = sun_on;
			night.on = false;
			night.stop();
			day.on = true;
			if (window.stop_audio !== null) day.start();
		} else {
			sun = sun_off;
			night.on = true;
			if (window.stop_audio !== null) night.start();
			day.on = false;
			day.stop();
		}
		return true;
	} else return false;
};

const draw_door  = _ => { 
	if (man === man_in_house) {
		draw(door_red);
		draw(door_border);
	}
};
const click_door = _ => {
	if (man === man_in_house) {	
		if (door_red.click()) {
			man = man_outside_house;
			return true;
		} else return false;
	} else return false;
};

//////////////////////////////////////////////////////////////////////////////////////
//
// sound pallets
//
//////////////////////////////////////////////////////////////////////////////////////

// 2, 1.62, 1.38, 1.24, 1.15, 1.09, 1.06, 1.03, 1.02, 1.01, 1.01, 1.01, 0 at i = 12
const p1 = (f, i) => f * (1 + Math.pow(PHI, -i));

// 2, 1.85, 1.72, 1.61, 1.52, 1.44, 1.38, 1.32, 1.27, 1.23, 1.20, 1.17, 1.14, ..., 0 at i = 34
const p2 = (f, i) => f * (1 + Math.pow(1 - 54/360, i));

// 2.61, 1.81, 1.40, 1.20, 1.10, 1.05, 1.03, 1.01, 1.01, 0 at i = 10
const p3 = (f, i) => f * (1 + PHI * Math.pow(2, -i));

// approx: 1.62, 1.31, 1.15, 1.07, 1.04, 1.02, 1.01, 0 at i = 9
const p4 = (f, i) => f * (1 + (PHI - 1) * Math.pow(2, -i));

//////////////////////////////////////////////////////////////////////////////////////
//
// c_beat_group
//
//////////////////////////////////////////////////////////////////////////////////////

function c_beat_group(dur, members = []) {
	this.dur     = dur;
	this.members = Array.from(members);
	this.joiners = [];
	this.id      = null;
}

c_beat_group.prototype.add = function(m) {
	if (this.members.length === 0) {
		this.members.push(m);
		this.start();
	} else if (this.members.indexOf(m) === -1 && this.joiners.indexOf(m) === -1) {
		this.joiners.push(m);
	}
};

c_beat_group.prototype.remove = function(m) {
	let i = this.members.indexOf(m);
	if (i !== -1) {
		m.stop();
		this.members.splice(i, 1);
	}
	i = this.joiners.indexOf(m);
	if (i !== -1) this.joiners.splice(i, 1);
	if (this.members.length === 0) this.stop();
};

c_beat_group.prototype.next = function() {
	while (this.joiners.length > 0) {
		const m = this.joiners.pop();
		m.start();
		this.members.push(m);
	}
	this.id = setTimeout(c_beat_group.prototype.next.bind(this), this.dur);
};

c_beat_group.prototype.start = function() {
	if (this.id === null) {
		while (this.joiners.length > 0) {
			this.members.push(this.joiners.pop());
		}
		this.members.forEach(m => m.start());
		this.id = setTimeout(c_beat_group.prototype.next.bind(this), this.dur);
	}
};

c_beat_group.prototype.stop = function() {
	if (this.id !== null) {
		clearTimeout(this.id);
		this.id = null;
		this.members.forEach(m => m.stop());
		while (this.joiners.length > 0) {
			this.members.push(this.joiners.pop());
		}
	}
};

//////////////////////////////////////////////////////////////////////////////////////
//
// c_seq
//
//////////////////////////////////////////////////////////////////////////////////////

function c_seq(dur, fs, vs = null) {
	this.dur  = dur;
	this.fs   = fs;
	this.vs   = vs === null ? Array(fs.length).fill(1) : vs;
	this.i    = fs.length - 1;
	this.id   = null;
	this.on   = false;
	this.tone = new c_tone(0, bin, 1);
}

c_seq.prototype.next = function() {
	if (++this.i === this.fs.length) this.i = 0;
	this.tone.set_fv(this.fs[this.i], this.vs[this.i]);
	this.id = setTimeout(c_seq.prototype.next.bind(this), this.dur);
};

c_seq.prototype.start = function() {
	if (this.on && this.id === null) {
		this.i = this.fs.length - 1;
		this.tone.start();
		this.next();
	}
};

c_seq.prototype.stop = function() {
	if (this.id !== null) {
		clearTimeout(this.id);
		this.id = null;
		this.tone.stop();
	}
};

c_seq.prototype.restart = function() {
	this.stop();
	this.start();
};

const dur   = 1000;
const bf    = 90;
//const bin   = bf * Math.pow(PHI, -7);
const bin   = bf * 54 / 360 * 54 / 360;
//const bin = 3;

const night = new c_seq(dur, [ p1(bf, 0), p1(bf, 3), p1(bf, 1), p1(bf, 1) ]);
const day   = new c_seq(dur, [ p1(bf, 6), p1(bf, 2), p1(bf, 0), p1(bf, 0) ]);
day.on = true;



const start_audio = _ => {
	if (day.on) day.start();
	if (night.on) night.start();
	window.start_audio = null;
	window.stop_audio  = stop_audio;
};

const stop_audio = _ => {
	day.stop();
	night.stop();
	window.start_audio = start_audio;
	window.stop_audio  = null;
};

const draw_audio = _ => {
	if (window.stop_audio === null) audio_blue.draw();
	else audio_yellow.draw();
};

const click_audio  = _ => {
	if (click(audio_blue)) {
		if (window.stop_audio !== null) window.stop_audio();
		else start_audio();
		return true;
	} else return false;
};

let start_external_audio = null;

const click_page = _ => {
	if (click(back_button)) {
		if (start_external_audio !== null) {
			if (window.stop_audio !== null) window.stop_audio();
			start_external_audio();
		}
		run("./home/index.js");
		return;
	}
	click_audio() || volume.click() || click_ship() || 
	click_man()   || click_sun()    || click_door();
	start_external_audio = null;
	on_resize();
};

const draw_page = _ => {
	draw(bg_red);
	draw(ground_green);
	draw(ground_border);
	draw(house_blue);
	draw(house_border);
	draw_sun();
	draw_window();
	draw_ship();
	draw_beam();
	draw_man();
	draw_door();
	draw_audio();
	draw(back_button);
	volume.draw_blue();
};

export default _ => {
	if (window.stop_audio !== null && window.stop_audio !== stop_audio) {
		window.stop_audio();
		start_external_audio = window.start_audio;
	} else {
		start_external_audio = null;
	}
	//if (window.stop_audio === null) start_audio();
	set_item('page', "./test/index.js");
	on_resize = draw_page;
	on_click = click_page;
	on_resize();
};
