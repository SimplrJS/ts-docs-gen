import * as json2md from "json2md";
import { MemberEnum, MemberEnumValue } from "../extractor/api-json-contracts";
import { HelpersGenerator } from "./helpers-generator";
import { Table } from "./generator-contracts";

export namespace EnumGenerator {
    export function RenderEnum(name: string, memberEnum: MemberEnum): json2md.DataObject[] {
        const md: json2md.DataObject[] = [
            {
                h3: name
            }
        ];

        // Summary
        if (memberEnum.summary.length !== 0) {
            md.push({
                p: memberEnum.summary.map(x => x.value)
            });
        }

        // Remarks
        if (memberEnum.remarks.length !== 0) {
            md.push({
                p: memberEnum.remarks.map(x => x.value)
            });
        }

        // Table of values
        md.push({
            table: renderEnumValues(memberEnum.values)
        });

        return md;
    }

    function renderEnumValues(members: { [member: string]: MemberEnumValue }): Table {
        const table: Table = {
            headers: ["Name", "Value", "Summary"],
            rows: []
        };

        for (const memberKey in members) {
            if (members.hasOwnProperty(memberKey)) {
                const member = members[memberKey];
                const row: string[] = [
                    memberKey,
                    member.value,
                    member.summary.map(x => x.value).join(".")
                ];

                table.rows.push(row);
            }
        }

        // Sort rows by values
        table.rows.sort((x, y) => {
            const xValue = x[1];
            const yValue = y[1];
            if (isNumberCheck(xValue) && isNumberCheck(yValue)) {
                return xValue - yValue;
            }

            return 0;
        });

        return table;
    }

    function isNumberCheck(a: string | number): a is number {
        return isFinite(a as number);
    }
}
