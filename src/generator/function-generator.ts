import * as json2md from "json2md";

import { MemberFunction, Param, ReturnValue } from "../extractor/api-json-contracts";
import { HelpersGenerator } from "./helpers-generator";

export namespace FunctionGenerator {
    export function RenderFunction(name: string, memberFunction: MemberFunction): json2md.DataObject[] {
        let md: json2md.DataObject[] = [
            {
                h3: name
            }
        ];

        // Summary
        if (memberFunction.summary.length !== 0) {
            md.push({
                p: memberFunction.summary.map(x => x.value).join("\n")
            });
        }

        // Remarks
        if (memberFunction.remarks.length !== 0) {
            md.push({
                p: memberFunction.remarks.map(x => x.value).join("\n")
            });
        }

        md.push({
            code: {
                language: "ts",
                content: memberFunction.declarationLine.replace("export ", "")
            }
        });

        // Parameters
        md = md.concat(renderFunctionParameters(memberFunction.parameters));

        // Returns value
        const returnValueDesc = memberFunction.returnValue.description.map(x => x.value).join(".");
        md = md.concat([
            {
                h4: "Returns"
            },
            {
                p: `${HelpersGenerator.InlineCode(memberFunction.returnValue.type)} ${returnValueDesc}`
            }
        ]);

        return md;
    }



    function renderFunctionParameters(parameters: { [key: string]: Param }): json2md.DataObject[] {
        const md: json2md.DataObject[] = [
            {
                h4: "Parameters"
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
