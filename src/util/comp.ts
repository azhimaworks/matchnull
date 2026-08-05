export const getSelectedCompItem = () => {
  const item = app.project.activeItem;

  if (item && item instanceof CompItem) {
    return item;
  } else {
    return null;
  }
};
