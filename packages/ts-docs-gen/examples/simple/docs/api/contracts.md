# Table of contents

* [contracts][SourceFile-0]
    * Interfaces
        * [ApiItemReference][InterfaceDeclaration-0]
        * [PluginHeading][InterfaceDeclaration-1]
        * [PluginMember][InterfaceDeclaration-2]
        * [PluginOptions][InterfaceDeclaration-5]
        * [PluginResultData][InterfaceDeclaration-4]
        * [PluginResult][InterfaceDeclaration-3]
        * [Plugin][InterfaceDeclaration-6]
    * Types
        * [SupportedApiItemKindType][TypeAliasDeclaration-0]
        * [GetItemPluginResultHandler][TypeAliasDeclaration-1]
        * [IsPluginResultExistsHandler][TypeAliasDeclaration-2]
    * Enums
        * [ApiItemKindsAdditional][EnumDeclaration-0]

# contracts

## Interfaces


----------


----------


----------


----------


----------


----------


## Types

### SupportedApiItemKindType

```typescript
type SupportedApiItemKindType = ApiItemKinds | Any;
```

ApiItemKinds | Any

----------

### GetItemPluginResultHandler

```typescript
type GetItemPluginResultHandler = (reference: ApiItemReference) => PluginResult<ApiItemDto>;
```

(reference: ApiItemReference) => PluginResult<ApiItemDto>

----------

### IsPluginResultExistsHandler

```typescript
type IsPluginResultExistsHandler = (reference: ApiItemReference) => boolean;
```

(reference: ApiItemReference) => boolean

## Enums

### ApiItemKindsAdditional


```typescript
enum ApiItemKindsAdditional {
     Any = "any"
}
```

**Members**

| Name | Value |
| ---- | ----- |
| Any  | "any" |

[SourceFile-0]: contracts.md#contracts
[InterfaceDeclaration-0]: contracts.md#apiitemreference
[InterfaceDeclaration-1]: contracts.md#pluginheading
[InterfaceDeclaration-2]: contracts.md#pluginmember
[InterfaceDeclaration-5]: contracts.md#pluginoptions
[InterfaceDeclaration-4]: contracts.md#pluginresultdata
[InterfaceDeclaration-3]: contracts.md#pluginresult
[InterfaceDeclaration-6]: contracts.md#plugin
[TypeAliasDeclaration-0]: contracts.md#supportedapiitemkindtype
[TypeAliasDeclaration-1]: contracts.md#getitempluginresulthandler
[TypeAliasDeclaration-2]: contracts.md#ispluginresultexistshandler
[EnumDeclaration-0]: contracts.md#apiitemkindsadditional