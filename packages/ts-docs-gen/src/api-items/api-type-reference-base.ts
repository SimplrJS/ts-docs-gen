import { Contracts, ExtractDto } from "ts-extractor";
import { ApiTypeBase } from "./api-type-base";
import { SerializedApiDefinition, SerializedApiType } from "../contracts/serialized-api-item";
import { GeneratorHelpers } from "../generator-helpers";

export abstract class ApiTypeReferenceBase<TKind extends Contracts.ApiReferenceBaseType> extends ApiTypeBase<TKind> {
    constructor(extractedData: ExtractDto, apiItem: TKind) {
        super(extractedData, apiItem);

        this.referenceItem = this.GetSerializedApiDefinition(this.Data.ReferenceId);
    }

    private referenceItem: SerializedApiDefinition<Contracts.ApiItemDto> | undefined;

    public get ReferenceItem(): SerializedApiDefinition<Contracts.ApiItemDto> | undefined {
        return this.referenceItem;
    }

    protected GetTypeParameters(typeParameters: Contracts.ApiType[] | undefined): SerializedApiType[] | undefined {
        if (typeParameters == null) {
            return undefined;
        }

        return typeParameters
            .map(x => GeneratorHelpers.SerializeApiType(this.ExtractedData, x))
            .filter((x): x is SerializedApiType<Contracts.ApiType> => x != null);
    }

    protected TypeParametersToString(apiItem: SerializedApiType[] | undefined): string {
        if (apiItem == null) {
            return "";
        }

        const members = apiItem
            .map(x => x.ToText().join(" "))
            .join(", ");

        return `<${members}>`;
    }
}
