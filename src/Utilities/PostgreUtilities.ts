import { DatabaseTypes } from "../Types";

function getReturningClause(returning?: string): string {
	return `RETURNING ${returning ?? "*"}`;
}

export function generateSelectQuery(params: DatabaseTypes.SimpleSelectParamsType): string {
	const { table, columns, where } = params;
	let where_statement = "";
	if (where) where_statement = "WHERE " + where;
	return `SELECT ${columns} FROM "${table}" ${where_statement}`;
}

export function generateInsertQuery(params: DatabaseTypes.InsertParamType): string {
	const { table, columns, values, returning } = params;
	return `INSERT INTO "${table}" (${columns}) VALUES (${values}) ${getReturningClause(
		returning
	)}`;
}

export function generateUpdateQuery(params: DatabaseTypes.UpdateParamsType): string {
	const { table, assignment, where, returning } = params;
	return `UPDATE "${table}" SET ${assignment} WHERE ${where} ${getReturningClause(
		returning
	)}`;
}

export function generateDeleteQuery(params: DatabaseTypes.SimpleDeleteParamsType): string {
	const { table, where, returning } = params;
	return `DELETE FROM "${table}" WHERE ${where} ${getReturningClause(
		returning
	)}`;
}

export function prepareInsertParms(map: DatabaseTypes.MapListParam): {
	columns_text: string;
	values_text: string;
	values: any[];
} {
	let columns_text = "";
	let values_text = "";
	const values: any[] = [];
	map.forEach((map, index) => {
		columns_text += `"${map.column}",`;
		values_text += `$${index + 1},`;
		values.push(map.value);
	});
	columns_text = columns_text.substring(0, columns_text.length - 1);
	values_text = values_text.substring(0, values_text.length - 1);
	return { columns_text, values_text, values };
}

export function prepareUpdateParams(map: DatabaseTypes.MapListParam): string {
	let assignment = "";
	map.forEach((record) => {
		assignment += `"${record.column}"=${
			typeof record.value === "string"
				? `'${record.value as string}'`
				: (record.value as number)
		},`;
	});
	return assignment.slice(0, assignment.length - 1);
}
