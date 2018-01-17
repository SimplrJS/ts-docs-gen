import { Contracts } from "ts-extractor";

// ApiItems
import { ApiCall } from "./api-call";
import { ApiClass } from "./api-class";
import { ApiConstruct } from "./api-construct";
import { ApiEnum } from "./api-enum";
import { ApiEnumMember } from "./api-enum-member";
import { ApiFunction } from "./api-function";
import { ApiFunctionType } from "./api-function-type";
import { ApiIndex } from "./api-index";
import { ApiInterface } from "./api-interface";
import { ApiMapped } from "./api-mapped";
import { ApiMethod } from "./api-method";
import { ApiNamespace } from "./api-namespace";
import { ApiParameter } from "./api-parameter";
import { ApiProperty } from "./api-property";
import { ApiTypeAlias } from "./api-type-alias";
import { ApiTypeParameter } from "./api-type-parameter";
import { ApiVariable } from "./api-variable";
import { ApiTypeLiteral } from "./api-type-literal";
import { ApiClassConstructor } from "./api-class-constructor";
import { ApiClassProperty } from "./api-class-property";
import { ApiClassMethod } from "./api-class-method";
import { ApiAccessor } from "./api-accessor";

// TODO: Fix any.
export const ApiItemsList: Array<[Contracts.ApiItemKinds, any]> = [
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
