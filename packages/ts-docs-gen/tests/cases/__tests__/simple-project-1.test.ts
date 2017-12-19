import { Generator } from "@src/generator";
import { GeneratorConfigurationBuilder } from "@src/builders/generator-configuration-builder";

test("index", async done => {
    const projectDirectory = "D:/Projects/ts-docs-gen/packages/ts-docs-gen/tests/cases/simple-project-1";
    const entryFiles  = ["./index.ts"];

    try {
        const configuration = await new GeneratorConfigurationBuilder(projectDirectory)
            .Build(entryFiles);

        const generator = new Generator(configuration);

        expect(generator.OutputData).toMatchSnapshot();
        done();
    } catch (error) {
        done.fail(error);
    }
});
