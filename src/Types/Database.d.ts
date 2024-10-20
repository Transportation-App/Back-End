export type CallbackDataType = any[] | number | null;

export type CallbackType = (data: CallbackDataType) => void;

export type MapListParam = { column: string; value: string | number }[];

export type DataCallbackType = {
	callback: CallbackType;
};

export type QueryParamsType = {
	client: PoolClient;
	text: string;
	values?: any[];
	callback: CallbackType;
};

export type SimpleSelectParamsType = {
	columns: string;
	table: string;
	where?: string;
};
export type SelectRequestType = SimpleSelectParamsType & DataCallbackType;

export type SimpleInsertParamsType = {
	table: string;
	returning?: string;
};
export type SimpleInsertCallbackType = SimpleInsertParamsType &
	DataCallbackType;
export type InsertParamType = SimpleInsertParamsType & {
	columns: string;
	values: string;
};
export type InsertPequestType = SimpleInsertCallbackType & {
	insertMapList: MapListParam;
};

export type SimpleUpdateParamsType = {
	table: string;
	where: string;
	returning?: string;
};
export type UpdateParamsType = SimpleUpdateParamsType & {
	assignment: string;
};
export type UpdatePequestType = SimpleUpdateParamsType &
	DataCallbackType & {
		updateMapList: MapListParam;
	};

export type SimpleDeleteParamsType = {
	table: string;
	where: string;
	returning?: string;
};
export type DeletePequestType = SimpleDeleteParamsType & DataCallbackType;
