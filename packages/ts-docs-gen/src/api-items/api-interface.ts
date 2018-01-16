import { Contracts } from "ts-extractor";
import { ApiBase } from "./api-base";
import { GeneratorHelpers } from "../generator-helpers";

export class ApiInterface extends ApiBase<Contracts.ApiInterfaceDto> {
    public ToStringArray(alias?: string | undefined): string[] {
        const name = alias || this.Data.Name;

        // TypeParameters
        const typeParameters: string = this.TypeParametersToString(this.Data);

        // Extends
        let extendsString: string;
        if (this.Data.Extends != null && this.Data.Extends.length > 0) {
            const typesList = this.Data.Extends
                .map(x => GeneratorHelpers.ApiTypeToString(this.ExtractedData, x));

            extendsString = ` extends ${typesList.join(", ")}`;
        } else {
            extendsString = "";
        }


        return [
            `interface ${name}${typeParameters}${extendsString}`
        ];
    }

    public ToSimpleString(alias?: string | undefined): string {
        return alias || this.Data.Name;
    }
}
