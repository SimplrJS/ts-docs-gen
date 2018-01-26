import { Contracts } from "ts-extractor";
import { ApiDefinitionBase } from "./api-definition-base";
import { ApiDefinitions } from "./api-definition-list";
import { GeneratorHelpers } from "../generator-helpers";
import { ApiItemReference } from "../contracts/api-item-reference";
import { ReferenceRenderHandler } from "../contracts/serialized-api-item";
import { Helpers } from "../utils/helpers";

export type ApiBaseItemContainerDto = Contracts.ApiBaseDefinition & { Members: Contracts.ApiItemReference[] };

export abstract class ApiDefinitionContainer<TKind extends ApiBaseItemContainerDto = ApiBaseItemContainerDto>
    extends ApiDefinitionBase<TKind> {

    private members: ApiDefinitions[];

    public get Members(): ApiDefinitions[] {
        if (this.members == null) {
            this.members = GeneratorHelpers
                .GetApiItemReferences(this.ExtractedData, this.ApiItem.Members)
                .map<[ApiItemReference, Contracts.ApiDefinition]>(x => [x, this.ExtractedData.Registry[x.Id]])
                .map(([reference, apiItem]) => GeneratorHelpers.SerializeApiDefinition(this.ExtractedData, apiItem, reference));
        }
        return this.members;
    }

    protected MembersToText(render: ReferenceRenderHandler, members: ApiDefinitions[], tab: number = 0): string[] {
        return Helpers.Flatten(
            members.map(x => x.ToText(render).map(y => `${GeneratorHelpers.Tab(tab)}${y}`))
        );
    }
}
