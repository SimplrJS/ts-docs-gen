import { Contracts } from "ts-extractor";
import { ApiBase } from "./api-base";
import { GeneratorHelpers } from "../generator-helpers";

export class ApiTypeAlias extends ApiBase<Contracts.ApiTypeAliasDto> {
    public ToText(alias?: string): string[] {
        const name = alias || this.Data.Name;
        const typeParameters = this.GetTypeParameters(this.Data);
        const type = GeneratorHelpers.ApiTypeToString(this.ExtractedData, this.Data.Type);

        return [
            `type ${name}${typeParameters} = ${type}`
        ];
    }

    public ToHeadingText(): string {
        return this.Data.Name;
    }
}
