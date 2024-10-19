import { Client, QueryResult } from "pg";

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
      .catch((error: Error) =>
        console.log(`[${this.CASS_NAME}]: Connection Failed -> ${error}`)
      );
  }

  private async makeQuery(
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

  async insertInto(
    table: string,
    data: Record<string, any>,
    returnValue: string | undefined
  ): Promise<QueryResult<any>> {
    const columns = Object.keys(data)
      .map((col) => `"${col}"`)
      .join(", ");
    const values = Object.values(data);
    const valuePlaceholders = values
      .map((_, index) => `$${index + 1}`)
      .join(", ");

    const query = `INSERT INTO public."${table}" (${columns}) VALUES (${valuePlaceholders}) ${
      returnValue ? "RETURNING " + returnValue : ""
    };`;

    try {
      const result = await this.client.query(query, values);
      console.log(`[${this.CASS_NAME}]: Insert successful`);
      return result;
    } catch (error) {
      console.error(`[${this.CASS_NAME}]: Insert failed -> ${error}`);
      throw error;
    }
  }

  async fromCities(
    columns: string,
    where: string | undefined,
    callback: (data: any[]) => void
  ) {
    let result = await this.makeQuery("Cities", columns, where);
    callback(result.rows);
  }

  async fromDiscounts(
    columns: string,
    where: string | undefined,
    callback: (data: any[]) => any[]
  ) {
    let result = await this.makeQuery("Discounts", columns, where);
    return callback(result.rows);
  }

  async fromItineraries(
    columns: string,
    where: string | undefined,
    callback: (data: any[]) => any[]
  ) {
    let result = await this.makeQuery("Itineraries", columns, where);
    return callback(result.rows);
  }

  async storeTickets(columns: string, callback: (data: any[]) => void) {
    let result = await this.makeQuery("Cities", columns, undefined);
    callback(result.rows);
  }
}

export default PostgreConnector;
