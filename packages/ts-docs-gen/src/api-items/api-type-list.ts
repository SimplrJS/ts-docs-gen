import { Contracts } from "ts-extractor";
import { SerializedApiTypeConstructor } from "../contracts/serialized-api-item";

import { ApiTypeDefault } from "./api-type-default";
// ApiType
import { ApiTypeBasic } from "./types/api-type-basic";
import { ApiTypeReference } from "./types/api-type-reference";
import { ApiTypeUnionOrIntersection } from "./types/api-type-union-or-intersection";
import { ApiTypeArray } from "./types/api-type-array";
import { ApiTypeTuple } from "./types/api-type-tuple";
import { ApiTypeDefinition } from "./types/api-type-definition";
import { ApiTypePredicate } from "./types/api-type-predicate";
import { ApiTypeOperator } from "./types/api-type-operator";
import { ApiIndexedAccess } from "./types/api-type-indexed-access";
import { ApiTypeParenthesized } from "./types/api-type-parenthesized";
import { ApiTypeQuery } from "./types/api-type-query";

export type ApiTypes = ApiTypeDefault |
    ApiTypeBasic |
    ApiTypeReference |
    ApiTypeUnionOrIntersection |
    ApiTypeArray |
    ApiTypeTuple |
    ApiTypeDefinition |
    ApiTypePredicate |
    ApiTypeOperator |
    ApiIndexedAccess |
    ApiTypeParenthesized |
    ApiTypeQuery;

export const ApiTypeList: Array<[Contracts.ApiTypeKind, SerializedApiTypeConstructor<any>]> = [
    [Contracts.ApiTypeKind.Basic, ApiTypeBasic],
    [Contracts.ApiTypeKind.Reference, ApiTypeReference],
    [Contracts.ApiTypeKind.Union, ApiTypeUnionOrIntersection],
    [Contracts.ApiTypeKind.Intersection, ApiTypeUnionOrIntersection],
    [Contracts.ApiTypeKind.Array, ApiTypeArray],
    [Contracts.ApiTypeKind.Tuple, ApiTypeTuple],
    [Contracts.ApiTypeKind.TypeLiteral, ApiTypeDefinition],
    [Contracts.ApiTypeKind.Mapped, ApiTypeDefinition],
    [Contracts.ApiTypeKind.FunctionType, ApiTypeDefinition],
    [Contracts.ApiTypeKind.This, ApiTypeDefinition],
    [Contracts.ApiTypeKind.Constructor, ApiTypeDefinition],
    [Contracts.ApiTypeKind.TypePredicate, ApiTypePredicate],
    [Contracts.ApiTypeKind.TypeOperator, ApiTypeOperator],
    [Contracts.ApiTypeKind.IndexedAccess, ApiIndexedAccess],
    [Contracts.ApiTypeKind.Parenthesized, ApiTypeParenthesized],
    [Contracts.ApiTypeKind.TypeQuery, ApiTypeQuery]
];
