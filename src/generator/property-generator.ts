import * as json2md from "json2md";

import { MemberProperty } from "../extractor/api-json-contracts";

export namespace PropertyGenerator {
    export function RenderProperty(name: string, memberProperty: MemberProperty): json2md.DataObject[] {
        const md: json2md.DataObject[] = [
            {
                h5: name
            }
        ];

        // Summary
        if (memberProperty.summary.length !== 0) {
            md.push({
                p: memberProperty.summary.map(x => x.value).join("\n")
            });
        }

        // Remarks
        if (memberProperty.remarks.length !== 0) {
            md.push({
                p: memberProperty.remarks.map(x => x.value).join("\n")
            });
        }

        const staticProperty = (memberProperty.isStatic ? "static " : "");
        const readOnly = (memberProperty.isReadOnly ? "readonly " : "");
        const optional = (memberProperty.isOptional ? "?" : "");

        md.push({
            code: {
                language: "ts",
                content: `${staticProperty}${readOnly}${name}${optional}: ${memberProperty.type};`
            }
        });

        return md;
    }
}
