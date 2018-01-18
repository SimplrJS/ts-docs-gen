import { Contracts } from "ts-extractor";
import { ApiTypeBase } from "./api-type-base";
import { GeneratorHelpers } from "../generator-helpers";
import { ApiDefinitions } from "./api-definition-list";
import { ApiTypes } from "./api-type-list";

export abstract class ApiTypeReferenceBase<TKind extends Contracts.ApiReferenceBaseType> extends ApiTypeBase<TKind> {
    private referenceItem: ApiDefinitions | undefined;

    public get ReferenceItem(): ApiDefinitions | undefined {
        if (this.referenceItem == null && this.Data.ReferenceId != null) {
            this.referenceItem = this.GetSerializedApiDefinition(this.Data.ReferenceId);
        }
        return this.referenceItem;
    }

    protected GetTypeParameters(typeParameters: Contracts.ApiType[] | undefined): ApiTypes[] | undefined {
        if (typeParameters == null) {
            return undefined;
        }

        return typeParameters
            .map(x => GeneratorHelpers.SerializeApiType(this.ExtractedData, x))
            .filter((x): x is ApiTypes => x != null);
    }

    protected TypeParametersToString(apiItem: ApiTypes[] | undefined): string {
        if (apiItem == null) {
            return "";
        }

        const members = apiItem
            .map(x => x.ToText().join(" "))
            .join(", ");

        return `<${members}>`;
    }
}
