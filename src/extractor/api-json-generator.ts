import { ApiJsonGenerator as Generator, Extractor } from "@microsoft/api-extractor";
import ApiParameter from "@microsoft/api-extractor/lib/definitions/ApiParameter";
import ApiFunction from "@microsoft/api-extractor/lib/definitions/ApiFunction";
import { ReleaseTag } from "@microsoft/api-extractor/lib/definitions/ApiDocumentation";
import ApiJsonFile from "@microsoft/api-extractor/lib/generators/ApiJsonFile";
import { IReturn, IParam } from "@microsoft/api-extractor/lib/IDocElement";

import { ApiJson } from "./api-json-contracts";

export class ApiJsonGenerator extends Generator {
    public GetFileContents(extractor: Extractor): ApiJson {
        this.visit(extractor.package, this.jsonOutput);

        // TODO: Add JSON validation scheme.

        return this.jsonOutput as ApiJson;
    }

    protected visitApiFunction(apiFunction: ApiFunction, refObject?: { [key: string]: any }): void {
        if (!apiFunction.supportedName) {
            return;
        }

        const parameters: { [key: string]: IParam } = {};

        for (const param of apiFunction.params) {
            // FIXME: any
            parameters[param.name] = {} as any;

            this.visitApiParam(param, parameters[param.name]);
        }
        const returnValueNode: IReturn = {
            type: apiFunction.returnType,
            description: apiFunction.documentation.returnsMessage
        };

        const newNode: Object = {
            kind: ApiJsonFile.convertKindToJson(apiFunction.kind),
            returnValue: returnValueNode,
            parameters: parameters,
            deprecatedMessage: apiFunction.documentation.deprecatedMessage || [],
            summary: apiFunction.documentation.summary || [],
            remarks: apiFunction.documentation.remarks || [],
            isBeta: apiFunction.documentation.releaseTag === ReleaseTag.Beta
        };

        if (refObject != null) {
            refObject[apiFunction.name] = newNode;
        }
    }
}
