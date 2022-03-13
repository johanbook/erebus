#!/usr/bin/env node

const Ajv = require("ajv");
const fs = require("fs");

const VARIABLES_FILE_PATH = "variables.json";
const SCHEMA_PATH = "variables.schema.json";

function readJSONFile(path) {
  const data = fs.readFileSync(path, "utf8");
  return JSON.parse(data);
}

/** Generates env file */
function generateEnvFile(obj) {
  const data = [];
  for (const [key, value] of Object.entries(obj)) {
    data.push(`export ${key}=${value}`);
  }
  return data.join("\n");
}

const schema = readJSONFile(SCHEMA_PATH);
const data = readJSONFile(VARIABLES_FILE_PATH);

const ajv = new Ajv({ useDefaults: true });

const valid = ajv.validate(schema, data);
if (!valid) {
  console.log("Found following errors");
  for (error of ajv.errors) {
    console.error(`\t${error.instancePath}: ${error.message} `);
  }
  process.exit(1);
}

console.log(generateEnvFile(data));
