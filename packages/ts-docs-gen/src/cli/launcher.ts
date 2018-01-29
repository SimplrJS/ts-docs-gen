#!/usr/bin/env node

import { ArgsHandler, CliArguments } from "./arguments";
import { Logger } from "../utils/logger";
import { GeneratorConfigurationBuilder } from "../builders/generator-configuration-builder";
import { Plugin } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";
import { Generator } from "../generator";

async function resolvePlugin(pluginName: string): Promise<Plugin[]> {
    const module: { [key: string]: any } = await import(pluginName);
    const result: Plugin[] = [];

    for (const [, value] of Object.values(module)) {
        if (GeneratorHelpers.IsPluginClass(value)) {
            result.push(new value());
        }
    }

    return result;
}

// TODO: Add logging.
(async (args: CliArguments) => {
    const builder = new GeneratorConfigurationBuilder(args.project);

    // Plugins
    if (args.plugin != null) {
        for (const pluginName of args.plugin) {
            try {
                const plugins = await resolvePlugin(pluginName);
                builder.AddPlugins(plugins);
            } catch (error) {
                Logger.Error("An error has occured while processing plugins.", error);
            }
        }
    }

    // Output
    if (args.output != null) {
        builder.SetOutputDirectory(args.output);
    }

    const generator = new Generator(await builder.Build(args.entryFile));
    await generator.WriteToFiles();
})(ArgsHandler);
