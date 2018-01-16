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

// TODO: Fix any.
export const ApiItemsList: Array<[Contracts.ApiItemKinds, any]> = [
    [Contracts.ApiItemKinds.Call, ApiCall],
    [Contracts.ApiItemKinds.Class, ApiClass],
    [Contracts.ApiItemKinds.Construct, ApiConstruct],
    [Contracts.ApiItemKinds.Enum, ApiEnum],
    [Contracts.ApiItemKinds.EnumMember, ApiEnumMember],
    [Contracts.ApiItemKinds.Function, ApiFunction],
    [Contracts.ApiItemKinds.FunctionType, ApiFunctionType],
    [Contracts.ApiItemKinds.Index, ApiIndex],
    [Contracts.ApiItemKinds.Interface, ApiInterface],
    [Contracts.ApiItemKinds.Mapped, ApiMapped],
    [Contracts.ApiItemKinds.Method, ApiMethod],
    [Contracts.ApiItemKinds.Namespace, ApiNamespace],
    [Contracts.ApiItemKinds.Parameter, ApiParameter],
    [Contracts.ApiItemKinds.Property, ApiProperty],
    [Contracts.ApiItemKinds.TypeAlias, ApiTypeAlias],
    [Contracts.ApiItemKinds.TypeParameter, ApiTypeParameter],
    [Contracts.ApiItemKinds.Variable, ApiVariable]
];
