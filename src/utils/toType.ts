import { AllTypes } from "../types/AllTypes";

export const toType = (value: string, type: AllTypes) => {
	switch (type) {
		case "String":
			return value;
		case "Number":
			return Number(value);
		case "Boolean":
			return value === "true";
		case "Date":
			return new Date(value);
		case "Null":
			return null;
		case "Object":
			return JSON.parse(value);
	}
};
