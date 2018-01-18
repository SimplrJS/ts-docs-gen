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
import { ApiFunctionType } from "./definitions/api-function-type";
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
    ApiFunctionType |
    ApiMapped;

// TODO: Add tests from Contracts.ApiItemKinds
// TODO: Fix any.
export const ApiDefinitionList: Array<[Contracts.ApiItemKinds, SerializedApiDefinitionConstructor<any>]> = [
    [Contracts.ApiItemKinds.SourceFile, ApiSourceFile],
    [Contracts.ApiItemKinds.Enum, ApiEnum],
    [Contracts.ApiItemKinds.EnumMember, ApiEnumMember],
    [Contracts.ApiItemKinds.Function, ApiFunction],
    [Contracts.ApiItemKinds.Interface, ApiInterface],
    [Contracts.ApiItemKinds.Method, ApiMethod],
    [Contracts.ApiItemKinds.Namespace, ApiNamespace],
    [Contracts.ApiItemKinds.Parameter, ApiParameter],
    [Contracts.ApiItemKinds.Property, ApiProperty],
    [Contracts.ApiItemKinds.Variable, ApiVariable],
    [Contracts.ApiItemKinds.TypeAlias, ApiTypeAlias],
    [Contracts.ApiItemKinds.Class, ApiClass],
    [Contracts.ApiItemKinds.ClassConstructor, ApiClassConstructor],
    [Contracts.ApiItemKinds.ClassProperty, ApiClassProperty],
    [Contracts.ApiItemKinds.ClassMethod, ApiClassMethod],
    [Contracts.ApiItemKinds.GetAccessor, ApiAccessor],
    [Contracts.ApiItemKinds.SetAccessor, ApiAccessor],
    [Contracts.ApiItemKinds.Index, ApiIndex],
    [Contracts.ApiItemKinds.Call, ApiCall],
    [Contracts.ApiItemKinds.Construct, ApiConstruct],
    [Contracts.ApiItemKinds.TypeParameter, ApiTypeParameter],
    [Contracts.ApiItemKinds.TypeLiteral, ApiTypeLiteral],
    [Contracts.ApiItemKinds.FunctionType, ApiFunctionType],
    [Contracts.ApiItemKinds.Mapped, ApiMapped]
];
