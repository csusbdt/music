import c_img   from "../global/img.js"    ;
import c_tone  from "../global/tone.js"   ;
import xbutton from "../global/xbutton.js";
import volume  from "../global/volume.js" ;

//////////////////////////////////////////////////////////////////////////////////////
//
// c_beat_group
//
//////////////////////////////////////////////////////////////////////////////////////

function c_beat_group(dur, members = []) {
	this.dur     = dur;
	this.members = Array.from(members);
	this.joiners = [];
	this.on      = false;
	this.id      = null;
}

c_beat_group.prototype.add = function(m) {
	// if (this.members.length === 0) {
	// 	this.members.push(m);
	// 	if (window.stop_audio === stop_audio) this.start();
	// } else if (this.members.indexOf(m) === -1 && this.joiners.indexOf(m) === -1) {
	// 	this.joiners.push(m);
	// }
	if (this.members.indexOf(m) === -1 && this.joiners.indexOf(m) === -1) {
		this.joiners.push(m);
	}
};

c_beat_group.prototype.remove = function(m) {
	let i = this.members.indexOf(m);
	if (i !== -1) {
		m.set_off();
		this.members.splice(i, 1);
	}
	i = this.joiners.indexOf(m);
	if (i !== -1) this.joiners.splice(i, 1);
	//if (this.members.length === 0) this.stop();
};

c_beat_group.prototype.next = function() {
	while (this.joiners.length > 0) {
		const m = this.joiners.pop();
		m.set_on();
		this.members.push(m);
	}
	this.id = setTimeout(c_beat_group.prototype.next.bind(this), this.dur);
};

c_beat_group.prototype.start = function() {
	if (this.id === null) {
		while (this.joiners.length > 0) {
			this.members.push(this.joiners.pop());
		}
		this.members.forEach(m => m.set_on());
		this.id = setTimeout(c_beat_group.prototype.next.bind(this), this.dur);
	}
};

c_beat_group.prototype.stop = function() {
	if (this.id !== null) {
		clearTimeout(this.id);
		this.id = null;
		this.members.forEach(m => m.set_off());
		while (this.joiners.length > 0) {
			this.members.push(this.joiners.pop());
		}
	}
};

c_beat_group.prototype.restart = function() {
	this.stop();
	this.start();
};

c_beat_group.prototype.set_on = function() {
	this.on = true;
	this.start();
};

c_beat_group.prototype.set_off = function() {
	this.on = false;
	this.stop();
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
	if (window.stop_audio === null) {
		start_audio();
	} else if (this.on && this.id === null) {
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

c_seq.prototype.set_on = function() {
	this.on = true;
	this.start();
};

c_seq.prototype.set_off = function() {
	this.on = false;
	this.stop();
};


const back_button   = xbutton("upper_left_blue");
const audio_blue    = xbutton("upper_right_blue");
const audio_yellow  = xbutton("upper_right_yellow");


const start_audio = _ => {
	window.start_audio = null;
	window.stop_audio  = stop_audio;
	start(s_list);
};

const stop_audio = _ => {
	window.start_audio = start_audio;
	window.stop_audio  = null;
	stop(s_list);
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
const draw_ship = _ => { 
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
				// s_man_in_valley.set_off();
				// s_man_in_ship.set_on();
				group.remove(s_man_in_valley);
				group.add(s_man_in_ship);
				beam = beam_off;
//				s_beam_taking.set_off();
				group.remove(s_beam_taking);
			} else if (beam === beam_putting) {
				man = man_in_valley;
				group.remove(s_man_in_ship);
				group.add(s_man_in_valley);
				// s_man_in_ship.set_off();
				// s_man_in_valley.set_on();
				beam = beam_off;
				//s_beam_putting.set_off();
				group.remove(s_beam_putting);
			} else if (man === man_in_ship) {
				beam = beam_putting;
				//s_beam_putting.set_on();
				group.add(s_beam_putting);
			} else if (man === man_in_valley) {
				beam = beam_taking;
				//s_beam_taking.set_on();
				group.add(s_beam_taking);
			} else {
				ship = ship_over_house;
				group.remove(s_ship_over_valley);
				group.add(s_ship_over_house);
				// s_ship_over_valley.set_off();
				// s_ship_over_house.set_on();
			}
			return true;
		} else return false;
	} else {
		if (click(ship_blue, man_outside_house_x, man_outside_house_y)) {
			if (beam === beam_taking) {
				man = man_in_ship;
				group.remove(s_man_outside_house);
				group.add(s_man_in_ship);
				// s_man_outside_house.set_off();
				// s_man_in_ship.set_on();
				beam = beam_off;
				//s_beam_taking.set_off();
				group.remove(s_beam_taking);
			} else if (beam === beam_putting) {
				man = man_outside_house;
				group.remove(s_man_in_ship);
				group.add(s_man_outside_house);
				// s_man_in_ship.set_off();
				// s_man_outside_house.set_on();
				beam = beam_off;
				//s_beam_putting.set_off();
				group.remove(s_beam_putting);
			} else if (man === man_outside_house) {
				beam = beam_taking;
				//s_beam_taking.set_on();
				group.add(s_beam_taking);
			} else {
				ship = ship_over_valley;
				// s_ship_over_house.set_off();
				// s_ship_over_valley.set_on();
				group.remove(s_ship_over_house);
				group.add(s_ship_over_valley);
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
			group.remove(s_man_in_valley);
			group.add(s_man_in_house);
			// s_man_in_valley.set_off();
			// s_man_in_house.set_on();
			return true;
		} else return false;
	} else if (man === man_outside_house && beam === beam_off) {
		if (click(man_yellow, man_outside_house_x, man_outside_house_y)) {
			man = man_in_valley;
			group.remove(s_man_outside_house);
			group.add(s_man_in_valley);
			// s_man_outside_house.set_off();
			// s_man_in_valley.set_on();
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
			// s_sun_off.set_off();
			// s_sun_on.set_on();
			group.remove(s_sun_off);
			group.add(s_sun_on);
		} else {
			sun = sun_off;
			// s_sun_on.set_off();
			// s_sun_off.set_on();
			group.remove(s_sun_on);
			group.add(s_sun_off);
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
			group.remove(s_man_in_house);
			group.add(s_man_outside_house);
			// s_man_in_house.set_off();
			// s_man_outside_house.set_on();
			return true;
		} else return false;
	} else return false;
};

const draw_house  = _ => { 
	draw(house_blue);
	draw(house_border);
};
const click_house = _ => {
	if (ship === ship_over_valley && beam === beam_off) {
		if (house_blue.click()) {
			ship = ship_over_house;
			// s_ship_over_valley.set_off();
			// s_ship_over_house.set_on();
			group.remove(s_ship_over_valley);
			group.add(s_ship_over_house);
			return true;
		} else return false;
	} else return false;
};

//////////////////////////////////////////////////////////////////////////////////////
//
// sound pallets
//
//////////////////////////////////////////////////////////////////////////////////////

// 2, 1.62, 1.38, 1.24, 1.15, 1.09, 1.06, 1.03, 1.02, 1.01, 1.01, 1.01, 1 at i = 12
const p1 = (f, i) => f * (1 + Math.pow(PHI, -i));
const p1_max = 12;

// 2, 1.85, 1.72, 1.61, 1.52, 1.44, 1.38, 1.32, 1.27, 1.23, 1.20, 1.17, 1.14, ..., 1 at i = 34
const p2 = (f, i) => f * (1 + Math.pow(1 - 54/360, i));
const p2_max = 34;

// 2.61, 1.81, 1.40, 1.20, 1.10, 1.05, 1.03, 1.01, 1.01, 1 at i = 10
const p3 = (f, i) => f * (1 + PHI * Math.pow(2, -i));
const p3_max = 10;

// 1.62, 1.31, 1.15, 1.08, 1.04, 1.02, 1.01, 1 at i = 9
const p4 = (f, i) => f * (PHI - 1 + Math.pow(2, i)) / Math.pow(2, i);
const p4_max = 9;

const dur = 1000;
const bf  = 90;
const bin = bf * Math.pow(PHI, -7);

const s_sun_off           = new c_seq(dur, Array(p1_max).fill(0).map((_, i) => p1(bf, i)));
const s_sun_on            = new c_seq(dur, Array(p1_max).fill(0).map((_, i) => p1(bf * PHI, i)));
const s_beam_taking       = new c_seq(dur / 4, [ bf * PHI, bf * PHI * PHI ]);
const s_beam_putting      = new c_seq(dur / 2, [ p1(bf * PHI, 7), p1(bf * PHI, 9) ]);
const s_ship_over_valley  = new c_seq(dur, Array(p2_max).fill(0).map((_, i) => p2(bf, i)));
const s_ship_over_house   = new c_seq(dur, Array(p3_max).fill(0).map((_, i) => p3(bf, i)));
const s_man_in_valley     = new c_seq(dur * 2, Array(p2_max).fill(0).map((_, i) => p2(bf, i)));
const s_man_in_ship       = new c_seq(dur * 3, Array(p3_max).fill(0).map((_, i) => p3(bf, i)));
const s_man_in_house      = new c_seq(dur * 2, Array(p4_max).fill(0).map((_, i) => p4(bf * PHI, i)));
const s_man_outside_house = new c_seq(dur * 2, Array(p1_max).fill(0).map((_, i) => p1(bf * PHI, i)));


//const blob_p = new c_seq(dur, [ 
// 	p4(bf, 0), p4(bf, 3), p4(bf, 3), p4(bf, 1), p4(bf, 2) 
// ]);

// const blob_f_bf = bf * Math.pow(2 * (PHI - 1), 3);
// const blob_f = new c_seq(dur * 3, [ 
// 	p4(blob_f_bf, 0), p4(blob_f_bf, 3), p4(blob_f_bf, 3), p4(blob_f_bf, 1), p4(blob_f_bf, 2) 
// ]);

const group = new c_beat_group(dur);
group.on = true;
group.add(s_man_in_valley);
group.add(s_ship_over_valley);
group.add(s_sun_on);

const s_list = [
	group//,
	//s_man_in_valley, s_man_in_ship, s_man_in_house, s_man_outside_house,
	//s_ship_over_valley, s_ship_over_house, s_sun_on, s_sun_off, s_beam_taking, s_beam_putting 
];
//s_man_in_valley.on = true;
//s_ship_over_valley.on = true;
//s_sun_on.on = true;

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
	click_audio() || volume.click() || click_ship() 
	click_man()   || click_sun()    || click_door() || click_house();
	start_external_audio = null;
	on_resize();
};

const draw_page = _ => {
	draw(bg_red);
	draw(ground_green);
	draw(ground_border);
	draw_house();
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
	set_item('page', "./test/index.js");
	on_resize = draw_page;
	on_click = click_page;
	on_resize();
};
