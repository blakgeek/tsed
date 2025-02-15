import {cleanObject, setValue} from "@tsed/core";
import {pascalCase} from "change-case";
import type {JsonSchema} from "../domain/JsonSchema.js";
import {SpecTypes} from "../domain/SpecTypes.js";
import {JsonSchemaOptions} from "../interfaces/JsonSchemaOptions.js";

/**
 * ignore
 * @param options
 */
function getHost(options: JsonSchemaOptions) {
  const {host = `#/${[SpecTypes.OPENAPI, SpecTypes.ASYNCAPI].includes(options.specType!) ? "components/schemas" : "definitions"}`} =
    options;

  return host;
}

/**
 * @ignore
 */
export function createRefName(name: string, options: JsonSchemaOptions) {
  if (options.groups && options.groups.length) {
    return pascalCase(`${name} ${options.groupsName || options.groups.join(" ")}`);
  }

  return name;
}

/**
 * @ignore
 */
export function createRef(name: string, schema: JsonSchema, options: JsonSchemaOptions) {
  const host = getHost(options);
  const ref = {
    $ref: `${host}/${name}`
  };

  const nullable = schema.isNullable;
  const readOnly = schema.isReadOnly;
  const writeOnly = schema.isWriteOnly;

  if (nullable || readOnly || writeOnly) {
    switch (options.specType) {
      case SpecTypes.OPENAPI:
        return cleanObject({
          nullable: nullable ? true : undefined,
          readOnly: readOnly ? true : undefined,
          writeOnly: writeOnly ? true : undefined,
          oneOf: [ref]
        });
      case SpecTypes.JSON:
        return cleanObject({
          readOnly,
          writeOnly,
          oneOf: [ref]
        });
    }
  }

  return ref;
}

/**
 * @ignore
 */
export function toRef(value: JsonSchema, schema: any, options: JsonSchemaOptions) {
  const name = createRefName(value.getName(), options);

  setValue(options, `components.schemas.${name}`, schema);

  return createRef(name, value, options);
}
