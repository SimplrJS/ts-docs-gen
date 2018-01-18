import { Contracts } from "ts-extractor";
import { ApiDefinitionBase } from "./api-definition-base";
import { ApiDefinitions } from "./api-definition-list";

export type ApiBaseItemContainerDto = Contracts.ApiBaseItemDto & { Members: Contracts.ApiItemReference[] };

export abstract class ApiDefinitionContainer<TKind extends ApiBaseItemContainerDto = ApiBaseItemContainerDto>
    extends ApiDefinitionBase<TKind> {

    private members: ApiDefinitions[];

    public get Members(): ApiDefinitions[] {
        if (this.members == null) {
            this.members = this.GetMembers(this.Data.Members);
        }
        return this.members;
    }
}
