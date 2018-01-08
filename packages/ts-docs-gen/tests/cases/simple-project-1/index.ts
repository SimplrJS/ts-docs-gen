// #region Types
export type SimpleType = { Property1: string; Property2: string; };

export type GenericType<T> = { Property: T; };

export type UnionType = string | undefined;

export type UnionTypeWithLiterals = { Property1: string; } | { Property2: number; };

export type IntersectionType = SimpleType & GenericType<number>;

export type IntersectionTypeWithLiterals = { Property1: string; } & { Property2: number; };

export type Easing = "ease-in" | "ease-out" | "ease-in-out";

export type Numbers = 1 | 2 | 3 | 4 | 5 | 6;

export type Name = string;

export type NameResolver = () => string;

export type NameOrResolver = Name | NameResolver;

export type Tree<T> = {
    value: T;
    left: Tree<T>;
    right: Tree<T>;
};

export type LinkedList<T> = T & { next: LinkedList<T> };

export type Negative = void | never;

export type IndexType = { [key: string]: number; };

export type SelectedNumbers = Readonly<Numbers>;

export type PartialSimpleType = Partial<SimpleType>;

export type Proxy<T> = {
    get(): T;
    set(value: T): void;
};

// TODO: fix invalid output in return type.
export type TypeWithMultipleTypeParameters<T, V, U> = {
    PropertyT: T;
    PropertyV: V;
    PropertyU: U;
};
// #endregion Types

// #region Interfaces
export interface ExtendedBar extends FooInterface<number>, Boo {
    OtherStuff: string[];
}

export interface FooInterface<TType> {
    Name: string;
    Surname: string;
    Type: TType;
}

export interface Boo {
    Boos: string[];
}

export interface AnotherInterface {
    <TValue>(param1: TValue, param2: TValue): boolean;
}

export interface MyConstraintType {
    myProperty: string;
}

export interface MyDefaultType extends MyConstraintType {
    anotherProperty: number;
}

export interface ObjectsInterface {
    objectOne: Object;
    objectTwo: Object;
}

export interface InterfaceWithCall {
    <T>(): { someProperty: T };
}

export interface InterfaceWithConstraintType extends Dictionary<string> {
    someProperty: string;
}

export interface InterfaceWithMethod<T> {
    someMethodOne(): T;
    someMethodTwo<TReturn>(): TReturn;
}

export interface Dictionary<TValue> {
    new(): Dictionary<TValue>;
    [key: string]: TValue;
}

export interface MethodsInterface {
    someMethod<T>(): string;
    <TValue>(arg: TValue): void;
}

/**
 * Monster interface
 * @beta
 * @deprecated
 */
export interface MonsterInterface<TValue extends Object = {}> extends ObjectsInterface {
    new <T>(): MonsterInterface<T>;
    new(someParameter: string): string;

    readonly [key: string]: TValue;

    <T>(): { someProperty: T };
    <T>(key?: string): { someProperty: T };
    <T>(key: number): { someProperty: T };

    readonly objectOne: TValue;
    objectTwo: TValue;
}

export interface SomeInterface {
    [key: string]: string | number;
    [key: number]: string;
}

export interface StringsDictionary {
    [key: string]: string;
}

export interface MyInterface {
    MyPropertyOne: string;
    MyPropertyTwo: Object;
    MyPropertyThree: number;
}
// #endregion Interfaces

// #region Enums
/**
 * Simple list.
 */
export enum EnumList {
    /**
     * Description for First option.
     */
    FirstOption,
    /**
     * Description for Second option.
     */
    SecondOption,
    /**
     * Description for Third option.
     */
    ThirdOption
}

/**
 * List with number values with no punctuation at the end of description
 */
export enum EnumListWithNumberValues {
    FirstOption = 1,
    SecondOption = 2,
    ThirdOption = 3
}

/**
 * @beta
 * @deprecated
 */
export enum EnumListWithStringValues {
    FirstOption = "first",
    SecondOption = "second",
    ThirdOption = "third"
}

// #endregion Enums

export const SampleConst: string = "sample-const";

export class Foo {
    public HandleMessage(message: string): string {
        return message;
    }
}

export class World { }
export class Earth { }

// #region Functions

export function AnotherFoo<T extends Object>(parameter1: string, parameter2: Promise<T>): string {
    return "bar";
}

export async function GetFoo(): Promise<void> {
    return;
}

export function FunctionWithOneParameter(parameter: string): void {
    return;
}

export function FunctionWithNoParameters(): void {
    return;
}

export function FunctionWithMultipleParameters(parameter1: string, parameter2: number): void {
    return;
}

/**
 * Some general comment about Bar function.
 *
 * @beta Some comment on beta.
 * @deprecated
 */
export function Bar(parameter1: string, parameter2: number): string {
    return "bar";
}

/**
 * Comment on Function with multiple type parameters.
 *
 * @template T Parameter T comment
 * @template P Parameter P comment
 * @param parameter1 Parameter one comment
 * @param parameter2 Parameter two comment
 * @returns Return type comment
 */
export function FunctionWithMultipleTypeParameters<T extends Object, P>(parameter1: T, parameter2: P): string {
    return "bar";
}

/**
 * Some general comment about Function with type parameter default function.
 */
export function FunctionWithTypeParameterDefault<T extends Object = {}>(parameter1: string, parameter2: T): string {
    return "bar";
}

/**
 * Some general comment about AnotherBar function.
 */
export function FunctionWithTypeParameterConstraint<T extends Object>(parameter1: string, parameter2: T): string {
    return "bar";
}

export function FunctionWithoutReturnType<T extends T[]>(parameter1: string, parameter2: Promise<T>): string {
    return "bar";
}

export function FunctionWithGenericReturnType(): string[] {
    return [];
}

export function FunctionWithPrimitiveReturnType(): boolean {
    return true;
}

export function FunctionWithUnionReturnType(): "something" | "nothing" {
    return "nothing";
}

export function FunctionWithIntersectionReturnType(): Earth & World {
    return {};
}

/**
 * Function with TypeParameter as TypeLiteral.
 */
export function MyFunction<T extends { myProperty: string, myPropertyTwo?: number } = { myProperty: string }>(): T {
    return {
        myProperty: "sampleString"
    } as T;
}

export function FunctionWithInitializedNumberParameter(someParameter: number = 12): number {
    return someParameter;
}

export function FunctionWithInitializedStringParameter(someParameter: string = "12"): string {
    return someParameter;
}

// #endregion Functions
