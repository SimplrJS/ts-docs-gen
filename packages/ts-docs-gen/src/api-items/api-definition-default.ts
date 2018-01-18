import { Contracts } from "ts-extractor";
import { ApiDefinitionBase } from "./api-definition-base";

export class ApiDefinitionDefault<TKind extends Contracts.ApiBaseItemDto = Contracts.ApiBaseItemDto> extends ApiDefinitionBase<TKind> {
    public ToText(): string[] {
        return [this.Reference.Alias || this.Data.Name];
    }

    public ToHeadingText(): string {
        const name = this.Reference.Alias || this.Data.Name;
        return `${this.Data.ApiKind}: ${name}`;
    }
}
