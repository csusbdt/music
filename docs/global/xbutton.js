import c_img       from "./img.js"   ;
import c_button    from "./button.js";

const m = new Map();

const color_name = n => n.substring(n.lastIndexOf("_") + 1);
const image_name = n => n.substring(0, n.lastIndexOf("_"));

const button = (n, x = 0, y = 0, action = null) => {
    //const border_name = image_name(n) + "_border";
    if (color_name(n) === "null") {
        const border_image = m.get(image_name(n) + "_border");
		if (border_image === undefined) throw new Error(image_name(n) + "_border" + " not found");
    	return new c_button(border_image, null, x, y, action);
    } else {
        const color_image  = m.get(n);
        const border_image = m.get(image_name(n) + "_border");
		if (color_image  === undefined) throw new Error(n + " not found");
		if (border_image === undefined) throw new Error(image_name(n) + "_border" + " not found");
    	return new c_button(color_image, border_image, x, y, action);
    }
};

export default button;

const img = (n, cx, cy, cr, bottom = null) => {
	assert(cx !== undefined);
	let image = new c_img("./global/images/" + n + ".png", cx, cy, cr, bottom);
	m.set(n, image);
    n = image_name(n) + "_border";
	image = new c_img("./global/images/" + n + ".png", cx, cy, cr, bottom);
	m.set(n, image);
};

const clone = n => {
    const color = color_name(n);
    const green = m.get(image_name(n) + "_green")
    if (color === "blue") m.set(n, green.clone_blue());
    else if (color === "red") m.set(n, green.clone_red());
    else if (color === "yellow") m.set(n, green.clone_yellow());
    else if (color === "white") m.set(n, green.clone_white());
};

// upper_left
img("upper_left_green" , 100, 70, 50);
clone("upper_left_blue");

// upper_right
img("upper_right_green", 900, 60, 50);
clone("upper_right_red"   );
clone("upper_right_blue"  );
clone("upper_right_yellow");

// lower_left
img("lower_left_green" , 87, 920, 50);
clone("lower_left_red");
clone("lower_left_blue");
clone("lower_left_yellow");

// lower_right
img("lower_right_green" , 922, 922, 50);
clone("lower_right_red");
clone("lower_right_blue");
clone("lower_right_yellow");

// generic buttons

img("large_green", 220, 260, 150);
clone("large_red");

img("medium_green", 160, 240, 80);
clone("medium_red");
clone("medium_blue");
clone("medium_yellow");

img("small_green", 120, 200, 40);
clone("small_red");
