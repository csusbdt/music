
function c_song(notes) {
    this.notes = notes;
}

c_song.prototype.start = function() {

};

c_song.prototype.stop = function() {
    console.log("stop song");
};

const song = (notes) => { return new c_song(); }

export default song;
