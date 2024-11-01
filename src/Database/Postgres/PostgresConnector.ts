import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { Sequelize } from "sequelize";
import { Logger } from "../../Utilities";
import { Models } from "./Models";
dotenvExpand.expand(dotenv.config());

/**
 * A class responsible for managing PostgreSQL database connections and queries.
 */
export default class PostgresConnector {
	private __className__: string = "PostgreConnector";
	private logger: Logger = new Logger(this.__className__);
	private sequelize = new Sequelize(process.env.Sequelize_Uri as string, {
		logging: (msg) => this.logger.logInfo("{Sequelize} : " + msg),
	});
	private static connector: PostgresConnector;

	private constructor() {
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

	public static getInstance(): PostgresConnector {
		return this.connector ?? (this.connector = new PostgresConnector());
	}
}
