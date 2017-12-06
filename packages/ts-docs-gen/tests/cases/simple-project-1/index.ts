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

export const SampleConst: string = "sample-const";

export class Foo {
    public HandleMessage(message: string): string {
        return message;
    }
}
