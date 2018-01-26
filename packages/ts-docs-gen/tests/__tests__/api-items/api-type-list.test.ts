import { Contracts } from "ts-extractor";
import { ApiTypeList } from "@src/api-items/api-type-list";

import { CheckLists } from "../test-helpers";

it("Check if all types are supported from ts-extractor.", () => {
    const ignoreKinds: Contracts.ApiTypeKind[] = [];
    const kinds = Object.values(Contracts.ApiTypeKind);
    const values = ApiTypeList.map(([kind]) => kind);

    const result = CheckLists(kinds, values, ignoreKinds);
    expect(result).toMatchObject([]);
});
