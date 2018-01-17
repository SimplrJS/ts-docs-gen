import { Contracts } from "ts-extractor";
import { SerializedApiType, SerializedApiDefinition } from "../contracts/serialized-api-item";
import { BaseApiItemClass } from "../abstractions/base-api-item";
import { GeneratorHelpers } from "../generator-helpers";

export abstract class ApiTypeBase<TKind extends Contracts.ApiBaseType> extends BaseApiItemClass<TKind> implements SerializedApiType<TKind> {
    protected GetSerializedApiDefinition(referenceId?: string): SerializedApiDefinition<Contracts.ApiItemDto> | undefined {
        if (referenceId == null) {
            return undefined;
        }

        const apiItem = this.ExtractedData.Registry[referenceId];
        return GeneratorHelpers.SerializeApiDefinition(this.ExtractedData, apiItem, { Alias: "", Id: referenceId });
    }

    protected SerializedTypeToString(apiType: SerializedApiType | undefined): string {
        if (apiType == null) {
            return "???";
        }

        return apiType.ToText().join(" ");
    }
}
