#!/usr/bin/env node
import * as path from "path";

import { ArgsHandler, CliArguments } from "./arguments";
import { Logger } from "../utils/logger";
import { GeneratorConfigurationBuilder } from "../builders/generator-configuration-builder";
import { GeneratorHelpers } from "../generator-helpers";
import { Generator } from "../generator";
import { Helpers } from "../utils/helpers";

// TODO: Add logger
(async ({ _, $0, project, plugin, output, entryFile, ...rest }: CliArguments) => {
    const builder = new GeneratorConfigurationBuilder(project);

    // Plugins
    if (plugin != null) {
        for (const pluginName of plugin) {
            // Resolve module location
            let moduleLocation: string;
            if (Helpers.IsPackageName(pluginName)) {
                moduleLocation = pluginName;
            } else {
                moduleLocation = path.resolve(process.cwd(), pluginName);
            }

            try {
                const plugins = await GeneratorHelpers.ResolvePlugin(moduleLocation);
                builder.AddPlugins(plugins);
            } catch (error) {
                Logger.Error(`An error has occured while processing plugins. Resolved location:"${moduleLocation}".`, error);
            }
        }
    }

    // Output
    if (output != null) {
        builder.SetOutputDirectory(output);
    }

    // Set rest of configuration
    builder.OverrideConfiguration(rest);

    const generator = new Generator(await builder.Build(entryFile));
    await generator.WriteToFiles();
})(ArgsHandler);
