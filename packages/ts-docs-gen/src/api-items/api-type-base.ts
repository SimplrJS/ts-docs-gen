import { Contracts } from "ts-extractor";
import { SerializedApiType } from "../contracts/serialized-api-item";
import { BaseApiItemClass } from "../abstractions/base-api-item";

export abstract class ApiTypeBase<TKind extends Contracts.ApiBaseType> extends BaseApiItemClass<TKind> implements SerializedApiType<TKind> {

}
