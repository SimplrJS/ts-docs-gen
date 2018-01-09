/**
 * General comment about SimpleNamespace.
 */
export namespace SimpleNamespace {
    export interface SimpleInterface {
        Property1: string;
        Property2: string;
    }

    // TODO: Append used references in ApiVariablePlugin with type reference.
    export const SimpleObject: AnotherSimpleNamespace.SimpleInterface = {
        Property1: "1",
        Property2: "2",
        Property3: "3"
    };
}

export namespace AnotherSimpleNamespace {
    export interface SimpleInterface extends SimpleNamespace.SimpleInterface {
        Property3: string;
    }
}
