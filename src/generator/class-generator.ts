import * as json2md from "json2md";

import {
    ApiJson,
    Members,
    MemberClass,
    MemberProperty,
    MemberMethod
} from "../extractor/api-json-contracts";
import { HelpersGenerator } from "./helpers-generator";

export namespace ClassGenerator {
    export function renderClass(name: string, memberClass: MemberClass): json2md.DataObject[] {
        let md: json2md.DataObject[] = [
            {
                h3: name
            }
        ];

        // TODO: IsBeta

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

        return md;
    }
}
