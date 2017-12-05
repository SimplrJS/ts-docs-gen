// tslint:disable

// import { MyInterface } from "./my-types";

export class World { }

export const Hello = new World();

// export function Foo(): string {
//     return "foo";
// }

// export function Bar(): string {
//     return "bar";
// }

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

// export function Funkcija<T extends MyConstraintType = MyDefaultType>(): T {
//     return {
//         myProperty: "asd"
//     } as T;
// }

// export interface MyInterface {
//     <TValue>(param1: TValue, param2: TValue): boolean;
// }

/**
 * Some JSdoc information.
 * 2nd line of some JSdoc information.
 * @summary Some summary about this package version.
 * @summary 2nd of some summary about this package version.
 */
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
//     Pirmas,
//     Antras,
//     Trecias
// }

// export interface Boo {
//     Boos: string[];
// }

// export interface Foo<TType> {
//     Name: string;
//     Surname: string;
//     Type: TType;
// }

export async function GetFoo(): Promise<void> {
    return;
}

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
