# Table of contents

* [index.ts][SourceFile-1]
    * Interfaces
        * [Foo][InterfaceDeclaration-7]
    * Types
        * [SelectedNumbers][TypeAliasDeclaration-5]

# index.ts

## Interfaces

### Foo

```typescript
interface Foo {
    A: string;
}
```

**Properties**

| Name | Type   | Optional |
| ---- | ------ | -------- |
| A    | string | false    |

## Types

### SelectedNumbers

```typescript
type SelectedNumbers = Readonly<Foo>;
```

**Type**

Readonly<Foo>

[SourceFile-1]: index.md#indexts
[InterfaceDeclaration-7]: index.md#foo
[TypeAliasDeclaration-5]: index.md#selectednumbers