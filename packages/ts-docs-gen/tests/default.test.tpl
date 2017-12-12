import { Generator } from "@src/generator";
import { GeneratorConfigurationBuilder } from "@src/builders/generator-configuration-builder";

test("{{caseName}}", async done => {
    const projectDirectory = "{{projectDirectory}}";
    const testConfig = {{{json testConfig}}};
    const entryFiles = testConfig.EntryFiles;

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
