import { Contracts } from "ts-extractor";
import { ApiDefinitionBase } from "./api-definition-base";

export class ApiDefinitionDefault extends ApiDefinitionBase<Contracts.ApiItemDto> {
    public ToText(alias?: string | undefined): string[] {
        return [alias || this.Data.Name];
    }
    public ToHeadingText(alias?: string | undefined): string {
        return alias || this.Data.Name;
    }
}
