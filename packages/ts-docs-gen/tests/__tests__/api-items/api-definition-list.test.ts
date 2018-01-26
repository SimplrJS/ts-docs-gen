import { Contracts } from "ts-extractor";
import { ApiDefinitionList } from "@src/api-items/api-definition-list";

import { CheckLists } from "../test-helpers";

it("Check if all definitions are supported from ts-extractor.", () => {
    const ignoreKinds: Contracts.ApiDefinitionKind[] = [
        Contracts.ApiDefinitionKind.Export,
        Contracts.ApiDefinitionKind.ExportSpecifier,
        Contracts.ApiDefinitionKind.Export,
        Contracts.ApiDefinitionKind.ImportSpecifier
    ];
    const kinds = Object.values(Contracts.ApiDefinitionKind);
    const values = ApiDefinitionList.map(([kind]) => kind);

    const result = CheckLists(kinds, values, ignoreKinds);
    expect(result).toMatchObject([]);
});
