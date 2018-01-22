import { Contracts } from "ts-extractor";
import { ApiDefinitionBase } from "./api-definition-base";
import { GeneratorHelpers } from "../generator-helpers";
import { ApiTypes } from "./api-type-list";

export type ApiBaseItemWithTypeDto = Contracts.ApiBaseItemDto & { Type: Contracts.ApiType };

export abstract class ApiDefinitionWithType<TKind extends ApiBaseItemWithTypeDto = ApiBaseItemWithTypeDto>
    extends ApiDefinitionBase<TKind> {

    private type: ApiTypes;

    public get Type(): ApiTypes {
        if (this.type == null) {
            this.type = GeneratorHelpers.SerializeApiType(this.ExtractedData, this.ApiItem.Type);
        }
        return this.type;
    }
}
