#! /usr/bin/env bun

import { createCommand } from "commander";
import { version } from "../package.json";
import inquirer from "inquirer";
import chalk from "chalk";
import { getTypes } from "./utils/getTypes";
import { toType } from "./utils/toType";
import { AllTypes } from "./types/AllTypes";

const program = createCommand();

program.version(version);

program
	.command("to-json [input] [output]")
	.description("Converts a CSV file to JSON")
	.action(async (input?: string, output?: string) => {
		if (!input || (input?.split?.(".")?.at(-1) ?? "") !== "csv")
			return console.log(chalk.red("Please provide a valid CSV file"));

		if (!output || output?.split?.(".")?.at?.(-1) !== "json") {
			output = input.slice(0, -4) + ".json";
			console.log(
				chalk.blue("Output file not provided, using default name: " + output),
			);
		}
		const csvFile = Bun.file(input);
		const jsonFile = Bun.file(output);

		if (!(await csvFile.exists()))
			return console.log(chalk.red("File does not exist!"));

		if (await jsonFile.exists()) {
			const { overwrite } = await inquirer.prompt([
				{
					type: "confirm",
					name: "overwrite",
					message: `Output file already exists at ${output}, overwrite?`,
					default: false,
				},
			]);
			if (!overwrite) return console.log(chalk.red("Aborted!"));
		}

		if (!(await csvFile.exists()))
			return console.log(chalk.red("File does not exist!"));

		const text = await csvFile.text();

		if (!text) return console.log(chalk.red("File is empty!"));

		const rows = text.split("\n").filter((row) => row);
		let types: AllTypes[] = [];

		const isOnlyHeader = rows.length === 1;

		if (isOnlyHeader) {
			console.log(
				chalk.yellow(
					"File has only one row! Keys will be created, but values will be null.",
				),
			);
			types = new Array(rows[0].split(",").length).fill("Null");
		} else types = getTypes(rows[1].split(","));

		const keys = rows[0].split(",");
		const values = isOnlyHeader
			? [new Array(keys.length).fill("null").join(",")]
			: rows.slice(1);

		const data = values.map((row) => {
			const obj: any = {};
			const rowValues = row.split(",");
			keys.forEach((key, index) => {
				obj[key] = toType(rowValues[index], types[index]);
			});
			return obj;
		});

		try {
			await Bun.write(jsonFile, JSON.stringify({ data }, null, 2));
		} catch (error) {
			console.log(chalk.red(`Error writing to file ${jsonFile.name}!`));
		}
	});

program
	.command("from-json")
	.description("Converts JSON to a CSV file")
	.action(async (input?: string, output?: string) => {});

program.parse();
