import c_img       from "../img.js";

let img = n => new c_img("./global/images/" + n + ".png");

export const upper_left_green   = img("upper_left_green"  , 100, 70, 50);
export const upper_left_yellow  = img("upper_left_yellow" , 100, 70, 50);
export const upper_left_border  = img("upper_left_border" , 100, 70, 50);

export const upper_right_green  = img("upper_right_green" , 900, 60, 50);
export const upper_right_yellow = img("upper_right_yellow", 900, 60, 50);
export const upper_right_border = img("upper_right_border", 900, 60, 50);

// export const lower_left_green   = img("lower_left_green"  , 87, 920, 50);
// export const lower_left_yellow  = img("lower_left_yellow" , 87, 920, 50);
// export const lower_left_border  = img("lower_left_border" , 87, 920, 50);

// export const lower_right_green  = img("lower_right_green" , 922, 922, 50);
// export const lower_right_yellow = img("lower_right_yellow", 922, 922, 50);
// export const lower_right_border = img("lower_right_border", 922, 922, 50);
