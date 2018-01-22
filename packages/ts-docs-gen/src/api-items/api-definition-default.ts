import { Contracts } from "ts-extractor";
import { ApiDefinitionBase } from "./api-definition-base";
import { ReferenceRenderHandler } from "../contracts/serialized-api-item";

export class ApiDefinitionDefault<TKind extends Contracts.ApiBaseItemDto = Contracts.ApiBaseItemDto> extends ApiDefinitionBase<TKind> {
    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer): string[] {
        return [this.Name];
    }

    public ToHeadingText(): string {
        const name = this.Name;
        return `${this.ApiItem.ApiKind}: ${name}`;
    }
}
