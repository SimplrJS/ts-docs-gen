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

| Name | Constraint type | Default type |
| ---- | --------------- | ------------ |
| T    | Object          | {}           |

### Parameters

| Name       | Type   |
| ---------- | ------ |
| parameter1 | string |
| parameter2 | T      |

### Return type

string


## FunctionWithTypeParameterConstraint(parameter1, parameter2)

Some general comment about AnotherBar function.

```typescript
function FunctionWithTypeParameterConstraint<T extends Object>(parameter1: string, parameter2: T): string
```

### Type parameters

| Name | Constraint type |
| ---- | --------------- |
| T    | Object          |

### Parameters

| Name       | Type   |
| ---------- | ------ |
| parameter1 | string |
| parameter2 | T      |

### Return type

string


## AnotherFoo(parameter1, parameter2)

```typescript
function AnotherFoo<T extends T[]>(parameter1: string, parameter2: Promise<T>): string
```

### Type parameters

| Name | Constraint type |
| ---- | --------------- |
| T    | Array           |

### Parameters

| Name       | Type    |
| ---------- | ------- |
| parameter1 | string  |
| parameter2 | Promise |

### Return type

string


## FunctionWithOneParameter(parameter)

```typescript
function FunctionWithOneParameter(parameter: string): void
```

### Parameters

| Name      | Type   |
| --------- | ------ |
| parameter | string |

### Return type

void


## FunctionWithNoParameters()

```typescript
function FunctionWithNoParameters(): void
```

### Return type

void


## FunctionWithMultipleParameters(parameter1, parameter2)

```typescript
function FunctionWithMultipleParameters(parameter1: string, parameter2: number): void
```

### Parameters

| Name       | Type   |
| ---------- | ------ |
| parameter1 | string |
| parameter2 | number |

### Return type

void


## Foo()

```typescript
function Foo(): string
```

### Return type

string


## Bar(parameter1, parameter2)

<span style="color: #d2d255;">Warning: Beta!</span>

<span style="color: red;">Deprecated!</span>

Some general comment about Bar function.

```typescript
function Bar(parameter1: string, parameter2: number): string
```

### Parameters

| Name       | Type   |
| ---------- | ------ |
| parameter1 | string |
| parameter2 | number |

### Return type

string


## FunctionWithoutReturnType(parameter1, parameter2)

```typescript
function FunctionWithoutReturnType<T extends T[]>(parameter1: string, parameter2: Promise<T>): string
```

### Type parameters

| Name | Constraint type |
| ---- | --------------- |
| T    | Array           |

### Parameters

| Name       | Type    |
| ---------- | ------- |
| parameter1 | string  |
| parameter2 | Promise |

### Return type

string


## FunctionWithGenericReturnType()

```typescript
function FunctionWithGenericReturnType(): string[]
```

### Return type

Array


## FunctionWithPrimitiveReturnType()

```typescript
function FunctionWithPrimitiveReturnType(): boolean
```

### Return type

true | false


## FunctionWithUnionReturnType()

```typescript
function FunctionWithUnionReturnType(): "something" | "nothing"
```

### Return type

"something" | "nothing"


## FunctionWithIntersectionReturnType()

```typescript
function FunctionWithIntersectionReturnType(): Earth & World
```

### Return type

[Earth][ClassDeclaration-1] & [World][ClassDeclaration-0]


## Uogos

<span style="color: #d2d255;">Warning: Beta!</span>

<span style="color: red;">Deprecated!</span>

Some information
2nd line of some information
3rd line of some information
4th line of some information
5th line of some information

> Some summary about this package version.


```typescript
enum Uogos {
     Jokie = "jokie",
     Braskes = "braskes"
}
```

| Name    | Value     |
| ------- | --------- |
| Jokie   | "jokie"   |
| Braskes | "braskes" |

## Skaiciai


```typescript
enum Skaiciai {
     Nulis = 0,
     Vienas = 1,
     Du = 2
}
```

| Name   | Value |
| ------ | ----- |
| Nulis  | 0     |
| Vienas | 1     |
| Du     | 2     |

## Sarasas


```typescript
enum Sarasas {
     Pirmas = 0,
     Antras = 1,
     Trecias = 2
}
```

| Name    | Value | Description           |
| ------- | ----- | --------------------- |
| Pirmas  | 0     | Pirmo description'as  |
| Antras  | 1     | Antro description'as  |
| Trecias | 2     | Trečio description'as |

## ConstSkaiciai


```typescript
enum ConstSkaiciai {
     PirmasC = 0,
     AntrasC = 1,
     TreciasC = 2
}
```

| Name     | Value |
| -------- | ----- |
| PirmasC  | 0     |
| AntrasC  | 1     |
| TreciasC | 2     |

## ConstSarasas


```typescript
enum ConstSarasas {
     PirmasC = 0,
     AntrasC = 1,
     TreciasC = 2
}
```

| Name     | Value | Description           |
| -------- | ----- | --------------------- |
| PirmasC  | 0     | Pirmo description'as  |
| AntrasC  | 1     | Antro description'as  |
| TreciasC | 2     | Trečio description'as |

## ConstUogos


```typescript
enum ConstUogos {
     Jokie = "jokie",
     Braskes = "braskes"
}
```

| Name    | Value     |
| ------- | --------- |
| Jokie   | "jokie"   |
| Braskes | "braskes" |

## Hello

<span style="color: red;">Deprecated: Use uogos instead ;)!</span>

```typescript
type Hello = Uogos;
```

### Type

[Uogos][EnumDeclaration-0]

# FooNamespace

## [BooNamespace][ModuleDeclaration-1]

