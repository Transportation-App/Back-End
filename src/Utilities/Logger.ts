export default class Logger {
	private prefix: string;

	constructor(class_name: string) {
		this.prefix = `[${class_name}] - `;
	}

	log(statement: string, ...optionalParams: any[]): void {
		console.log(this.prefix + statement, ...optionalParams);
	}

	logInfo(statement: string, ...optionalParams: any[]): void {
		console.info(this.prefix + statement, ...optionalParams);
	}

	logWarning(statement: string, ...optionalParams: any[]): void {
		console.warn(this.prefix + statement, ...optionalParams);
	}

	logError(statement: string, ...optionalParams: any[]): void {
		console.error(this.prefix + statement, ...optionalParams);
	}
}
