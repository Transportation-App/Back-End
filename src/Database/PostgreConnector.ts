import { Pool, PoolClient } from "pg";
import { Logger, PostgreUtilities } from "../Utilities";
import { DatabasesTypes } from "../Types";
import { postgreConfig } from "../Config";

/**
 * A class responsible for managing PostgreSQL database connections and queries.
 */
class PostgreConnector {
	pool = new Pool(postgreConfig);
	logger: Logger = new Logger("PostgreConnector");

	constructor() {}

	/**
	 * Begins a database transaction.
	 * @private
	 * @param {PoolClient} client - The database client used for the transaction.
	 * @returns {Promise<void>} Begins the transaction.
	 */
	private async beginTransaction(client: PoolClient): Promise<void> {
		await client.query("BEGIN");
	}

	/**
	 * Commits a database transaction.
	 * @private
	 * @param {PoolClient} client - The database client used for the transaction.
	 * @returns {Promise<void>} Commits the transaction.
	 */
	private async commitTransaction(client: PoolClient): Promise<void> {
		await client.query("COMMIT");
	}

	/**
	 * Rolls back a database transaction.
	 * @private
	 * @param {PoolClient} client - The database client used for the transaction.
	 * @returns {Promise<void>} Rolls back the transaction.
	 */
	private async rollbackTransaction(client: PoolClient): Promise<void> {
		await client.query("ROLLBACK");
	}

	/**
	 * Retrieves a client from the connection pool.
	 * @private
	 * @returns {Promise<PoolClient>} Returns a connected client from the pool.
	 */
	private async getClient(): Promise<PoolClient> {
		return await this.pool.connect();
	}

	/**
	 * Executes a SQL query within a transaction, handles errors, and releases the client.
	 * @private
	 * @param {QueryParamsType} params - The query parameters including client, query text, values, and callback.
	 * @returns {Promise<void>} Executes the query and handles the result.
	 */
	private async makeQuery(
		params: DatabasesTypes.QueryParamsType
	): Promise<void> {
		const { client, text, values, callback } = params;
		try {
			await this.beginTransaction(client);
			const start = Date.now();
			let result = await client.query(text, values);
			const duration = Date.now() - start;
			this.logger.logInfo("executed query", {
				text,
				duration,
				rows: result.rowCount,
			});
			await this.commitTransaction(client);
			callback(result.rows);
		} catch (error) {
			await this.rollbackTransaction(client);
			this.logger.logError("failed query", error);
			callback(undefined);
		} finally {
			client.release;
			this.logger.logWarning("client released");
		}
	}

	/**
	 * Executes a SELECT query on the database.
	 * @param {SelectRequestType} params - Parameters for the SELECT query, including columns, table, where clause, and callback.
	 * @returns {Promise<void>} Executes the SELECT query and returns the result via callback.
	 */
	async makeSelectQuery(
		params: DatabasesTypes.SelectRequestType
	): Promise<void> {
		const { columns, table, where, callback } = params;
		const text = PostgreUtilities.generateSelectQuery({
			columns,
			table,
			where,
		});
		try {
			const client = await this.getClient();
			this.makeQuery({ client, text, callback });
		} catch (error) {
			this.logger.logError("client can't connect");
			callback(null);
		}
	}

	/**
	 * Executes an INSERT query on the database.
	 * @param {InsertPequestType} params - Parameters for the INSERT query, including table, insertMapList, returning clause, and callback.
	 * @returns {Promise<void>} Executes the INSERT query and returns the result via callback.
	 */
	async makeInsertQuery(
		params: DatabasesTypes.InsertPequestType
	): Promise<void> {
		const { table, insertMapList, returning, callback } = params;
		const { columns_text, values_text, values } =
			PostgreUtilities.prepareInsertParms(insertMapList);
		const text = PostgreUtilities.generateInsertQuery({
			table,
			columns: columns_text,
			values: values_text,
			returning,
		});
		try {
			const client = await this.getClient();
			this.makeQuery({ client, text, values, callback });
		} catch (error) {
			this.logger.logError("client can't connect");
			callback(null);
		}
	}

	/**
	 * Executes an UPDATE query on the database.
	 * @param {UpdatePequestType} params - Parameters for the UPDATE query, including table, updateMapList, where clause, returning clause, and callback.
	 * @returns {Promise<void>} Executes the UPDATE query and returns the result via callback.
	 */
	async makeUpdateQuery(
		params: DatabasesTypes.UpdatePequestType
	): Promise<void> {
		const { table, updateMapList, where, returning, callback } = params;
		const assignment = PostgreUtilities.prepareUpdateParams(updateMapList);
		const text = PostgreUtilities.generateUpdateQuery({
			table,
			assignment,
			where,
			returning,
		});
		try {
			const client = await this.getClient();
			this.makeQuery({ client, text, callback });
		} catch (error) {
			this.logger.logError("client can't connect");
			callback(null);
		}
	}

	/**
	 * Executes a DELETE query on the database.
	 * @param {DeletePequestType} params - Parameters for the DELETE query, including table, where clause, returning clause, and callback.
	 * @returns {Promise<void>} Executes the DELETE query and returns the result via callback.
	 */
	async makeDeleteQuery(
		params: DatabasesTypes.DeletePequestType
	): Promise<void> {
		const { table, where, returning, callback } = params;
		const text = PostgreUtilities.generateDeleteQuery({
			table,
			where,
			returning,
		});
		try {
			const client = await this.getClient();
			this.makeQuery({ client, text, callback });
		} catch (error) {
			this.logger.logError("client can't connect");
			callback(null);
		}
	}
}

export default new PostgreConnector();
