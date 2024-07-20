import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader';
import { loadSchemaSync } from '@graphql-tools/load';
import { getIntrospectionQuery, graphql, isSpecifiedDirective, isSpecifiedScalarType, print } from 'graphql';
import fs from 'fs';
import path from 'path';
import prettier from 'prettier';

const gqlSchema = loadSchemaSync('./schemas/*.graphql', {
  loaders: [new GraphQLFileLoader()]
});

const destination = './';

function printSchemasWithDirectives(schema: any) {
  const str = Object.keys(schema.getTypeMap())
    .filter((path) => !path.match(/^__/))
    .reduce((accum: any, name: any) => {
      const type = schema.getType(name);
      return !isSpecifiedScalarType(type) ? (accum += `${print(type.astNode)}\n`) : accum;
    }, '');

  return schema.getDirectives().reduce(
    (accum: any, directive: any) => {
      return !isSpecifiedDirective(directive) ? (accum += `${print(directive.astNode)}\n`) : accum;
    },
    str + `${print(schema.astNode)}\n`
  );
}

const schemaPath =
  fs.existsSync(destination) && fs.statSync(destination).isDirectory()
    ? path.join(destination, 'schema.graphql')
    : destination;

if (schemaPath.endsWith('json')) {
  graphql({
    schema: gqlSchema,
    source: getIntrospectionQuery()
  }).then(
    async (result: any) => {
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
