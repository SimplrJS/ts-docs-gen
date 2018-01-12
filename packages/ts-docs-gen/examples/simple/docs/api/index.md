# Table of contents

* [index][SourceFile-1]
    * Interfaces
        * [Foo][InterfaceDeclaration-7]
    * Types
        * [SelectedNumbers][TypeAliasDeclaration-3]

# index

## Interfaces

### Foo

```typescript
interface Foo {
    A: string;
}
```

**Properties**

| Name | Type   |
| ---- | ------ |
| A    | string |

## Types

### SelectedNumbers

```typescript
type SelectedNumbers = Readonly<Foo>;
```

Readonly<Foo>

[SourceFile-1]: index.md#index
[InterfaceDeclaration-7]: index.md#foo
[TypeAliasDeclaration-3]: index.md#selectednumbers