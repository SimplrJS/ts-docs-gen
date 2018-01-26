import { Contracts } from "ts-extractor";
import { SerializedApiDefinitionConstructor } from "../contracts/serialized-api-item";

import { ApiDefinitionDefault } from "./api-definition-default";
// ApiItems
import { ApiSourceFile } from "./definitions/api-source-file";
import { ApiCall } from "./definitions/api-call";
import { ApiClass } from "./definitions/api-class";
import { ApiConstruct } from "./definitions/api-construct";
import { ApiEnum } from "./definitions/api-enum";
import { ApiEnumMember } from "./definitions/api-enum-member";
import { ApiFunction } from "./definitions/api-function";
import { ApiFunctionExpression } from "./definitions/api-function-expression";
import { ApiIndex } from "./definitions/api-index";
import { ApiInterface } from "./definitions/api-interface";
import { ApiMapped } from "./definitions/api-mapped";
import { ApiMethod } from "./definitions/api-method";
import { ApiNamespace } from "./definitions/api-namespace";
import { ApiParameter } from "./definitions/api-parameter";
import { ApiProperty } from "./definitions/api-property";
import { ApiTypeAlias } from "./definitions/api-type-alias";
import { ApiTypeParameter } from "./definitions/api-type-parameter";
import { ApiVariable } from "./definitions/api-variable";
import { ApiTypeLiteral } from "./definitions/api-type-literal";
import { ApiClassConstructor } from "./definitions/api-class-constructor";
import { ApiClassProperty } from "./definitions/api-class-property";
import { ApiClassMethod } from "./definitions/api-class-method";
import { ApiAccessor } from "./definitions/api-accessor";

export type ApiDefinitions = ApiDefinitionDefault |
    ApiSourceFile |
    ApiEnum |
    ApiEnumMember |
    ApiFunction |
    ApiInterface |
    ApiMethod |
    ApiNamespace |
    ApiParameter |
    ApiProperty |
    ApiVariable |
    ApiTypeAlias |
    ApiClass |
    ApiClassConstructor |
    ApiClassProperty |
    ApiClassMethod |
    ApiAccessor |
    ApiAccessor |
    ApiIndex |
    ApiCall |
    ApiConstruct |
    ApiTypeParameter |
    ApiTypeLiteral |
    ApiFunctionExpression |
    ApiMapped;

// TODO: Add tests from Contracts.ApiDefinitionKind
// TODO: Fix any.
export const ApiDefinitionList: Array<[Contracts.ApiDefinitionKind, SerializedApiDefinitionConstructor<any>]> = [
    [Contracts.ApiDefinitionKind.SourceFile, ApiSourceFile],
    [Contracts.ApiDefinitionKind.Enum, ApiEnum],
    [Contracts.ApiDefinitionKind.EnumMember, ApiEnumMember],
    [Contracts.ApiDefinitionKind.Function, ApiFunction],
    [Contracts.ApiDefinitionKind.Interface, ApiInterface],
    [Contracts.ApiDefinitionKind.Method, ApiMethod],
    [Contracts.ApiDefinitionKind.Namespace, ApiNamespace],
    [Contracts.ApiDefinitionKind.ImportNamespace, ApiNamespace],
    [Contracts.ApiDefinitionKind.Parameter, ApiParameter],
    [Contracts.ApiDefinitionKind.Property, ApiProperty],
    [Contracts.ApiDefinitionKind.Variable, ApiVariable],
    [Contracts.ApiDefinitionKind.TypeAlias, ApiTypeAlias],
    [Contracts.ApiDefinitionKind.Class, ApiClass],
    [Contracts.ApiDefinitionKind.ClassConstructor, ApiClassConstructor],
    [Contracts.ApiDefinitionKind.ClassProperty, ApiClassProperty],
    [Contracts.ApiDefinitionKind.ClassMethod, ApiClassMethod],
    [Contracts.ApiDefinitionKind.GetAccessor, ApiAccessor],
    [Contracts.ApiDefinitionKind.SetAccessor, ApiAccessor],
    [Contracts.ApiDefinitionKind.Index, ApiIndex],
    [Contracts.ApiDefinitionKind.Call, ApiCall],
    [Contracts.ApiDefinitionKind.Construct, ApiConstruct],
    [Contracts.ApiDefinitionKind.ConstructorType, ApiConstruct],
    [Contracts.ApiDefinitionKind.TypeParameter, ApiTypeParameter],
    [Contracts.ApiDefinitionKind.TypeLiteral, ApiTypeLiteral],
    [Contracts.ApiDefinitionKind.ObjectLiteral, ApiTypeLiteral],
    [Contracts.ApiDefinitionKind.FunctionType, ApiFunctionExpression],
    [Contracts.ApiDefinitionKind.ArrowFunction, ApiFunctionExpression],
    [Contracts.ApiDefinitionKind.FunctionExpression, ApiFunctionExpression],
    [Contracts.ApiDefinitionKind.Mapped, ApiMapped]
];
