import { IReturn, IParam as Param } from "@microsoft/api-extractor/lib/IDocElement";

export {
    Param
};

export interface ApiJson {
    kind: "package";
    summary: ItemValue[];
    remarks: ItemValue[];
    exports: { [name: string]: Members };
}

export interface DefaultInfo {
    deprecatedMessage: any[];
    summary: ItemValue[];
    remarks: ItemValue[];
    isBeta: boolean;
}

export interface ReturnValue {
    /**
     * Examples: "string", "void"
     */
    type: string;
    description: ItemValue[];
}

export interface ItemValue {
    kind: string;
    value: string;
}

export interface MemberList {
    "interface": MemberInterface;
    "property": MemberProperty;
    "namespace": MemberNamespace;
    "enum": MemberEnum;
    "class": MemberClass;
    "function": MemberFunction;
}

export type Members = MemberInterface | MemberProperty | MemberNamespace | MemberEnum | MemberClass | MemberFunction;
export type InterfaceMembers = MemberProperty | MemberMethod;

export interface MemberInterface extends DefaultInfo {
    kind: "interface";
    extends: string;
    implements: string;
    typeParameters: any[];
    members: { [member: string]: InterfaceMembers };
}

export interface MemberProperty extends DefaultInfo {
    kind: "property";
    declarationLine: string;
    /**
     * Examples: "string", "void"
     */
    type: string;
    isOptional: boolean;
    isReadOnly: boolean;
    isStatic: boolean;
}

export interface MemberMethod extends DefaultInfo {
    kind: "method";
    declarationLine: string;
    /**
     * Example: 'public Method(arg: string): void;'
     */
    signature: string;
    /**
     * Example: "public"
     */
    accessModifier: string;
    isOptional: boolean;
    isStatic: boolean;
    returnValue: ReturnValue;
    parameters: { [key: string]: Param };
}

export interface MemberNamespace extends DefaultInfo {
    kind: "namespace";
    deprecatedMessage: any[];
    exports: { [members: string]: Members };
}

export interface MemberEnum extends DefaultInfo {
    kind: "enum";
    values: { [enumValue: string]: MemberEnumValue };
}

export interface MemberEnumValue extends DefaultInfo {
    kind: "enum value";
    value: string;
}

export interface MemberClass extends DefaultInfo {
    kind: "class";
    extends: string;
    implements: string;
    typeParameters: any[];
    members: { [member: string]: MemberProperty | MemberMethod };
}

export interface MemberFunction extends DefaultInfo {
    kind: "function";
    declarationLine: string;
    returnValue: ReturnValue;
    parameters: { [name: string]: Param };
}
