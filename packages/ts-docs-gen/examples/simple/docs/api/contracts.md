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

| Name         | Type                                                     |
| ------------ | -------------------------------------------------------- |
| Reference    | [ApiItemReference][InterfaceDeclaration-0]               |
| PluginResult | [PluginResult][InterfaceDeclaration-3]&lt;ApiItemDto&gt; |

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

| Name                 | Type                                                  |
| -------------------- | ----------------------------------------------------- |
| Reference            | [ApiItemReference][InterfaceDeclaration-0]            |
| ApiItem              | TKind                                                 |
| ExtractedData        | ExtractDto                                            |
| GetItemPluginResult  | [GetItemPluginResultHandler][TypeAliasDeclaration-1]  |
| IsPluginResultExists | [IsPluginResultExistsHandler][TypeAliasDeclaration-2] |

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

| Name           | Type                                                 |
| -------------- | ---------------------------------------------------- |
| Headings       | Array&lt;[PluginHeading][InterfaceDeclaration-1]&gt; |
| UsedReferences | Array&lt;string&gt;                                  |
| Result         | Array&lt;string&gt;                                  |
| Members        | Array&lt;[PluginMember][InterfaceDeclaration-2]&gt;  |

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

[PluginResultData][InterfaceDeclaration-4]

**Properties**

| Name      | Type                                       |
| --------- | ------------------------------------------ |
| Reference | [ApiItemReference][InterfaceDeclaration-0] |
| ApiItem   | TKind                                      |

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

Array&lt;SupportedApiItemKindType&gt;

```typescript
CheckApiItem(item: TKind): boolean
```

**Parameters**

| Name | Type  |
| ---- | ----- |
| item | TKind |

**Return type**

true | false

```typescript
Render(options: PluginOptions<TKind>): PluginResult<ApiItemDto>
```

**Parameters**

| Name    | Type                                                 |
| ------- | ---------------------------------------------------- |
| options | [PluginOptions][InterfaceDeclaration-5]&lt;TKind&gt; |

**Return type**

[PluginResult][InterfaceDeclaration-3]&lt;ApiItemDto&gt;

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
[InterfaceDeclaration-0]: contracts.md#apiitemreference
[InterfaceDeclaration-3]: contracts.md#pluginresult
[InterfaceDeclaration-5]: contracts.md#pluginoptions
[InterfaceDeclaration-0]: contracts.md#apiitemreference
[TypeAliasDeclaration-1]: contracts.md#getitempluginresulthandler
[TypeAliasDeclaration-2]: contracts.md#ispluginresultexistshandler
[InterfaceDeclaration-4]: contracts.md#pluginresultdata
[InterfaceDeclaration-1]: contracts.md#pluginheading
[InterfaceDeclaration-2]: contracts.md#pluginmember
[InterfaceDeclaration-3]: contracts.md#pluginresult
[InterfaceDeclaration-4]: contracts.md#pluginresultdata
[InterfaceDeclaration-0]: contracts.md#apiitemreference
[InterfaceDeclaration-6]: contracts.md#plugin
[InterfaceDeclaration-5]: contracts.md#pluginoptions
[InterfaceDeclaration-3]: contracts.md#pluginresult
[TypeAliasDeclaration-0]: contracts.md#supportedapiitemkindtype
[TypeAliasDeclaration-1]: contracts.md#getitempluginresulthandler
[TypeAliasDeclaration-2]: contracts.md#ispluginresultexistshandler
[EnumDeclaration-0]: contracts.md#apiitemkindsadditional