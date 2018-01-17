import { Contracts, ExtractDto } from "ts-extractor";
import { ApiDefinitionBase } from "./api-definition-base";
import { ApiItemReference } from "../contracts/api-item-reference";
import { SerializedApiDefinition } from "../contracts/serialized-api-item";

export type ApiBaseItemContainerDto = Contracts.ApiBaseItemDto & { Members: Contracts.ApiItemReference[] };

export abstract class ApiDefinitionContainer<TKind extends ApiBaseItemContainerDto = ApiBaseItemContainerDto>
    extends ApiDefinitionBase<TKind> {
    constructor(extractedData: ExtractDto, apiItem: TKind, reference: ApiItemReference) {
        super(extractedData, apiItem, reference);

        this.members = this.GetMembers(this.Data.Members);
    }

    private members: Array<SerializedApiDefinition<Contracts.ApiItemDto>>;

    public get Members(): Array<SerializedApiDefinition<Contracts.ApiItemDto>> {
        return this.members;
    }
}
