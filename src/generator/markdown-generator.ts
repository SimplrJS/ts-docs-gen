import * as json2md from "json2md";

import {
    ApiJson,
    Members,
    MemberList,
    MemberInterface,
    MemberEnum,
    MemberProperty,
    MemberFunction,
    MemberClass
} from "../extractor/api-json-contracts";

import { HelpersGenerator } from "./helpers-generator";

import { InterfaceGenerator } from "./interface-generator";
import { EnumGenerator } from "./enum-generator";
import { PropertyGenerator } from "./property-generator";
import { FunctionGenerator } from "./function-generator";
import { ClassGenerator } from "./class-generator";

type MembersDict = {
    [key in keyof MemberList]: { [key: string]: MemberList[key] };
};

export class MarkdownGenerator {
    private markdown: json2md.DataObject[] = [];

    constructor(protected Json: ApiJson) {
        // this.Json.exports
        this.renderPackage(Json);
        this.renderMembers(Json.exports);
    }

    public Render(): string {
        return json2md(this.markdown);
    }

    private renderMembers(members: { [key: string]: Members }): void {
        const dict: MembersDict = {
            enum: {},
            interface: {},
            function: {},
            property: {},
            class: {},
            namespace: {}
        };

        // Filter
        for (const memberKey in members) {
            if (members.hasOwnProperty(memberKey)) {
                const member = members[memberKey];
                dict[member.kind][memberKey] = member;
            }
        }

        this.markdown = this.markdown.concat(this.renderInterfaces(dict.interface));
        this.markdown = this.markdown.concat(this.renderEnums(dict.enum));
        this.markdown = this.markdown.concat(this.renderFunctions(dict.function));
        this.markdown = this.markdown.concat(this.renderClass(dict.class));
    }

    private renderPackage(pckg: ApiJson): void {
        const md: json2md.DataObject[] = [
            {
                h1: "Package name"
            }
        ];

        // Package summary.
        if (pckg.summary.length !== 0) {
            md.push({
                p: pckg.summary.map(x => x.value).join("\n")
            });
        }

        this.markdown = this.markdown.concat(md);
    }

    private renderInterfaces(interfaces: { [key: string]: MemberInterface }): json2md.DataObject[] {
        if (Object.keys(interfaces).length === 0) {
            return [];
        }

        let md: json2md.DataObject[] = [
            {
                h2: "Interfaces"
            }
        ];

        for (const interfaceKey in interfaces) {
            if (interfaces.hasOwnProperty(interfaceKey)) {
                const memberInterface = interfaces[interfaceKey];
                md = md.concat(InterfaceGenerator.RenderInterface(interfaceKey, memberInterface));
            }
        }

        return md;
    }

    private renderEnums(enums: { [key: string]: MemberEnum }): json2md.DataObject[] {
        if (Object.keys(enums).length === 0) {
            return [];
        }

        let md: json2md.DataObject[] = [
            {
                h2: "Enums"
            }
        ];

        for (const enumKey in enums) {
            if (enums.hasOwnProperty(enumKey)) {
                const memberEnum = enums[enumKey];
                md = md.concat(EnumGenerator.RenderEnum(enumKey, memberEnum));
            }
        }

        return md;
    }

    private renderFunctions(functions: { [key: string]: MemberFunction }): json2md.DataObject[] {
        if (Object.keys(functions).length === 0) {
            return [];
        }

        let md: json2md.DataObject[] = [
            {
                h2: "Functions"
            }
        ];

        for (const functionKey in functions) {
            if (functions.hasOwnProperty(functionKey)) {
                const memberFunction = functions[functionKey];
                md = md.concat(FunctionGenerator.RenderFunction(functionKey, memberFunction));
            }
        }

        return md;
    }

    private renderClass(classes: { [key: string]: MemberClass }): json2md.DataObject[] {
        const names = Object.keys(classes);
        if (names.length === 0) {
            return [];
        }

        let md: json2md.DataObject[] = [
            {
                h2: "Classes"
            }
        ];

        for (const className in classes) {
            if (classes.hasOwnProperty(className)) {
                const memberClass = classes[className];
                md = md.concat(ClassGenerator.RenderClass(className, memberClass));
            }
        }

        return md;
    }

    // private renderProperties(properties: { [key: string]: MemberProperty }): json2md.DataObject[] {
    //     if (Object.keys(properties).length === 0) {
    //         return [];
    //     }

    //     let md: json2md.DataObject[] = [
    //         {
    //             h2: "Properties"
    //         }
    //     ];

    //     for (const enumKey in properties) {
    //         if (properties.hasOwnProperty(enumKey)) {
    //             const memberProperty = properties[enumKey];
    //             md = md.concat(PropertyGenerator.RenderProperty(enumKey, memberProperty));
    //         }
    //     }

    //     return md;
    // }
}
