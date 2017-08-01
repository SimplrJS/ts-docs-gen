import * as path from "path";
import { APIExtractor } from "../src/extractor/api-extractor";
import { GetCompilerOptions } from "../src/extractor/tsconfig-handler";

const ENTRY_POINT_1 = path.join(__dirname, "./assets/example-1/index.ts");

it("Generate JSON", async done => {
    try {
        const compilerOptions = await GetCompilerOptions(path.resolve(__dirname, "./assets/example-1/tsconfig.example.json"));
        const extractor = new APIExtractor(compilerOptions);
        extractor.Analyze(ENTRY_POINT_1, []);
        const json = extractor.GetJSON();

        expect(json).toBeDefined();
    } catch (error) {
        done.fail(error);
        return;
    }

    done();
});
