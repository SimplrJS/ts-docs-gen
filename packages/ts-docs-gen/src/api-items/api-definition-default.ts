import { Contracts } from "ts-extractor";
import { ApiDefinitionBase } from "./api-definition-base";

export class ApiDefinitionDefault<TKind extends Contracts.ApiBaseItemDto = Contracts.ApiBaseItemDto> extends ApiDefinitionBase<TKind> {
    public ToText(): string[] {
        return [this.Name];
    }

    public ToHeadingText(): string {
        const name = this.Name;
        return `${this.ApiItem.ApiKind}: ${name}`;
    }
}
