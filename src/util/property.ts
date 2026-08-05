import {
  ADBE_POSITION,
  ADBE_POSITION_X,
  ADBE_POSITION_Y,
  ADBE_POSITION_Z,
  ADBE_TRANSFORM_GROUP,
} from "@/constants/transform";

export interface PropertiesInfo {
  propertyGroupMatchName: string;
  propertyMatchName: string;
  value: unknown;
}

// export interface PropertiesInfo {
//   propertyGroupMatchName: string;
//   propertyMatchName: string;
// }

export interface KeyframeData {
  time: number;
  value: number;
}

export type ValueRetrievalMode = "currentValue" | "lastKeyframe";

export interface getPropertyValueOptions {
  isThreeDLayer?: boolean;
  mode?: ValueRetrievalMode;
  time?: number;
}

export const isHaveKeyframe = (property: Property) => {
  const numKeys = property.numKeys;

  return numKeys > 0 ? true : false;
};

export const getProperty = (
  layer: AVLayer,
  propertyGroupMatchName: string,
  propertyMatchName: string,
) => {
  const group = layer.property(propertyGroupMatchName) as PropertyGroup;
  if (!group) return null;

  const property = group.property(propertyMatchName) as Property;
  if (!property) return null;

  return property;
};

export const getPropertyValue = (
  property: Property,
  options: getPropertyValueOptions = {},
): unknown => {
  if (property.matchName === ADBE_POSITION && property.dimensionsSeparated) {
    const parentPropertyGroup = property.parentProperty as PropertyGroup;
    if (!parentPropertyGroup) return property.value;

    const posXProp = parentPropertyGroup.property(ADBE_POSITION_X) as Property;
    const posYProp = parentPropertyGroup.property(ADBE_POSITION_Y) as Property;

    if (!posXProp || !posYProp) return property.value;

    const posXVal = getSinglePropertyValue(
      posXProp,
      options.mode,
      options.time,
    );
    const posYVal = getSinglePropertyValue(
      posYProp,
      options.mode,
      options.time,
    );

    if (options.isThreeDLayer) {
      const posZProp = parentPropertyGroup.property(
        ADBE_POSITION_Z,
      ) as Property;
      const posZVal = getSinglePropertyValue(
        posZProp,
        options.mode,
        options.time,
      );

      return [posXVal, posYVal, posZVal];
    }

    return [posXVal, posYVal];
  }

  return getSinglePropertyValue(property, options.mode, options.time);
};

export const getSinglePropertyValue = (
  property: Property,
  mode: ValueRetrievalMode = "currentValue",
  time?: number,
) => {
  if (mode == "lastKeyframe" && isHaveKeyframe(property)) {
    return getLastKeyframeData(property)?.value;
  }

  return time !== undefined
    ? property.valueAtTime(time, false)
    : property.value;
};

export const extractKeyframeData = (
  property: Property,
): KeyframeData[] | null => {
  if (!isHaveKeyframe) return null;

  const keyframes: KeyframeData[] = [];
  const numKeys = property.numKeys;

  for (let i = 1; i <= numKeys; i++) {
    keyframes.push({
      time: property.keyTime(i),
      value: property.keyValue(i),
    });
  }

  return keyframes;
};

export const getLastKeyframeData = (
  property: Property,
): KeyframeData | null => {
  const keyframes = extractKeyframeData(property);
  if (!keyframes) return null;

  const keyframe = keyframes[keyframes.length - 1];
  if (!keyframe) return null;

  return keyframe;
};

export const getLatestKeyframeTime = (
  layer: AVLayer,
  propertyInfo: PropertiesInfo[],
) => {
  let latestKeyframeTime = 0;
  const checkProperty = (property: Property | null) => {
    if (!property || !isHaveKeyframe(property)) return;

    const keyframe = getLastKeyframeData(property);
    if (!keyframe) return;
    const time = keyframe.time;

    latestKeyframeTime = time > latestKeyframeTime ? time : latestKeyframeTime;
  };

  propertyInfo.forEach((info) => {
    const property = getProperty(
      layer,
      info.propertyGroupMatchName,
      info.propertyMatchName,
    );
    if (!property) return;

    if (property.matchName === ADBE_POSITION && property.dimensionsSeparated) {
      checkProperty(getProperty(layer, ADBE_TRANSFORM_GROUP, ADBE_POSITION_X));
      checkProperty(getProperty(layer, ADBE_TRANSFORM_GROUP, ADBE_POSITION_Y));
      checkProperty(getProperty(layer, ADBE_TRANSFORM_GROUP, ADBE_POSITION_Z));
    } else {
      checkProperty(property);
    }
  });

  return latestKeyframeTime;
};
