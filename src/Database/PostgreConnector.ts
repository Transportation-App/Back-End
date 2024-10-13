import { Client, QueryResult } from "pg";
import dotenv from "dotenv";
dotenv.config();
class PostgreConnector {
	CASS_NAME = "PostgresConnector";
	DbConfig = {
		user: process.env.Postgre_Username,
		password: process.env.Postgre_Password,
		host: process.env.Postgre_Host,
		post: process.env.Postgre_Port,
		database: process.env.Postgre_Database,
	};
	client = new Client(this.DbConfig);

	constructor() {
		this.client
			.connect()
			.then(() => console.log(`[${this.CASS_NAME}]: Connection Succeed`))
			.catch((error) => console.log(`[${this.CASS_NAME}]: Connection Failed -> ${error}`));
	}

	async makeQuery(
		table: string,
		columns: string,
		where: string | undefined
	): Promise<QueryResult<any>> {
		return await this.client.query(
			`SELECT ${columns} FROM public."${table}" ${
				where ? "WHERE " + where : ""
			};`
		);
	}

	async fromCities(
		columns: string,
		where: string | undefined,
		callback: (data: any[]) => void
	) {
		let result = await this.makeQuery("Cities", columns, where);
		callback(result.rows);
	}
}

export const postgreConnector = new PostgreConnector();
