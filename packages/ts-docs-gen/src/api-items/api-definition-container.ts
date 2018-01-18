import { Contracts, ExtractDto } from "ts-extractor";
import { ApiDefinitionBase } from "./api-definition-base";
import { ApiItemReference } from "../contracts/api-item-reference";
import { ApiDefinitions } from "./api-definition-list";

export type ApiBaseItemContainerDto = Contracts.ApiBaseItemDto & { Members: Contracts.ApiItemReference[] };

export abstract class ApiDefinitionContainer<TKind extends ApiBaseItemContainerDto = ApiBaseItemContainerDto>
    extends ApiDefinitionBase<TKind> {
    constructor(extractedData: ExtractDto, apiItem: TKind, reference: ApiItemReference) {
        super(extractedData, apiItem, reference);

        this.members = this.GetMembers(this.Data.Members);
    }

    private members: ApiDefinitions[];

    public get Members(): ApiDefinitions[] {
        return this.members;
    }
}
