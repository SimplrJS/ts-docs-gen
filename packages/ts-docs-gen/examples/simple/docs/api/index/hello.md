[ClassDeclaration-0]: hello.md#hello
[Constructor-0]: hello.md#constructorarg
[MethodDeclaration-0]: hello.md#renderarg
# Table of contents

* [Hello][ClassDeclaration-0]
    * Constructor
        * [constructor(arg)][Constructor-0]
    * Methods
        * [render(arg)][MethodDeclaration-0]

# Hello

```typescript
class Hello
```
## Constructor

### constructor(arg)

This is a constructor

```typescript
public constructor(arg: string)
```

**Parameters**

| Name | Type   | Description            |
| ---- | ------ | ---------------------- |
| arg  | string | This is an argument ;) |

## Methods

### render(arg)

<span style="color: #d2d255;">Warning: Beta!</span>

Comment about Render

```typescript
public render<T extends String = String>(arg: T): T
```

**Type parameters**

| Name | Constraint type | Default type |
| ---- | --------------- | ------------ |
| T    | String          | String       |

**Parameters**

| Name | Type | Description            |
| ---- | ---- | ---------------------- |
| arg  | T    | Argument comment here. |

**Return type**

T

