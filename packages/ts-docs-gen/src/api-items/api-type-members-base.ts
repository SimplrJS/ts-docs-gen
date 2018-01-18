import { Contracts, ExtractDto } from "ts-extractor";
import { ApiTypeBase } from "./api-type-base";
import { GeneratorHelpers } from "../generator-helpers";
import { ApiTypes } from "./api-type-list";

export abstract class ApiTypeMembersBase<TKind extends Contracts.ApiMembersBaseType> extends ApiTypeBase<TKind> {
    constructor(extractedData: ExtractDto, apiItem: TKind) {
        super(extractedData, apiItem);

        this.members = this.Data.Members
            .map(x => GeneratorHelpers.SerializeApiType(this.ExtractedData, x))
            .filter((x): x is ApiTypes => x != null);
    }

    private members: ApiTypes[];

    public get Members(): ApiTypes[] {
        return this.members;
    }
}
