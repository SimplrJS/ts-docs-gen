// tslint:disable

export type FooBar = Foo<string> | Boo;

export interface ExtendedBar extends Foo<number>, Boo {
    OtherStuff: string[];
}

export interface Foo<TType> {
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


// import { Foo } from "./exported-functions";

// export class World { }
// export class Earth { }
// export class Earth { }

// export declare const Hello: World & Earth;

// export const FooFunc = Foo;

//---------------------------------------------------------


// #region Parameters

// #endregion Parameters

// export function Foo(): string {
//     return "foo";
// }

// /**
//  * Some general comment about Bar function.
//  * 
//  * @beta Some comment on beta.
//  * @deprecated
//  */
// export function Bar(parameter1: string, parameter2: number): string {
//     return "bar";
// }

// #region Return types
// export function FunctionWithoutReturnType<T extends Array<T>>(parameter1: string, parameter2: Promise<T>) {
//     return "bar";
// }

// export function FunctionWithGenericReturnType(): Array<string> {
//     return [];
// }

// export function FunctionWithPrimitiveReturnType(): boolean {
//     return true;
// }

// export function FunctionWithUnionReturnType(): "something" | "nothing" {
//     return "nothing";
// }

// export function FunctionWithIntersectionReturnType(): Earth & World {
//     return {};
// }
// #endregion Return types

// ------------------------------------------------------

// export * from "./exported-functions";
// export { Kintamasis as Pakeistas } from "./exported-const-variables";
// export type A<TValue> = number & { ok(): TValue };

// Two types have a one common field
// export type OneCommonField1 = {
//     BarName: string;
//     FooName: string;
// };

// export type OneCommonField2 = {
//     BarName: string;
//     BazName: string;
// };

// export type OneCommonFieldTypeIntersection = OneCommonField1 | OneCommonField2;

// export interface MyConstraintType {
//     myProperty: string;
// }
// export interface MyDefaultType extends MyConstraintType {
//     anotherProperty: number;
// }

// export function MyFunction<T extends { myProperty: string, myPropertyTwo?: number } = { myProperty: string }>(): T {
//     return {
//         myProperty: "sampleString"
//     } as T;
// }

// export interface MyInterface {
//     <TValue>(param1: TValue, param2: TValue): boolean;
// }

// /**
//  * Some JSdoc information.
//  * 2nd line of some JSdoc information.
//  * @summary Some summary about this package version.
//  * @summary 2nd of some summary about this package version.
//  */
// export const itemsList: string[] = ["a"];

// export function Ok(isIt: boolean): boolean {
//     return isIt;
// }

// export function OkWithoutReturnType(isIt: boolean) {
//     return isIt;
// }

// export namespace SomeKindOfModule {
//     export const name = "some-kind-of-module";
// }

/**
 * Some information
 * 2nd line of some information
 * 3rd line of some information
 * 4th line of some information
 * 5th line of some information
 * @summary Some summary about this package version.
 * @summary 2nd of some summary about this package version.
 * @deprecated
 * @beta
 */
export enum Uogos {
    Jokie = "jokie",
    Braskes = "braskes"
}

// export enum Skaiciai {
//     Nulis = 0,
//     Vienas = 1,
//     Du = 2
// }

// export enum Sarasas {
//     /**
//      * Pirmo description'as
//      */
//     Pirmas,
//     /**
//      * Antro description'as
//      */
//     Antras,
//     /**
//      * Trečio description'as
//      */
//     Trecias
// }

export const enum ConstSkaiciai {
    PirmasC = 0,
    AntrasC = 1,
    TreciasC = 2
}

// export const enum ConstSarasas {
//     /**
//      * Pirmo description'as
//      */
//     PirmasC,
//     /**
//      * Antro description'as
//      */
//     AntrasC,
//     /**
//      * Trečio description'as
//      */
//     TreciasC
// }

// export interface Boo {
//     Boos: string[];
// }

// export interface Foo<TType> {
//     Name: string;
//     Surname: string;
//     Type: TType;
// }

// export interface Bar extends Foo<number>, Boo {
//     OtherStuff: string[];
// }

// export interface A {
//     (aa: boolean): string;
// }

// export abstract class Foo {
//     public Name: string;

//     private somePrivateProperty: any;

//     public GetName(ok: string): string;
//     public GetName(ok: string, ok2?: string): string {
//         return this.Name;
//     }

//     public abstract Bar(): string;
// }

// /**
//  * @deprecated Use uogos instead ;)
//  */
// export type Hello = Uogos;

export interface Props {
    name: string;
}

export function Component<T extends Props = Props>(arg: T): void { }

export class Hello {
    /**
     * This is a constructor
     * @param arg This is an argument ;)
     */
    constructor(arg: string) { }

    /**
     * Comment about Render
     * @beta
     * @param arg Argument comment here.
     */
    public render<T extends String = String>(arg: T): T {
        return arg;
    }

    // get Foo(): string {
    //     throw new Error("Method not implemented.");
    // }

    // set Foo(arg: string) { }

    // public static set Bar(arg: string) { }
}
