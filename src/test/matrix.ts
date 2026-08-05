import { combineOrientationAndRotation } from "../util/matrix";

type rotationType = [number, number, number];

const orientation: rotationType = [10, 10, 10];
const rotation: rotationType = [10, 10, 10];

console.log(combineOrientationAndRotation(orientation, rotation)); // harus keluar [18.5441, 21.4734, 18.5441];
