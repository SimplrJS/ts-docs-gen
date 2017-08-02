import * as json2md from "json2md";

export interface Table extends json2md.DefaultConverters.TableInput {
    headers: string[];
    rows: string[][];
}
