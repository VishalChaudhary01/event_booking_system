// src/config/swagger.ts
import swaggerUi from "swagger-ui-express";
import { readFileSync } from "fs";
import { join } from "path";
import YAML from "yaml";

const swaggerFile = readFileSync(join(process.cwd(), "swagger.yaml"), "utf-8");
const swaggerDocument = YAML.parse(swaggerFile);

export { swaggerUi, swaggerDocument };
