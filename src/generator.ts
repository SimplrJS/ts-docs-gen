import { Extractor, ExtractDto } from "ts-extractor";
import { GeneratorOptions } from "./contracts/generator-options";

export class Generator {
    constructor(options: GeneratorOptions) {
        this.extractor = new Extractor(options.ExtractorOptions);
    }

    private extractor: Extractor;

    public Generate(files: string[], targetPath: string): void {
        const extractedData: ExtractDto = this.extractor.Extract(files);

    }
}
