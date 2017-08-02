import * as json2md from "json2md";
import { MemberInterface, InterfaceMembers } from "../extractor/api-json-contracts";
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

        for (const memberKey in members) {
            if (members.hasOwnProperty(memberKey)) {
                const member = members[memberKey];
                let row: string[] = [];
                let memberName = memberKey;
                if (!member.isOptional) {
                    memberName += " " + HelpersGenerator.InlineCode("*");
                }

                // TODO: Add remarks
                switch (member.kind) {
                    case "method":
                        row = [
                            memberName,
                            // TODO: Return type description
                            (member.returnValue != null ? member.returnValue.type : "void"),
                            member.summary.map(x => x.value).join(".")
                        ];
                        break;
                    case "property":
                        row = [
                            memberName,
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
}
