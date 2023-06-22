// import c_tone           from "../global/tone.js"          ;
// import start_home       from "../home/index.js"   ;
// import c_img            from "../global/img.js"   ;
// import c_button         from "../global/button.js";
// import c_toggle         from "../global/toggle.js";
// import { back_button  } from "../global/index.js" ;
// import { audio_toggle } from "../global/index.js" ;

// const green  = new c_img("./compose/images/green.png" , 120, 205, 36);
// const red    = new c_img("./compose/images/red.png"   , 120, 205, 36);
// const border = new c_img("./compose/images/border.png", 120, 205, 36);

// const green_button  = new c_button(green , border);
// const red_button    = new c_button(red   , border);
// const border_button = new c_button(border, null  );

// function c_unit(tones, d, x, y) {
// 	if (!Array.isArray(tones)) tones = [tones];
// 	this.tones = tones;
// 	this.d = d;
// 	this.toggle = new c_toggle(
// 		green_button .clone(x - 120, y - 205), 
// 		red_button   .clone(x - 120, y - 205), 
// 		border_button.clone(x - 120, y - 205)
// 	);
// }

// c_unit.prototype.start = function() {
// 	this.toggle.color = this.toggle.color_1;
// 	this.tones.forEach(o => o.start());
// };

// c_unit.prototype.stop = function() {
// 	this.toggle.color = this.toggle.color_0;
// 	this.tones.forEach(o => o.stop());
// };

// c_unit.prototype.draw  = function() { this.toggle.draw(); }

// c_unit.prototype.click = function() { return this.toggle.click(); }

// const units = [];
// let unit_i  = null;
// let unit_id = null;

// const next_unit = _ => {
// 	units[unit_i].stop();
// 	if (++unit_i === units.length) unit_i = 0;
// 	units[unit_i].start();
// 	unit_id = setTimeout(next_unit, units[unit_i].d);
// 	on_resize();
// };

// audio_toggle.action_0 = _ => {
// 	unit_i = 0;
// 	units[unit_i].start();
// 	unit_id = setTimeout(next_unit, units[unit_i].d);
// };

// audio_toggle.action_1 = _ => {
// 	units[unit_i].stop();
// 	unit_i = null;
// 	clearTimeout(unit_id);
// };

// let saved_audio_start = null;
// let saved_audio_stop  = null;

// const ot = 6;
// const f  = 100;
// const b  = 0;
// const d  = 2000;
// let x    = 100;
// const dx = 100;

// const tone = half_steps => new c_tone(ot, scale(ot, f, half_steps), b);
// const phi  = new c_tone(PHI, b);

// units.push(new c_unit([
// 	new c_tone(scale(6, 100, 0), 3),
// 	phi
// ], d, x +=  0, 400));

// units.push(new c_unit([
// 	new c_tone(scale(6, 100, 2), 3),
// 	new c_tone(scale(6, 100, 4), 3)
// ], d, x += dx, 400));

// units.push(new c_unit([
// 	new c_tone(scale(6, 100, 0), 3),
// 	phi
// ], d, x += dx, 400));

// units.push(new c_unit([
// 	new c_tone(scale(6, 100, 2), 3),
// 	new c_tone(scale(6, 100, 4), 3)
// ], d, x += dx, 400));

// units.push(new c_unit([
// 	new c_tone(scale(6, 100, 0), 3),
// 	phi
// ], d, x += dx, 400));

// units.push(new c_unit([
// 	new c_tone(scale(6, 100, 2), 3),
// 	new c_tone(scale(6, 100, 5), 3)
// ], d/4, x += dx, 400));

// units.push(new c_unit([
// 	new c_tone(scale(6, 100, 2), 3),
// 	new c_tone(scale(6, 100, 6), 3)
// ], d/4, x += dx, 400));

// units.push(new c_unit([
// 	new c_tone(scale(6, 100, 2), 0),
// 	new c_tone(scale(6, 100, 7), 0),
// 	phi
// ], d/4, x += dx, 400));

// units.push(new c_unit([
// 	new c_tone(scale(6, 100, 2), 0),
// 	new c_tone(scale(6, 100, 7), 0),
// 	phi
// ], d/8, x += dx, 400));

// units.push(new c_unit([
// 	new c_tone(scale(6, 100, 2), 0),
// 	new c_tone(scale(6, 100, 6), 0),
// 	phi
// ], d/8, x += dx, 400));

// const click = _ => {
// 	if (back_button.click()) {
// 		audio_toggle.reset();
// 		window.start_audio = saved_audio_start;
// 		window.stop_audio = saved_audio_stop;		
// 		start_home();
// 		return;
// 	}
// 	else if (audio_toggle.click()) {
// 		on_resize();
// 	}
// };

// const draw = _ => {
// 	bg_blue.draw();
// 	back_button.draw();
// 	audio_toggle.draw();
// 	units.forEach(o => o.draw());
// };

// const start = _ => {
// 	if (window.stop_audio !== null) window.stop_audio();
// 	saved_audio_start = window.start_audio;
// 	saved_audio_stop  = window.stop_audio;
// 	set_item('page', "./away/index.js");
//     on_click  = click;
//     on_resize = draw;
//     on_resize();
// };

// export default start;
