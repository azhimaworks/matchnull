import {
  ADBE_TRANSFORM_GROUP,
  THREE_D_TRANSFORM_PROPERTIES,
  TWO_D_TRANSFORM_PROPERTIES,
} from "@/constants/transform";
import { getSelectedCompItem } from "@/util/comp";
import { getSelectedLayer, isThreeDLayer } from "@/util/layer";
import type { Logger } from "@/util/logger";
import {
  getProperty,
  getPropertyValue,
  type PropertiesInfo,
} from "@/util/property";
import { mapPropertiesForNull } from "./util";
import { getAverage } from "@/util/math";

const createNull = (logger: Logger) => {
  const compItem = getSelectedCompItem();
  if (!compItem) {
    logger.error("Please select a composition");
    return;
  }

  const selectedLayer = getSelectedLayer(compItem);
  if (selectedLayer.length <= 0) {
    logger.error("Please select at lease one layer");
    return;
  }

  let is3DLayer = false;
  let firstLayer: AVLayer = selectedLayer[0] as AVLayer;
  try {
    const propertiesInfoLayers = selectedLayer.map((l, index) => {
      const layer = l as AVLayer;
      if (index === 0) firstLayer = layer;
      is3DLayer = isThreeDLayer(layer);

      const transformMatchNames = is3DLayer
        ? THREE_D_TRANSFORM_PROPERTIES
        : TWO_D_TRANSFORM_PROPERTIES;

      const transformPropertiesInfo: PropertiesInfo[] = transformMatchNames
        .map((propertyMatchName) => {
          const property = getProperty(
            layer,
            ADBE_TRANSFORM_GROUP,
            propertyMatchName,
          );

          if (!property) {
            logger.warn(
              `Property "${propertyMatchName}" not found in "${layer.name}"`,
            );
            return;
          }
          const value = getPropertyValue(property, {
            isThreeDLayer: is3DLayer,
            mode: "lastKeyframe",
          });
          if (value === undefined || value === null) {
            logger.warn(
              `Cannot get property value from "${propertyMatchName}" property in "${layer.name}"`,
            );
            return;
          }

          return {
            propertyGroupMatchName: ADBE_TRANSFORM_GROUP,
            propertyMatchName,
            value,
          };
        })
        .filter((value) => value !== undefined);

      const propertiesInfo: PropertiesInfo[] = [
        ...mapPropertiesForNull(transformPropertiesInfo, is3DLayer),
      ];

      return propertiesInfo;
    });

    const nullPropertiesInfo: PropertiesInfo[] | undefined =
      propertiesInfoLayers[0]
        ?.map((propertiesInfo) => {
          const matchName = propertiesInfo.propertyMatchName;

          let value: unknown;
          if (selectedLayer.length > 1) {
            let values: unknown[] = [];

            for (let i = 0; i < selectedLayer.length; i++) {
              const infoPerLayer = propertiesInfoLayers[i]
                ?.filter(
                  (predicate) => predicate.propertyMatchName == matchName,
                )
                .pop();
              if (!infoPerLayer) return;

              values.push(infoPerLayer.value);
            }

            value = getAverage(values as number[]);
          } else {
            value = propertiesInfo.value;
          }

          return {
            propertyGroupMatchName: propertiesInfo.propertyGroupMatchName,
            propertyMatchName: matchName,
            value,
          };
        })
        .filter((predicate) => predicate !== undefined);

    if (!nullPropertiesInfo) {
      logger.error("Properties for null layer unexpected gone!");
      return;
    }

    const nullLayer = compItem.layers.addNull();
    if (is3DLayer) nullLayer.threeDLayer = true;

    nullPropertiesInfo.forEach((info) => {
      const property = getProperty(
        nullLayer,
        info.propertyGroupMatchName,
        info.propertyMatchName,
      );
      if (!property) {
        logger.error(`Property "${info.propertyMatchName}" not found`);
        return;
      }

      try {
        property.setValue(info.value);
      } catch (e) {
        logger.warn(
          `Cannot set value to "${info.propertyMatchName}" Property in Null Layer with value: ${JSON.stringify(info.value)} | DETAIL: ${String(e)}`,
        );
      }
    });

    selectedLayer.forEach((layer) => (layer.parent = nullLayer));
    nullLayer.moveBefore(firstLayer);
    nullLayer.inPoint = firstLayer.inPoint;
    nullLayer.outPoint = firstLayer.outPoint;
    nullLayer.name = `NULL ${firstLayer.name}`;
  } finally {
    logger.flush();
  }
};

export default createNull;
