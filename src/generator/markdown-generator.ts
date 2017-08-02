import * as json2md from "json2md";

import {
    ApiJson,
    Members,
    MemberList,
    MemberInterface
} from "../extractor/api-json-contracts";

import { HelpersGenerator } from "./helpers-generator";

import { InterfaceGenerator } from "./interface-generator";

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
            class: {},
            enum: {},
            function: {},
            interface: {},
            namespace: {},
            property: {}
        };

        // Filter
        for (const memberKey in members) {
            if (members.hasOwnProperty(memberKey)) {
                const member = members[memberKey];
                dict[member.kind][memberKey] = member;
            }
        }

        this.markdown = this.markdown.concat(this.renderInterfaces(dict.interface));
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
}
