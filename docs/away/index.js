import start_home     from "../home/index.js"   ;
import start_far_away from "./far_away/index.js";
import song           from "./song.js";

const draw_back_border      = image("./away/images/back_border.png");
const draw_back_red         = image("./away/images/back_red.png");
//const draw_back_green       = image("./away/images/back_green.png");

const back_click = circle(125, 130,  65);
    
function c_button(name, shape, song) {
    this.border = image("./away/images/play_" + name + "_border.png");
    this.red    = image("./away/images/play_" + name + "_red.png"   );
    this.green  = image("./away/images/play_" + name + "_green.png" );
    this.shape  = shape;
    this.song   = song;
}

c_button.prototype.playing = null;

c_button.prototype.click = function() {
    const proto = Object.getPrototypeOf(this);
    if (this.shape()) {
        if (proto.playing === this) {
            proto.playing = null;
            this.red();
            this.border();
            this.song.stop();
        } else if (proto.playing === null) {
            this.song.start();
            proto.playing = this;            
            this.green();
            this.border();
        } else {
            proto.playing.song.stop(); // maybe not needed
            proto.playing.red();
            proto.playing.border();
            proto.playing = this;            
            this.green();
            this.border();
            this.song.start();
        }
    }
};

c_button.prototype.draw = function() {
    const proto = Object.getPrototypeOf(this);
    if (proto.playing === this) {
        this.green();
    } else {
        this.red();            
    }
    this.border();
};

const buttons = [
    new c_button("big"     , circle(460, 550, 170), song()),
    new c_button("medium_1", circle(770, 330, 100), song()),
    new c_button("medium_2", circle(760, 808, 115), song()),
    new c_button("small_1" , circle(230, 393,  56), song()),
    new c_button("small_2" , circle(166, 754,  40), song()),
    new c_button("small_3" , circle(420, 812,  45), song()),
    new c_button("small_4" , circle(780, 570,  45), song())
];

const click = _ => {
    if (back_click()) {
        start_home();
    } else {
        buttons.forEach(button => button.click());
    }
};

const start = _ => {
    draw_blue_bg();
    buttons.forEach(button => button.draw());
    draw_back_red();
    draw_back_border();
    set_click(click);
};

export default start;
