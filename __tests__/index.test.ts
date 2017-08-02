import * as path from "path";
import * as sinon from "sinon";
import * as fs from "mz/fs";
import { APIExtractor } from "../src/extractor/api-extractor";
import { GetCompilerOptions } from "../src/extractor/tsconfig-handler";
import { MarkdownGenerator } from "../src/generator/markdown-generator";

const ENTRY_POINT_1 = path.join(__dirname, "./assets/example-1/index.ts");

it("Generate JSON", async done => {
    try {
        const stubCallback = sinon.stub();
        const compilerOptions = await GetCompilerOptions(path.resolve(__dirname, "./assets/example-1/tsconfig.example.json"));
        const extractor = new APIExtractor(compilerOptions, stubCallback);
        extractor.Analyze(ENTRY_POINT_1, []);
        const json = extractor.GetJSON();

        expect(json).toBeDefined();
        expect(stubCallback.called).toBe(false);
    } catch (error) {
        done.fail(error);
        return;
    }

    done();
});

it("Generating MD", async done => {
    try {
        const compilerOptions = await GetCompilerOptions(path.resolve(__dirname, "./assets/example-1/tsconfig.example.json"));
        const extractor = new APIExtractor(compilerOptions);
        extractor.Analyze(ENTRY_POINT_1, []);
        const json = extractor.GetJSON();

        const markdownGenerator = new MarkdownGenerator(json);
        const md: string = markdownGenerator.Render();

        expect(typeof md).toBe("string");

        await fs.writeFile(path.join(__dirname, "./test.md"), md, "utf8");
    } catch (error) {
        done.fail(error);
        return;
    }

    done();
});
