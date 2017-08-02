import * as json2md from "json2md";

import {
    ApiJson,
    Members,
    MemberClass,
    MemberProperty,
    MemberMethod
} from "../extractor/api-json-contracts";
import { HelpersGenerator } from "./helpers-generator";
import { PropertyGenerator } from "./property-generator";
import { MethodGenerator } from "./method-generator";

export namespace ClassGenerator {
    export function RenderClass(name: string, memberClass: MemberClass): json2md.DataObject[] {
        let md: json2md.DataObject[] = [
            {
                h3: name
            }
        ];

        // Summary
        if (memberClass.summary.length !== 0) {
            md.push({
                p: memberClass.summary.map(x => x.value).join("\n")
            });
        }

        // Remarks
        if (memberClass.remarks.length !== 0) {
            md.push({
                p: memberClass.remarks.map(x => x.value).join("\n")
            });
        }

        // Extends
        if (memberClass.extends !== "") {
            md = md.concat(HelpersGenerator.RenderExtends(memberClass.extends));
        }

        // Implements
        if (memberClass.implements !== "") {
            md = md.concat(HelpersGenerator.RenderImplements(memberClass.implements));
        }

        const properties: { [name: string]: MemberProperty } = {};
        const methods: { [name: string]: MemberMethod } = {};
        for (const memberKey in memberClass.members) {
            if (memberClass.members.hasOwnProperty(memberKey)) {
                const member = memberClass.members[memberKey];
                switch (member.kind) {
                    case "method":
                        methods[memberKey] = member;
                        break;
                    case "property":
                        properties[memberKey] = member;
                        break;
                }
            }
        }

        md = md.concat(renderProperties(properties));
        md = md.concat(renderMethods(methods));

        return md;
    }

    function renderProperties(properties: { [name: string]: MemberProperty }): json2md.DataObject[] {
        let md: json2md.DataObject[] = [
            {
                h4: "Properties"
            }
        ];

        let list: json2md.DataObject[] = [];

        for (const propertyName in properties) {
            if (properties.hasOwnProperty(propertyName)) {
                const memberProperty = properties[propertyName];
                list = list.concat(PropertyGenerator.RenderProperty(propertyName, memberProperty));
            }
        }

        if (list.length === 0) {
            return [];
        }

        md = md.concat(list);

        return md;
    }

    function renderMethods(methods: { [name: string]: MemberMethod }): json2md.DataObject[] {
        let md: json2md.DataObject[] = [
            {
                h4: "Methods"
            }
        ];

        let list: json2md.DataObject[] = [];

        for (const methodName in methods) {
            if (methods.hasOwnProperty(methodName)) {
                const memberMethod = methods[methodName];
                list = list.concat(MethodGenerator.RenderMethod(methodName, memberMethod));
            }
        }

        if (list.length === 0) {
            return [];
        }

        md = md.concat(list);

        return md;
    }
}
