// tslint:disable

// export type SimpleType = { Property1: string; Property2: string; };

// export type GenericType<T> = { Property: T; };

// export type UnionType = string | undefined;

// export type UnionTypeWithLiterals = { Property1: string; } | { Property2: number; };

// export type IntersectionType = SimpleType & GenericType<number>;

// export type IntersectionTypeWithLiterals = { Property1: string; } & { Property2: number; };

// export type Easing = "ease-in" | "ease-out" | "ease-in-out";

// export type Numbers = 1 | 2 ;

// export type Name = string;

// export type NameResolver = () => string;

// export type NameOrResolver = Name | NameResolver;

// export type Tree<T> = {
//     value: T;
//     left: Tree<T>;
//     right: Tree<T>;
// };

// export type LinkedList<T> = T & { next: LinkedList<T> };

// export type Negative = void | never;

// export type IndexType = { [key: string]: number; };

// export type PartialSimpleType = Partial<SimpleType>;

// export type Proxy<T> = {
//     get(): T;
//     set(value: T): void;
// };

// // TODO: fix invalid output in return type.
// export type TypeWithMultipleTypeParameters<T, V, U> = {
//     PropertyT: T;
//     PropertyV: V;
//     PropertyU: U;
// };

export interface Foo {
    A: string;
}

export type SelectedNumbers = Readonly<Foo>;
