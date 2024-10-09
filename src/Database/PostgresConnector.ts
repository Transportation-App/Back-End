class PostgresConnector {
	client: any;
	DbConfig = {
		user: process.env.Postgre_Username,
		password: process.env.Postgre_Password,
		host: process.env.Postgre_Host,
		post: process.env.Postgre_Port,
		database: process.env.Postgre_Database,
	};

	constructor() {
		// initialize postgre client
		const { Client } = require("pg");
		this.client = new Client(this.DbConfig);

		// initialize postgre connection
		this.client
			.connect()
			.then(() => {
				console.log("Connection Succeed");
			})
			.catch(() => {
				console.log("Connection Failed");
			});
	}

	write(path: string, id: string, data: object): void {}

	async read(table: string, columns: string): Promise<any[]> {
		let result = await this.client.query(`SELECT ${columns} FROM public."${table}";`);
		return result.rows;
	}

	update(path: string, id: string, data: object): void {}
}

export default PostgresConnector;
