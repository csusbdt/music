import c_wave from "./wave.js";

function c_unit(octave, whole_notes, half_notes, volume, binaural, waver) {
    this.octave      = octave;
    this.whole_notes = whole_notes;
    this.half_notes  = half_notes;
    this.volume      = volume;
    this.binaural    = binaural;
    this.waver       = waver;
    if (this.octave      === undefined) this.octave      = this.default_octave; 
    if (this.whole_notes === undefined) this.whole_notes = 0; 
    if (this.half_notes  === undefined) this.half_notes  = 0; 
    if (this.volume      === undefined) this.volume      = this.default_volume; 
    if (this.binaural    === undefined) this.binaural    = this.default_binaural; 
    if (this.waver       === undefined) this.waver       = this.default_waver;

    const f = scale(
        this.octave_tones, 
        Math.pow(2, this.octave) * this.base_frequency, 
        this.whole_notes * 2 + this.half_notes
    );
    this.wave = new c_wave(
        f, 
        this.volume/this.volume_max, 
        this.binaural_values[this.binaural], 
        this.waver_values[this.waver] 
    );
}

c_unit.prototype.binaural_values = [0, 2, 4, 8, 16, 32, 64];
c_unit.prototype.waver_values    = [0, 2, 4, 8, 16, 32, 64];
c_unit.prototype.base_frequency  = 60;
c_unit.prototype.octave_tones    = 8;
c_unit.prototype.volume_max      = 8;
c_unit.prototype.binaural_max    = c_unit.prototype.binaural_values.length - 1;
c_unit.prototype.waver_max       = c_unit.prototype.waver_values.length    - 1;
c_unit.prototype.default_octave  = 2;
c_unit.prototype.default_volume  = 4;

c_unit.prototype.is_playing = function() {
    return this.wave.g !== null;
};

c_unit.prototype.start = function() {
    if (this.wave.g === null) this.wave.start();
};

c_unit.prototype.stop = function() {
    if (this.wave.g !== null) this.wave.stop();
};

c_unit.prototype.get_frequency = function() {
    const base_frequency = Math.pow(2, this.octave) * this.base_frequency;
    const half_notes_away_from_base = this.whole_notes * 2 + this.half_notes;
    return scale(this.octave_tones, base_frequency, half_notes_away_from_base);
};

c_unit.prototype.set_octave = function(i) {
    this.octave = i;
    this.wave.set_frequency(this.get_frequency());
    return this;
};

c_unit.prototype.set_whole_notes = function(i) {
    this.whole_notes = i;
    this.wave.set_frequency(this.get_frequency());
    return this;
};

c_unit.prototype.set_half_notes = function(i) {
    this.half_notes = i;
    this.wave.set_frequency(this.get_frequency());
    return this;
};

c_unit.prototype.set_volume = function(i) {
    this.volume = i;
    this.wave.set_volume(i / this.volume_max);
    return this;
};

c_unit.prototype.set_binaural = function(i) {
    this.binaural = i;
    this.wave.set_binaural(i / this.binaural_max);
    return this;
};

export default c_unit;
