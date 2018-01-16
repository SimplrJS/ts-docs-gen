import { Contracts } from "ts-extractor";
import { ApiBase } from "./api-base";
import { GeneratorHelpers } from "../generator-helpers";

export class ApiClass extends ApiBase<Contracts.ApiClassDto> {
    public ToText(alias?: string | undefined): string[] {
        const name = alias || this.Data.Name;

        // Abstract
        const abstract = this.Data.IsAbstract ? "abstract " : "";

        // TypeParameters
        const typeParameters: string = this.TypeParametersToString(this.Data);

        // Extends
        let extendsString: string;
        if (this.Data.Extends != null) {
            const type = GeneratorHelpers.ApiTypeToString(this.ExtractedData, this.Data.Extends);
            extendsString = ` extends ${type}`;
        } else {
            extendsString = "";
        }

        // Implements
        let implementsString: string;
        if (this.Data.Implements != null && this.Data.Implements.length > 0) {
            const typesList = this.Data.Implements
                .map(x => GeneratorHelpers.ApiTypeToString(this.ExtractedData, x));

            implementsString = ` implements ${typesList.join(", ")}`;
        } else {
            implementsString = "";
        }

        return [
            `${abstract}class ${name}${typeParameters}${extendsString}${implementsString}`
        ];
    }

    public ToHeadingText(alias?: string | undefined): string {
        return alias || this.Data.Name;
    }
}
