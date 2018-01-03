[InterfaceDeclaration-1]: index.md#interface-foo
[InterfaceDeclaration-2]: index.md#interface-boo
[InterfaceDeclaration-4]: index.md#interface-myconstrainttype
[InterfaceDeclaration-9]: index.md#interface-dictionary
[InterfaceDeclaration-9]: index.md#interface-dictionary
[InterfaceDeclaration-6]: index.md#interface-objectsinterface
[InterfaceDeclaration-12]: index.md#interface-monsterinterface
[ClassDeclaration-0]: index/hello.md#hello
# index

## interface ExtendedBar

```typescript
interface ExtendedBar extends Foo<number>, Boo {
    OtherStuff: string[];
}
```

### Extends

[Foo][InterfaceDeclaration-1]&#60;number&#62;

[Boo][InterfaceDeclaration-2]

### Properties

| Name       | Type                  |
| ---------- | --------------------- |
| OtherStuff | Array&#60;string&#62; |

## interface Foo

```typescript
interface Foo<TType> {
    Name: string;
    Surname: string;
    Type: TType;
}
```

### Type parameters

| Name  |
| ----- |
| TType |

### Properties

| Name    | Type   |
| ------- | ------ |
| Name    | string |
| Surname | string |
| Type    | TType  |

## interface Boo

```typescript
interface Boo {
    Boos: string[];
}
```

### Properties

| Name | Type                  |
| ---- | --------------------- |
| Boos | Array&#60;string&#62; |

## interface AnotherInterface

```typescript
interface AnotherInterface {
    <TValue>(param1: TValue, param2: TValue): boolean;
}
```

### Call

```typescript
<TValue>(param1: TValue, param2: TValue): boolean
```

**Type parameters:**

| Name   |
| ------ |
| TValue |

**Parameters:**

| Name   | Type   |
| ------ | ------ |
| param1 | TValue |
| param2 | TValue |

**Return type:**

true | false

## interface MyConstraintType

```typescript
interface MyConstraintType {
    myProperty: string;
}
```

### Properties

| Name       | Type   |
| ---------- | ------ |
| myProperty | string |

## interface MyDefaultType

```typescript
interface MyDefaultType extends MyConstraintType {
    anotherProperty: number;
}
```

### Extends

[MyConstraintType][InterfaceDeclaration-4]

### Properties

| Name            | Type   |
| --------------- | ------ |
| anotherProperty | number |

## interface ObjectsInterface

```typescript
interface ObjectsInterface {
    objectOne: Object;
    objectTwo: Object;
}
```

### Properties

| Name      | Type   |
| --------- | ------ |
| objectOne | Object |
| objectTwo | Object |

## interface InterfaceWithCall

```typescript
interface InterfaceWithCall {
    <T>(): { someProperty: T; };
}
```

### Call

```typescript
<T>(): { someProperty: T; }
```

**Type parameters:**

| Name |
| ---- |
| T    |

**Return type:**

{ someProperty: T; }

## interface InterfaceWithConstraintType

```typescript
interface InterfaceWithConstraintType extends Dictionary<string> {
    someProperty: string;
}
```

### Extends

[Dictionary][InterfaceDeclaration-9]&#60;string&#62;

### Properties

| Name         | Type   |
| ------------ | ------ |
| someProperty | string |

## interface InterfaceWithMethod

```typescript
interface InterfaceWithMethod<T> {
    someMethodOne(): T;
    someMethodTwo<TReturn>(): TReturn;
}
```

### Type parameters

| Name |
| ---- |
| T    |

### Methods

```typescript
someMethodOne(): T
```

**Return type:**

T

```typescript
someMethodTwo<TReturn>(): TReturn
```

**Type parameters:**

| Name    |
| ------- |
| TReturn |

**Return type:**

TReturn

## interface Dictionary

```typescript
interface Dictionary<TValue> {
    new (): Dictionary<TValue>;
    [key: string]: TValue;
}
```

### Type parameters

| Name   |
| ------ |
| TValue |

### Construct

```typescript
new (): Dictionary<TValue>
```

**Return type:**

[Dictionary][InterfaceDeclaration-9]&#60;TValue&#62;

### Index signatures

```typescript
[key: string]: TValue
```

Index `key` - string

Type - TValue

## interface MethodsInterface

```typescript
interface MethodsInterface {
    <TValue>(arg: TValue): void;
    someMethod<T>(): string;
}
```

### Call

```typescript
<TValue>(arg: TValue): void
```

**Type parameters:**

| Name   |
| ------ |
| TValue |

**Parameters:**

| Name | Type   |
| ---- | ------ |
| arg  | TValue |

**Return type:**

void

### Methods

```typescript
someMethod<T>(): string
```

**Type parameters:**

| Name |
| ---- |
| T    |

**Return type:**

string

## interface MonsterInterface

<span style="color: #d2d255;">Warning: Beta!</span>

<span style="color: red;">Deprecated!</span>

Monster interface

```typescript
interface MonsterInterface<TValue extends Object = {}> extends ObjectsInterface {
    new <T>(): MonsterInterface<T>;
    new (someParameter: string): string;
    <T>(): { someProperty: T; };
    <T>(key?: string | undefined): { someProperty: T; };
    <T>(key: number): { someProperty: T; };
    readonly [key: string]: TValue;
    readonly objectOne: TValue;
    objectTwo: TValue;
}
```

### Type parameters

| Name   | Constraint type | Default type |
| ------ | --------------- | ------------ |
| TValue | Object          | \{\}         |

### Extends

[ObjectsInterface][InterfaceDeclaration-6]

### Construct

```typescript
new <T>(): MonsterInterface<T>
```

**Type parameters:**

| Name |
| ---- |
| T    |

**Return type:**

[MonsterInterface][InterfaceDeclaration-12]&#60;T&#62;

```typescript
new (someParameter: string): string
```

**Parameters:**

| Name          | Type   |
| ------------- | ------ |
| someParameter | string |

**Return type:**

string

### Call

```typescript
<T>(): { someProperty: T; }
```

**Type parameters:**

| Name |
| ---- |
| T    |

**Return type:**

{ someProperty: T; }

```typescript
<T>(key?: string | undefined): { someProperty: T; }
```

**Type parameters:**

| Name |
| ---- |
| T    |

**Parameters:**

| Name | Type                    | Optional |
| ---- | ----------------------- | -------- |
| key  | undefined &#124; string | Yes      |

**Return type:**

{ someProperty: T; }

```typescript
<T>(key: number): { someProperty: T; }
```

**Type parameters:**

| Name |
| ---- |
| T    |

**Parameters:**

| Name | Type   |
| ---- | ------ |
| key  | number |

**Return type:**

{ someProperty: T; }

### Index signatures

```typescript
readonly [key: string]: TValue
```

Readonly.

Index `key` - string

Type - TValue

### Properties

| Name      | Type   |
| --------- | ------ |
| objectOne | TValue |
| objectTwo | TValue |

## interface SomeInterface

```typescript
interface SomeInterface {
    [key: string]: string | number;
    [key: number]: string;
}
```

### Index signatures

```typescript
[key: string]: string | number
```

Index `key` - string

Type - string | number

```typescript
[key: number]: string
```

Index `key` - number

Type - string

## interface StringsDictionary

```typescript
interface StringsDictionary {
    [key: string]: string;
}
```

### Index signatures

```typescript
[key: string]: string
```

Index `key` - string

Type - string

## interface MyInterface

```typescript
interface MyInterface {
    MyPropertyOne: string;
    MyPropertyTwo: Object;
    MyPropertyThree: number;
}
```

### Properties

| Name            | Type   |
| --------------- | ------ |
| MyPropertyOne   | string |
| MyPropertyTwo   | Object |
| MyPropertyThree | number |

## [Hello][ClassDeclaration-0]

