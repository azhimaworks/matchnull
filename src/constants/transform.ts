export const ADBE_POSITION = "ADBE Position";
export const ADBE_POSITION_X = "ADBE Position_0";
export const ADBE_POSITION_Y = "ADBE Position_1";
export const ADBE_POSITION_Z = "ADBE Position_2";

export const ADBE_SCALE = "ADBE Scale";
export const ADBE_ORIENTATION = "ADBE Orientation";
export const ADBE_ROTATE_X = "ADBE Rotate X";
export const ADBE_ROTATE_Y = "ADBE Rotate Y";
export const ADBE_ROTATE_Z = "ADBE Rotate Z";

export const TWO_D_TRANSFORM_PROPERTIES = [
  ADBE_POSITION,
  ADBE_ROTATE_Z,
] as const;

export const THREE_D_TRANSFORM_PROPERTIES = [
  ADBE_POSITION,
  ADBE_ORIENTATION,
  ADBE_ROTATE_X,
  ADBE_ROTATE_Y,
  ADBE_ROTATE_Z,
] as const;

export const ADBE_TRANSFORM_GROUP = "ADBE Transform Group";
