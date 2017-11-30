import { Contracts } from "ts-extractor";

export enum ApiItemKindsAdditional {
    Any = "any"
}

export type SupportedApiItemKindType = Contracts.ApiItemKinds | ApiItemKindsAdditional;
