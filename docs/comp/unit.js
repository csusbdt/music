import c_wave from "./wave.js";

Object.setPrototypeOf(c_unit.prototype, c_wave.prototype);

function c_unit(octave = 1, whole_notes = 0, half_notes = 0, v = 1, b = 0, w = 0, base_frequency = 60, octave_tones = 8) {
    this.octave = octave;
    this.whole_notes = whole_notes;
    this.half_notes = half_notes;
    this.base_frequency = base_frequency;
    this.octave_tones = octave_tones;
    const f = scale(octave_tones, Math.pow(2, octave) * base_frequency, whole_notes * 2 + half_notes);
    c_wave.call(this, f, v, b, w);
}

c_unit.prototype.is_playing = function() {
    return this.g !== null;
};

c_unit.prototype.frequency = function() {
    const base_frequency = Math.pow(2, this.octave) * this.base_frequency;
    const half_notes_away_from_base = this.whole_notes * 2 + this.half_notes;
    const f = scale(this.octave_tones, base_frequency, half_notes_away_from_base);
    c_wave.prototype.frequency.call(this, f);
};

c_unit.prototype.octave = function(i) {
    this.octave = i;
    this.frequency();
    return this;
};

c_unit.prototype.whole_notes = function(i) {
    this.whole_notes = i;
    this.frequency();
    return this;
};

c_unit.prototype.half_notes = function(i) {
    this.half_notes = i;
    this.frequency();
    return this;
};

export default c_unit;
