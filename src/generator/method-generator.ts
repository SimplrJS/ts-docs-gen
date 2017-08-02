import * as json2md from "json2md";

import { MemberMethod, Param, ReturnValue } from "../extractor/api-json-contracts";
import { HelpersGenerator } from "./helpers-generator";

export namespace MethodGenerator {
    export function RenderMethod(name: string, memberMethod: MemberMethod): json2md.DataObject[] {
        let md: json2md.DataObject[] = [
            {
                h5: name
            }
        ];

        // Summary
        if (memberMethod.summary.length !== 0) {
            md.push({
                p: memberMethod.summary.map(x => x.value).join("\n")
            });
        }

        // Remarks
        if (memberMethod.remarks.length !== 0) {
            md.push({
                p: memberMethod.remarks.map(x => x.value).join("\n")
            });
        }

        md.push({
            code: {
                language: "ts",
                content: renderMethodCode(name, memberMethod, memberMethod.returnValue)
            }
        });

        // Parameters
        md = md.concat(renderMethodParameters(memberMethod.parameters));

        // Returns value
        const returnValueDesc = memberMethod.returnValue.description.map(x => x.value).join(".");
        md = md.concat([
            {
                h6: "Returns"
            },
            {
                p: `${HelpersGenerator.InlineCode(memberMethod.returnValue.type)} ${returnValueDesc}`
            }
        ]);

        return md;
    }

    function renderMethodCode(name: string, memberMethod: MemberMethod, returnValue?: ReturnValue): string {
        const params: string[] = [];
        let returnValueString: string = "";

        if (returnValue != null) {
            returnValueString += `: ${returnValue.type}`;
        }

        for (const parameterName in memberMethod.parameters) {
            if (memberMethod.parameters.hasOwnProperty(parameterName)) {
                const parameter = memberMethod.parameters[parameterName];
                const optional = (parameter.isOptional ? "?" : "");
                params.push(`${parameterName}${optional}: ${parameter.type}`);
            }
        }

        const staticString = (memberMethod.isStatic ? "static " : "");
        return `${staticString}${name}(${params.join(", ")})${returnValueString}`;
    }

    function renderMethodParameters(parameters: { [key: string]: Param }): json2md.DataObject[] {
        const md: json2md.DataObject[] = [
            {
                h6: "Parameters"
            }
        ];
        const parametersList: string[] = [];

        for (const parameterName in parameters) {
            if (parameters.hasOwnProperty(parameterName)) {
                const parameter = parameters[parameterName];
                const optional = (parameter.isOptional ? "?" : "");
                const line: string = `${parameterName}${optional}: ${HelpersGenerator.InlineCode(parameter.type)}`;

                // FIXME: When there is description on this param.
                // if (parameter.description != null) {
                //     // line += ` - ${parameter.description.map(x => x.}` 
                // }

                parametersList.push(line);
            }
        }

        if (parametersList.length === 0) {
            return [];
        }

        md.push({
            ul: parametersList
        });

        return md;
    }
}
