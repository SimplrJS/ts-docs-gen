import * as json2md from "json2md";
import { MemberInterface, InterfaceMembers, MemberMethod } from "../extractor/api-json-contracts";
import { HelpersGenerator } from "./helpers-generator";
import { Table } from "./generator-contracts";

export namespace InterfaceGenerator {
    export function RenderInterface(name: string, memberInterface: MemberInterface): json2md.DataObject[] {
        let md: json2md.DataObject[] = [
            {
                h3: name
            }
        ];

        // Summary
        if (memberInterface.summary.length !== 0) {
            md.push({
                p: memberInterface.summary.map(x => x.value)
            });
        }

        // Remarks
        if (memberInterface.remarks.length !== 0) {
            md.push({
                p: memberInterface.remarks.map(x => x.value)
            });
        }

        // Extends
        if (memberInterface.extends !== "") {
            md = md.concat(HelpersGenerator.RenderExtends(memberInterface.extends));
        }

        // Implements
        if (memberInterface.implements !== "") {
            md = md.concat(HelpersGenerator.RenderImplements(memberInterface.implements));
        }

        // Table of members
        md.push({
            table: renderInterfaceMembers(memberInterface.members)
        });

        return md;
    }

    function renderInterfaceMembers(members: { [member: string]: InterfaceMembers }): Table {
        const table: Table = {
            headers: ["Name", "Type", "Summary"],
            rows: []
        };

        for (const memberName in members) {
            if (members.hasOwnProperty(memberName)) {
                const member = members[memberName];
                let row: string[] = [];
                const optional = (member.isOptional ? "" : "*");

                // TODO: Add remarks
                switch (member.kind) {
                    case "method":
                        row = [
                            `${renderMethodString(memberName, member)}${optional}`,
                            // TODO: Return type description
                            (member.returnValue != null ? member.returnValue.type : "void"),
                            member.summary.map(x => x.value).join(".")
                        ];
                        break;
                    case "property":
                        row = [
                            `${memberName}${optional}`,
                            member.type,
                            member.summary.map(x => x.value).join(".")
                        ];
                        break;
                }

                table.rows.push(row);
            }
        }

        return table;
    }

    function renderMethodString(name: string, method: MemberMethod): string {
        const parametersList: string[] = [];
        const optionalName = (method.isOptional ? "?" : "");

        for (const parameterName in method.parameters) {
            if (method.parameters.hasOwnProperty(parameterName)) {
                const parameter = method.parameters[parameterName];
                const optional = (parameter.isOptional ? "?" : "");
                const line: string = `${parameterName}${optional}: ${HelpersGenerator.InlineCode(parameter.type)}`;

                // FIXME: When there is description on this param.
                // if (parameter.description != null) {
                //     // line += ` - ${parameter.description.map(x => x.}` 
                // }

                parametersList.push(line);
            }
        }

        return `${name}${optionalName}(${parametersList.join(", ")}) `;
    }
}
