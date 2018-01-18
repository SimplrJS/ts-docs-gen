import { Contracts } from "ts-extractor";
import { ApiTypeBase } from "./api-type-base";
import { GeneratorHelpers } from "../generator-helpers";
import { ApiTypes } from "./api-type-list";

export abstract class ApiTypeMembersBase<TKind extends Contracts.ApiMembersBaseType> extends ApiTypeBase<TKind> {
    private members: ApiTypes[];

    public get Members(): ApiTypes[] {
        if (this.members == null) {
            this.members = this.Data.Members
                .map(x => GeneratorHelpers.SerializeApiType(this.ExtractedData, x))
                .filter((x): x is ApiTypes => x != null);
        }
        return this.members;
    }
}
