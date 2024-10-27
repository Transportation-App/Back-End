import { FindOptions } from "sequelize";

export const fullObjectOption: FindOptions<any> = {
	include: { all: true, nested: true },
};
