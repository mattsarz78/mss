import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import {
  getIntrospectionQuery,
  graphql,
  GraphQLSchema,
  isSpecifiedDirective,
  isSpecifiedScalarType,
  print
} from 'graphql';
import fs from 'fs';
import path from 'path';
import prettier from 'prettier';

const gqlSchema = loadSchemaSync('./schemas/*.graphql', {
  loaders: [new GraphQLFileLoader()]
});

function printSchemasWithDirectives(schema: GraphQLSchema) {
  const str = Object.keys(schema.getTypeMap())
    .filter((path) => !path.match(/^__/))
    .reduce((accum, name) => {
      const type = schema.getType(name);
      return !isSpecifiedScalarType(type!) ? (accum += `${print(type!.astNode!)}\n`) : accum;
    }, '');

  return schema.getDirectives().reduce(
    (accum, directive) => {
      return !isSpecifiedDirective(directive) ? (accum += `${print(directive!.astNode!)}\n`) : accum;
    },
    str + `${print(schema!.astNode!)}\n`
  );
}

const schemaPath = fs.existsSync('./') && fs.statSync('./').isDirectory() ? path.join('./', 'schema.graphql') : './';

if (schemaPath.endsWith('json')) {
  graphql({
    schema: gqlSchema,
    source: getIntrospectionQuery()
  }).then(
    async (result) => {
      const prettierResult = await prettier.format(JSON.stringify(result), {
        parser: 'JSON'
      });
      fs.writeFileSync(path.join(schemaPath), prettierResult);
    },
    (error: unknown) => {
      console.error('Error introspecting schema: ', JSON.stringify(error, null, 2));
    }
  );
} else {
  const schemaText = printSchemasWithDirectives(gqlSchema);
  prettier
    .format(schemaText, { parser: 'graphql' })
    .then((prettySchema) => fs.writeFileSync(schemaPath, prettySchema, 'utf-8'));
}
