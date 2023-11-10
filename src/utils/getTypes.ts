import { AllTypes } from "../types/AllTypes";

const getType = (value: string): AllTypes => {
	if (value === "null") return "Null";
	if (value === "true" || value === "false") return "Boolean";
	if (!isNaN(Number(value))) return "Number";
	if (new Date(value).toString() !== "Invalid Date") return "Date";
	if (value.startsWith("{") && value.endsWith("}")) return "Object";
	return "String";
};

export const getTypes = (values: string[]): AllTypes[] => {
	const types: AllTypes[] = [];
	for (const value of values) {
		const type = getType(value);
		types.push(type);
	}
	return types;
};
