import { Contracts } from "ts-extractor";

import { GeneratorHelpers } from "../../generator-helpers";
import { ApiDefinitionBase } from "../api-definition-base";
import { ApiTypes } from "../api-type-list";
import { ReferenceRenderHandler } from "../../contracts/serialized-api-item";

export class ApiTypeParameter extends ApiDefinitionBase<Contracts.ApiTypeParameterDto> {
    private constraintType: ApiTypes | undefined;

    public get ConstraintType(): ApiTypes | undefined {
        if (this.constraintType == null && this.ApiItem.ConstraintType != null) {
            this.constraintType = GeneratorHelpers.SerializeApiType(this.ExtractedData, this.ApiItem.ConstraintType);
        }
        return this.constraintType;
    }

    private defaultType: ApiTypes | undefined;

    public get DefaultType(): ApiTypes | undefined {
        if (this.defaultType == null && this.ApiItem.DefaultType != null) {
            this.defaultType = GeneratorHelpers.SerializeApiType(this.ExtractedData, this.ApiItem.DefaultType);
        }
        return this.defaultType;
    }

    public ToText(render: ReferenceRenderHandler = this.DefaultReferenceRenderer, mapped?: boolean): string[] {
        const name = this.Name;

        const constraintKeyword = mapped ? "in" : "extends";

        let constraintString: string;
        if (this.ApiItem.ConstraintType != null) {
            const type = this.SerializedTypeToString(render, this.ConstraintType);
            constraintString = ` ${constraintKeyword} ${type}`;
        } else {
            constraintString = "";
        }

        let defaultTypeString: string;
        if (this.ApiItem.DefaultType != null) {
            const type = this.SerializedTypeToString(render, this.DefaultType);
            defaultTypeString = ` = ${type}`;
        } else {
            defaultTypeString = "";
        }

        return [`${name}${constraintString}${defaultTypeString}`];
    }

    public ToHeadingText(): string {
        return this.Name;
    }
}
