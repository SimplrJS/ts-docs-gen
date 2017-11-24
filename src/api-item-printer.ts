import { Contracts, ExtractedApiRegistry } from "ts-extractor";

export namespace ApiItemPrinter {
    export function ApiCallToString(apiItem: Contracts.ApiCallDto, itemRegistry: ExtractedApiRegistry): string {
        const parameters: string[] = [];
        const returnType: string = "";

        for (const item of apiItem.Parameters) {
            const [itemName, references] = item;

            const targetApIItem = itemRegistry[references[0]] as Contracts.ApiParameterDto;

            parameters.push(ApiParameterToString(targetApIItem, itemRegistry));
        }

        return `new(${parameters.join(", ")}): ${returnType};`;
    }

    export function ApiParameterToString(apiItem: Contracts.ApiParameterDto, itemRegistry: ExtractedApiRegistry): string {
        const isSpread = IsSpread(apiItem.IsSpread);
        const isOptional = IsOptional(apiItem.IsOptional);
        const type = TypeDtoToString(apiItem.Type);

        return `${isSpread}${apiItem.Name}${isOptional}: ${type}`;
    }

    export function TypeDtoToString(type: Contracts.TypeDto): string {
        return type.Text;
    }

    export function IsSpread(isSpread: boolean): string {
        return isSpread ? "..." : "";
    }

    export function IsOptional(isOptional: boolean): string {
        return isOptional ? "?" : "";
    }
}
