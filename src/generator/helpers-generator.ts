import * as json2md from "json2md";

export namespace HelpersGenerator {
    export function RenderExtends(what: string): json2md.DataObject[] {
        return [
            {
                p: `${Bold("Extends")} ${InlineCode(what)}`
            }
        ];
    }

    export function RenderImplements(what: string): json2md.DataObject[] {
        return [
            {
                p: `${Bold("Implements")} ${InlineCode(what)}`
            }
        ];
    }

    export function Bold(text: string): string {
        return `__${text}__`;
    }

    export function InlineCode(text?: string): string {
        if (text == null) {
            return "";
        }
        return `\`${text}\``;
    }
}
