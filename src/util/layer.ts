export const getSelectedLayer = (compItem: CompItem) => {
  return compItem.selectedLayers;
};

export const isThreeDLayer = (avLayer: AVLayer) => {
  return avLayer.threeDLayer;
};
