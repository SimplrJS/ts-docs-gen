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
        * [MappedType][TypeAliasDeclaration-3]
    * Enums
        * [ApiItemKindsAdditional][EnumDeclaration-0]

# contracts

## Interfaces

### ApiItemReference

```typescript
interface ApiItemReference {
    Id: string;
    Alias: string;
}
```

**Properties**

| Name  | Type   |
| ----- | ------ |
| Id    | string |
| Alias | string |

----------

### PluginHeading

```typescript
interface PluginHeading {
    Heading: string;
    ApiItemId: string;
}
```

**Properties**

| Name      | Type   |
| --------- | ------ |
| Heading   | string |
| ApiItemId | string |

----------

### PluginMember

```typescript
interface PluginMember {
    Reference: ApiItemReference;
    PluginResult: PluginResult<ApiItemDto>;
}
```

**Properties**

| Name         | Type                     |
| ------------ | ------------------------ |
| Reference    | ApiItemReference         |
| PluginResult | PluginResult<ApiItemDto> |

----------

### PluginOptions

```typescript
interface PluginOptions<TKind = ApiItemDto> {
    Reference: ApiItemReference;
    ApiItem: TKind;
    ExtractedData: ExtractDto;
    GetItemPluginResult: GetItemPluginResultHandler;
    IsPluginResultExists: IsPluginResultExistsHandler;
}
```

**Type parameters**

| Name  | Default type |
| ----- | ------------ |
| TKind | ApiItemDto   |

**Properties**

| Name                 | Type                        |
| -------------------- | --------------------------- |
| Reference            | ApiItemReference            |
| ApiItem              | TKind                       |
| ExtractedData        | ExtractDto                  |
| GetItemPluginResult  | GetItemPluginResultHandler  |
| IsPluginResultExists | IsPluginResultExistsHandler |

----------

### PluginResultData

```typescript
interface PluginResultData {
    Headings: PluginHeading[];
    UsedReferences: string[];
    Result: string[];
    Members: PluginMember[];
}
```

**Properties**

| Name           | Type            |
| -------------- | --------------- |
| Headings       | PluginHeading[] |
| UsedReferences | string[]        |
| Result         | string[]        |
| Members        | PluginMember[]  |

----------

### PluginResult

```typescript
interface PluginResult<TKind = ApiItemDto> extends PluginResultData {
    Reference: ApiItemReference;
    ApiItem: TKind;
}
```

**Type parameters**

| Name  | Default type |
| ----- | ------------ |
| TKind | ApiItemDto   |

**Extends**

PluginResultData

**Properties**

| Name      | Type             |
| --------- | ---------------- |
| Reference | ApiItemReference |
| ApiItem   | TKind            |

----------

### Plugin

```typescript
interface Plugin<TKind = ApiItemDto> {
    SupportedApiItemKinds(): SupportedApiItemKindType[];
    CheckApiItem(item: TKind): boolean;
    Render(options: PluginOptions<TKind>): PluginResult<ApiItemDto>;
}
```

**Type parameters**

| Name  | Default type |
| ----- | ------------ |
| TKind | ApiItemDto   |

#### Methods

```typescript
SupportedApiItemKinds(): SupportedApiItemKindType[]
```

**Return type**

SupportedApiItemKindType[]

```typescript
CheckApiItem(item: TKind): boolean
```

**Parameters**

| Name | Type  |
| ---- | ----- |
| item | TKind |

**Return type**

boolean

```typescript
Render(options: PluginOptions<TKind>): PluginResult<ApiItemDto>
```

**Parameters**

| Name    | Type                 |
| ------- | -------------------- |
| options | PluginOptions<TKind> |

**Return type**

PluginResult<ApiItemDto>

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

----------

### MappedType

```typescript
type MappedType = {[K in "a-b-c"]: number};
```

{[K in "a-b-c"]: number}

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
[TypeAliasDeclaration-3]: contracts.md#mappedtype
[EnumDeclaration-0]: contracts.md#apiitemkindsadditional