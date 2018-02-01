# ts-docs-gen

_Readme is WIP._

Generates documentation from TypeScript files.

## Get started 
```sh
npm install ts-docs-gen -g
```

## CLI usage
```sh
ts-docs-gen -h
```

### Examples

#### Without config

If you want to use `ts-docs-gen` without config file, `entryFile` flag is required.
```sh
ts-docs-gen --entryFile ./src/index.ts
```

Multiple entry files:
```sh
ts-docs-gen --entryFile ./src/index.ts --entryFile ./src/internal.ts
# Or
ts-docs-gen --entryFile ./src/index.ts ./src/internal.ts
```

#### With config

```
ts-docs-gen --config ./docs-gen.json
```

## Configuration
JSON config properties and CLI flags.

| Property            | CLI Flag              | Required   | Type     | Default     | Description                                                                           |
| ------------------- | --------------------- | ---------- | -------- | ----------- | ------------------------------------------------------------------------------------- |
|                     | `--config`            | _optional_ | string   |             | Relative path to config json file.                                                    |
| `entryFile`         | `--entryFile`         | _required_ | string[] |             | TypeScript project entry files.                                                       |
| `project`           | `--project`, `-p`     | _optional_ | string   | cwd         | Full path to TypeScript project directory.                                            |
| `output`            | `--output`, `-o`      | _optional_ | string   | ./docs/api/ | Documentation output directory.                                                       |
| `plugin`            | `--plugin`            | _optional_ | string[] |             | Packagename or path to plugin.                                                        |
| `exclude`           | `--exclude`           | _optional_ | string[] |             | File locations that should not be included generated documentation.                   |
| `externalPackage`   | `--externalPackage`   | _optional_ | string[] |             | External package names to include in extracted data.                                  |
| `excludePrivateApi` | `--excludePrivateApi` | _optional_ | boolean  | `true`      | Excludes api items that has access modifier set to "private" or JSDoc tag "@private". |
