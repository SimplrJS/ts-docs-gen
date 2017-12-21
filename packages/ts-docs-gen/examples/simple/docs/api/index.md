[ClassDeclaration-1]: index.md#class-earth
[ClassDeclaration-0]: index.md#class-world
[EnumDeclaration-0]: index.md#uogos
[ModuleDeclaration-1]: index\boonamespace.md#boonamespace
## class: World

## class: Earth

## FunctionWithMultipleTypeParameters(parameter1, parameter2)

Bla bla

```typescript
function FunctionWithMultipleTypeParameters<T extends Object, P>(parameter1: T, parameter2: P): string
```

### Type parameters

| Name | Constraint type |
| ---- | --------------- |
| T    | Object          |
| P    |                 |

### Parameters

| Name       | Type |
| ---------- | ---- |
| parameter1 | T    |
| parameter2 | P    |

### Return type

string


## FunctionWithTypeParameterDefault(parameter1, parameter2)

Some general comment about AnotherBar function.

```typescript
function FunctionWithTypeParameterDefault<T extends Object = {}>(parameter1: string, parameter2: T): string
```

### Type parameters

| Name | Constraint type                                               | Default type              |
| ---- | ------------------------------------------------------------- | ------------------------- |
| T    | \{ myProperty: string; myPropertyTwo?: number | undefined; \} | \{ myProperty: string; \} |

### Return type

T

