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

// #endregion Functions
