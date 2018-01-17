import { Contracts, ExtractDto } from "ts-extractor";
import { ApiTypeBase } from "./api-type-base";
import { GeneratorHelpers } from "../generator-helpers";
import { SerializedApiType } from "../contracts/serialized-api-item";

export abstract class ApiTypeMembersBase<TKind extends Contracts.ApiMembersBaseType> extends ApiTypeBase<TKind> {
    constructor(extractedData: ExtractDto, apiItem: TKind) {
        super(extractedData, apiItem);

        this.members = this.Data.Members
            .map(x => GeneratorHelpers.SerializeApiType(this.ExtractedData, x))
            .filter((x): x is SerializedApiType => x != null);
    }

    private members: SerializedApiType[];

    public get Members(): SerializedApiType[] {
        return this.members;
    }
}
