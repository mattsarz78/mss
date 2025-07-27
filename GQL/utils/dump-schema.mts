import { SCHEMA_FILE, SCHEMA_GLOB, SCHEMA_PATH } from '#staticData/constants.mjs';
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import fs from 'fs';
import {
  getIntrospectionQuery,
  graphql,
  GraphQLSchema,
  isSpecifiedDirective,
  isSpecifiedScalarType,
  print
} from 'graphql';
import path from 'path';
import prettier from 'prettier';

const gqlSchema = loadSchemaSync(SCHEMA_GLOB, { loaders: [new GraphQLFileLoader()] });

const printSchemasWithDirectives = (schema: GraphQLSchema): string => {
  const typeMap = schema.getTypeMap();
  const typeStrings = Object.keys(typeMap)
    .filter((typeName) => !typeName.startsWith('__'))
    .map((typeName) => {
      const type = typeMap[typeName];
      return !isSpecifiedScalarType(type) && type.astNode ? print(type.astNode) : '';
    })
    .join('\n');

  const directiveStrings = schema
    .getDirectives()
    .filter((directive) => !isSpecifiedDirective(directive))
    .map((directive) => (directive.astNode ? print(directive.astNode) : ''))
    .join('\n');

  const schemaAstNode = schema.astNode ? print(schema.astNode) : '';
  return `${schemaAstNode}\n${typeStrings}\n${directiveStrings}`;
};

const schemaPath =
  fs.existsSync(SCHEMA_PATH) && fs.statSync(SCHEMA_PATH).isDirectory()
    ? path.join(SCHEMA_PATH, SCHEMA_FILE)
    : SCHEMA_PATH;

if (schemaPath.endsWith('json')) {
  graphql({ schema: gqlSchema, source: getIntrospectionQuery() }).then(
    async (result) => {
      const prettierResult = await prettier.format(JSON.stringify(result), { parser: 'json' });
      fs.writeFileSync(schemaPath, prettierResult);
    },
    (error: unknown) => {
      console.error('Error introspecting schema: ', JSON.stringify(error, null, 2));
    }
  );
} else {
  const schemaText = printSchemasWithDirectives(gqlSchema);
  prettier
    .format(schemaText, { parser: 'graphql' })
    .then((prettySchema) => {
      fs.writeFileSync(schemaPath, prettySchema, 'utf-8');
    })
    .catch((error: unknown) => {
      console.error('Error formatting schema: ', (error as Error).message);
    });
}
