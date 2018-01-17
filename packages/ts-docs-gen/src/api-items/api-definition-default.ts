import { Contracts } from "ts-extractor";
import { ApiDefinitionBase } from "./api-definition-base";

export class ApiDefinitionDefault extends ApiDefinitionBase<Contracts.ApiItemDto> {
    public ToText(): string[] {
        return [this.Reference.Alias || this.Data.Name];
    }
    public ToHeadingText(): string {
        return this.Reference.Alias || this.Data.Name;
    }
}
