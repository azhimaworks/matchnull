import createNull from "@/core/createNull/index";
import { Logger } from "@/util/logger";

const main = () => {
  app.beginUndoGroup("createNull");
  const logger = new Logger();
  createNull(logger);
  app.endUndoGroup();
};

main();
