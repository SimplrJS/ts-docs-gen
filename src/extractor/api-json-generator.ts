import * as ts from "typescript";
import { ApiJsonGenerator as Generator, Extractor } from "@microsoft/api-extractor";
import ApiParameter from "@microsoft/api-extractor/lib/definitions/ApiParameter";
import ApiFunction from "@microsoft/api-extractor/lib/definitions/ApiFunction";
import { ReleaseTag } from "@microsoft/api-extractor/lib/definitions/ApiDocumentation";
import ApiJsonFile from "@microsoft/api-extractor/lib/generators/ApiJsonFile";
import { IReturn, IParam } from "@microsoft/api-extractor/lib/IDocElement";

import { ApiJson } from "./api-json-contracts";
import { ApiItemKind } from "@microsoft/api-extractor/lib/definitions/ApiItem";
import ApiMethod from "@microsoft/api-extractor/lib/definitions/ApiMethod";
import { AccessModifier } from "@microsoft/api-extractor/lib/definitions/ApiMember";
import ApiProperty from "@microsoft/api-extractor/lib/definitions/ApiProperty";

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

        for (const param of apiFunction.params) {
            if (apiFunction.documentation.parameters[param.name] == null) {
                apiFunction.documentation.parameters[param.name] = {} as any;
            }

            this.visitApiParam(param, apiFunction.documentation.parameters[param.name]);
        }
        const returnValueNode: IReturn = {
            type: apiFunction.returnType,
            description: apiFunction.documentation.returnsMessage
        };

        const newNode: Object = {
            kind: ApiJsonFile.convertKindToJson(apiFunction.kind),
            declarationLine: apiFunction.getDeclarationLine(),
            returnValue: returnValueNode,
            parameters: apiFunction.documentation.parameters,
            deprecatedMessage: apiFunction.documentation.deprecatedMessage || [],
            summary: apiFunction.documentation.summary || [],
            remarks: apiFunction.documentation.remarks || [],
            isBeta: apiFunction.documentation.releaseTag === ReleaseTag.Beta
        };

        if (refObject != null) {
            refObject[apiFunction.name] = newNode;
        }
    }

    protected visitApiMethod(apiMethod: ApiMethod, refObject?: { [key: string]: any }): void {
        if (!apiMethod.supportedName) {
            return;
        }

        for (const param of apiMethod.params) {
            if (apiMethod.documentation.parameters[param.name] == null) {
                apiMethod.documentation.parameters[param.name] = {} as any;
            }

            this.visitApiParam(param, apiMethod.documentation.parameters[param.name]);
        }

        let newNode: Object;
        if (apiMethod.name === "__constructor") {
            newNode = {
                declarationLine: apiMethod.getDeclarationLine(),
                kind: ApiJsonFile.convertKindToJson(ApiItemKind.Constructor),
                signature: apiMethod.getDeclarationLine(),
                parameters: apiMethod.documentation.parameters || {},
                deprecatedMessage: apiMethod.documentation.deprecatedMessage || [],
                summary: apiMethod.documentation.summary || [],
                remarks: apiMethod.documentation.remarks || []
            };
        } else {
            const returnValueNode: IReturn = {
                type: apiMethod.returnType,
                description: apiMethod.documentation.returnsMessage
            };

            newNode = {
                declarationLine: apiMethod.getDeclarationLine(),
                kind: ApiJsonFile.convertKindToJson(apiMethod.kind),
                signature: apiMethod.getDeclarationLine(),
                accessModifier: apiMethod.accessModifier ? AccessModifier[apiMethod.accessModifier].toLowerCase() : "",
                isOptional: !!apiMethod.isOptional,
                isStatic: !!apiMethod.isStatic,
                returnValue: returnValueNode,
                parameters: apiMethod.documentation.parameters,
                deprecatedMessage: apiMethod.documentation.deprecatedMessage || [],
                summary: apiMethod.documentation.summary || [],
                remarks: apiMethod.documentation.remarks || [],
                isBeta: apiMethod.documentation.releaseTag === ReleaseTag.Beta
            };
        }

        if (refObject != null) {
            refObject[apiMethod.name] = newNode;
        }
    }

    protected visitApiProperty(apiProperty: ApiProperty, refObject?: { [key: string]: any }): void {
        if (!apiProperty.supportedName) {
            return;
        }

        if (apiProperty.getDeclaration().kind === ts.SyntaxKind.SetAccessor) {
            return;
        }

        const newNode: Object = {
            kind: ApiJsonFile.convertKindToJson(apiProperty.kind),
            declarationLine: apiProperty.getDeclarationLine(),
            isOptional: !!apiProperty.isOptional,
            isReadOnly: !!apiProperty.isReadOnly,
            isStatic: !!apiProperty.isStatic,
            type: apiProperty.type,
            deprecatedMessage: apiProperty.documentation.deprecatedMessage || [],
            summary: apiProperty.documentation.summary || [],
            remarks: apiProperty.documentation.remarks || [],
            isBeta: apiProperty.documentation.releaseTag === ReleaseTag.Beta
        };

        if (refObject != null) {
            refObject[apiProperty.name] = newNode;
        }
    }
}
