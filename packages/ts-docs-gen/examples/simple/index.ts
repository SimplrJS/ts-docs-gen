// tslint:disable

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

export function MyFunction<T extends { myProperty: string, myPropertyTwo?: number } = { myProperty: string }>(): T {
    return {
        myProperty: "sampleString"
    } as T;
}

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

// /**
//  * Some information
//  * 2nd line of some information
//  * 3rd line of some information
//  * 4th line of some information
//  * 5th line of some information
//  * @summary Some summary about this package version.
//  * @summary 2nd of some summary about this package version.
//  * @deprecated
//  * @beta
//  */
// export enum Uogos {
//     Jokie = "jokie",
//     Braskes = "braskes"
// }

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

// export const enum ConstSkaiciai {
//     PirmasC = 0,
//     AntrasC = 1,
//     TreciasC = 2
// }

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

export namespace FooNamespace {
    export namespace BooNamespace {
        export namespace BooNamespace2 {
            export const Hello = "World!";
        }
    }
}
