const lead_time  = 3   ;
const trail_time = 3   ;
//const peak_dt    = .02 ;
//const min_dt     = .20 ;
let timeout_id   = null;

const setup_graph = _ => {
	if (gain !== null) gain.disconnect();
    gain = audio.createGain();
	gain.gain.value = 1;
	gain.connect(main_gain);
};

const teardown_graph = _ => {
	if (gain !== null) {
		gain.disconnect();
		gain = null;
	}
};

const play = notes => {
	setup_graph();

    let duration = lead_time + trail_time;
	notes.forEach(note => {
		duration += note[2];
	});

	let peak_time = audio.currentTime + lead_time;
	notes.forEach(note => {
		const freq = note[0] * .5;
		const vol  = note[1];
		const dur  = note[2] * 2;
		const g    = audio.createGain();
		const o    = audio.createOscillator();
		g.connect(gain);
		o.connect(g);
		o.start();
		g.gain.value      = 0;
		o.frequency.value = freq;
		let t = peak_time;
		g.gain.setTargetAtTime(vol * 0.25, t - 1.00 * dur, .1);
		g.gain.setTargetAtTime(vol * 0.50, t - 0.50 * dur, .1);
		g.gain.setTargetAtTime(vol * 0.75, t - 0.25 * dur, .1);
		g.gain.setTargetAtTime(vol * 1.00, t             , .1);
		g.gain.setTargetAtTime(vol * 0.75, t + 0.25 * dur, .1);
		g.gain.setTargetAtTime(vol * 0.50, t + 0.50 * dur, .1);
		g.gain.setTargetAtTime(vol * 0.25, t + 0.75 * dur, .1);
		g.gain.setTargetAtTime(vol * 0.00, t + 1.00 * dur, .1);
		peak_time += dur;
		
//		let start_time    = peak_time - lead_time;
//		let end_time      = peak_time + trail_time;
//		let t             = start_time;
//		while (t < end_time) {
		// 	let v = Math.sin((t - peak_time) / dur / 1) / (t - peak_time) / 1;

		// 	2 * Math.PI * t * freq
			
		// 	v = v * v;
		// 	assert( v <= 1);
		// 	if (isNaN(v)) v = 1;
		// 	g.gain.setTargetAtTime(v * vol, t, .1);
		// 	if (t < peak_time) {
		// 		const time_remaining = peak_time - t;
		// 		const time_consumed  = t - start_time;
		// 		const dt = min_dt * time_remaining / lead_time + peak_dt * time_consumed / lead_time;
		// 		t += dt;
		// 	} else {
		// 		const time_remaining = end_time - t;
		// 		const time_consumed  = t - start_time;
		// 		const dt = peak_dt * time_remaining / lead_time + min_dt * time_consumed / lead_time;
		// 		t += dt;
		// 	}
		// }
		// peak_time += dur;
	});
	timeout_id = setTimeout(stop, duration * 1000);
};

const stop = _ => {
	teardown_graph();
};

export { play, stop };
