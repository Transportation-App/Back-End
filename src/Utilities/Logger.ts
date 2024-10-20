export default class Logger {
	private CLASS_NAME: string;

	constructor(class_name: string) {
		this.CLASS_NAME = class_name;
	}

	private addClassName(statement: string): string {
		return `[${this.CLASS_NAME}] - ${statement}`;
	}

	log(statement: string, ...optionalParams: any[]): void {
		console.log(this.addClassName(statement), ...optionalParams);
	}

	logInfo(statement: string, ...optionalParams: any[]): void {
		console.info(this.addClassName(statement), ...optionalParams);
	}

	logWarning(statement: string, ...optionalParams: any[]): void {
		console.warn(this.addClassName(statement), ...optionalParams);
	}

	logError(statement: string, ...optionalParams: any[]): void {
		console.error(this.addClassName(statement), ...optionalParams);
	}
}
