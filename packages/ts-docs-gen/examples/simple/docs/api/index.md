[ClassDeclaration-1]: index.md#class-earth
[ClassDeclaration-0]: index.md#class-world
[EnumDeclaration-0]: index.md#uogos
[ModuleDeclaration-1]: index\boonamespace.md#boonamespace
## class: World

## class: Earth

## FunctionWithMultipleTypeParameters(parameter1, parameter2)

Bla bla

### Type parameters

| Name | Constraint type |
| ---- | --------------- |
| T    | Object          |
| P    |                 |

### Parameters

| Name       | Type                 |
| ---------- | -------------------- |
| parameter1 | [T][TypeParameter-0] |
| parameter2 | [P][TypeParameter-1] |

### Return type

string


## FunctionWithTypeParameterDefault(parameter1, parameter2)

Some general comment about AnotherBar function.

### Type parameters

| Name | Constraint type | Default type |
| ---- | --------------- | ------------ |
| T    | Object          | __type       |

### Parameters

| Name       | Type                 |
| ---------- | -------------------- |
| parameter1 | string               |
| parameter2 | [T][TypeParameter-2] |

### Return type

string


## FunctionWithTypeParameterConstraint(parameter1, parameter2)

Some general comment about AnotherBar function.

### Type parameters

| Name | Constraint type |
| ---- | --------------- |
| T    | Object          |

### Parameters

| Name       | Type                 |
| ---------- | -------------------- |
| parameter1 | string               |
| parameter2 | [T][TypeParameter-3] |

### Return type

string


## AnotherFoo(parameter1, parameter2)

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

### Parameters

| Name      | Type   |
| --------- | ------ |
| parameter | string |

### Return type

void


## FunctionWithNoParameters()

### Return type

void


## FunctionWithMultipleParameters(parameter1, parameter2)

### Parameters

| Name       | Type   |
| ---------- | ------ |
| parameter1 | string |
| parameter2 | number |

### Return type

void


## Foo()

### Return type

string


## Bar(parameter1, parameter2)

<span style="color: #d2d255;">Warning: Beta!</span>

<span style="color: red;">Deprecated!</span>

Some general comment about Bar function.

### Parameters

| Name       | Type   |
| ---------- | ------ |
| parameter1 | string |
| parameter2 | number |

### Return type

string


## FunctionWithoutReturnType(parameter1, parameter2)

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

### Return type

Array


## FunctionWithPrimitiveReturnType()

### Return type

true | false


## FunctionWithUnionReturnType()

### Return type

"something" | "nothing"


## FunctionWithIntersectionReturnType()

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

