[InterfaceDeclaration-0]: contracts.md#apiitemreference
[InterfaceDeclaration-3]: contracts.md#pluginresult
[InterfaceDeclaration-0]: contracts.md#apiitemreference
[InterfaceDeclaration-1]: contracts.md#pluginheading
[InterfaceDeclaration-2]: contracts.md#pluginmember
[InterfaceDeclaration-4]: contracts.md#pluginresultdata
[InterfaceDeclaration-0]: contracts.md#apiitemreference
[InterfaceDeclaration-5]: contracts.md#pluginoptions
[InterfaceDeclaration-3]: contracts.md#pluginresult
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

| Name                 | Type                                       |
| -------------------- | ------------------------------------------ |
| Reference            | [ApiItemReference][InterfaceDeclaration-0] |
| ApiItem              | TKind                                      |
| ExtractedData        | ExtractDto                                 |
| GetItemPluginResult  | GetItemPluginResultHandler                 |
| IsPluginResultExists | IsPluginResultExistsHandler                |

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
type SupportedApiItemKindType = SupportedApiItemKindType;
```

SupportedApiItemKindType

----------

### GetItemPluginResultHandler

```typescript
type GetItemPluginResultHandler = () _=> {};
```

() _=> {}

----------

### IsPluginResultExistsHandler

```typescript
type IsPluginResultExistsHandler = () _=> {};
```

() _=> {}

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

