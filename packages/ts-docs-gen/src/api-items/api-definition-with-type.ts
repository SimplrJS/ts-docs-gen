import { Contracts, ExtractDto } from "ts-extractor";
import { ApiDefinitionBase } from "./api-definition-base";
import { ApiItemReference } from "../contracts/api-item-reference";
import { GeneratorHelpers } from "../generator-helpers";
import { ApiTypes } from "./api-type-list";

export type ApiBaseItemWithTypeDto = Contracts.ApiBaseItemDto & { Type: Contracts.ApiType };

export abstract class ApiDefinitionWithType<TKind extends ApiBaseItemWithTypeDto = ApiBaseItemWithTypeDto>
    extends ApiDefinitionBase<TKind> {
    constructor(extractedData: ExtractDto, apiItem: TKind, reference: ApiItemReference) {
        super(extractedData, apiItem, reference);

        this.type = GeneratorHelpers.SerializeApiType(this.ExtractedData, this.Data.Type);
    }

    private type: ApiTypes;

    public get Type(): ApiTypes {
        return this.type;
    }
}
