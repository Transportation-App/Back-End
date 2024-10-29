import { Sequelize } from "sequelize";
import { Logger } from "../../Utilities";
import { Models } from "./Models";
/**
 * A class responsible for managing PostgreSQL database connections and queries.
 */
export default class PostgreConnector {
  __className__: string = "PostgreConnector";
  logger: Logger = new Logger(this.__className__);
  sequelize = new Sequelize(process.env.Sequelize_Uri as string, {
    logging: (msg) => this.logger.logInfo("{Sequelize} : " + msg),
  });

  constructor() {
    this.sequelize
      .authenticate()
      .then(async () => {
        this.logger.logInfo("Connection has beeen established successfully.");
        await Models.initializeModels(this.sequelize);
        this.logger.logInfo("Initialization completed");
      })
      .catch((error) =>
        this.logger.logError("Unable to connect to the database:", error)
      );
  }
}
