import {
  ADBE_ANCHOR_POINT,
  ADBE_ORIENTATION,
  ADBE_ROTATE_X,
  ADBE_ROTATE_Y,
  ADBE_ROTATE_Z,
  ADBE_TRANSFORM_GROUP,
} from "@/constants/transform";
import { combineOrientationAndRotation } from "@/util/matrix";
import type { PropertiesInfo } from "@/util/property";

export const mapPropertiesForNull = (
  properties: PropertiesInfo[],
  isThreeDLayer: boolean,
) => {
  const propertiesInfo: PropertiesInfo[] = [
    {
      propertyGroupMatchName: ADBE_TRANSFORM_GROUP,
      propertyMatchName: ADBE_ANCHOR_POINT,
      value: [50, 50],
    },
  ];

  const rotationValue: Record<string, number> = {
    [ADBE_ROTATE_X]: 0,
    [ADBE_ROTATE_Y]: 0,
    [ADBE_ROTATE_Z]: 0,
  };

  const orientationValue: [number, number, number] = [0, 0, 0];

  properties.forEach((property) => {
    if (property.propertyMatchName === ADBE_ORIENTATION) {
      const value = property.value as [number, number, number];
      value.forEach((val, index) => {
        orientationValue[index] = val;
      });
    } else if (isThreeDLayer && property.propertyMatchName in rotationValue) {
      rotationValue[property.propertyMatchName] = property.value as number;
    } else {
      propertiesInfo.push(property);
    }
  });

  if (isThreeDLayer) {
    const finalOrientation = combineOrientationAndRotation(orientationValue, [
      rotationValue[ADBE_ROTATE_X] ?? 0,
      rotationValue[ADBE_ROTATE_Y] ?? 0,
      rotationValue[ADBE_ROTATE_Z] ?? 0,
    ]);

    const orientationPropInfo: PropertiesInfo = {
      propertyGroupMatchName: ADBE_TRANSFORM_GROUP,
      propertyMatchName: ADBE_ORIENTATION,
      value: finalOrientation,
    };

    return [...propertiesInfo, orientationPropInfo];
  }

  return propertiesInfo;
};
