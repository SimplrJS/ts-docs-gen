export namespace NamespaceOne {
    export namespace NamespaceTwo {
        export class SomeClass {
            public static Name: string = "_some_class";
        }
    }

    export namespace NamespaceThree {
        export namespace NamespaceFour {
            export interface InterfaceInFour {
                Property1: string;
                Property2: string;
            }
        }
    }
}
