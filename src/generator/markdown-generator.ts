import * as json2md from "json2md";

import { ApiJson } from "../extractor/api-json-contracts";

export class MarkdownGenerator {
    constructor(protected Json: ApiJson) {
        console.log(JSON.stringify(this.Json));
    }
}
