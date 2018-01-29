#!/usr/bin/env node
import * as path from "path";

import { ArgsHandler, CliArguments } from "./arguments";
import { Logger } from "../utils/logger";
import { GeneratorConfigurationBuilder } from "../builders/generator-configuration-builder";
import { Plugin } from "../contracts/plugin";
import { GeneratorHelpers } from "../generator-helpers";
import { Generator } from "../generator";
import { Helpers } from "../utils/helpers";

/**
 * Resolves plugins from given file.
 * @param file Plugin name or path to plugin.
 */
async function resolvePlugin(file: string): Promise<Plugin[]> {
    const $module: { [key: string]: any } = await import(file);
    const result: Plugin[] = [];

    if ($module == null) {
        return [];
    }

    for (const key in $module) {
        if ($module.hasOwnProperty(key)) {
            const value = $module[key];

            if (GeneratorHelpers.IsPluginClass(value)) {
                result.push(new value());
            }
        }
    }

    return result;
}

// TODO: Add logger
(async (args: CliArguments) => {
    const builder = new GeneratorConfigurationBuilder(args.project);

    // Plugins
    if (args.plugin != null) {
        for (const pluginName of args.plugin) {
            // Resolve module location
            let moduleLocation: string;
            if (Helpers.IsPackageName(pluginName)) {
                moduleLocation = pluginName;
            } else {
                moduleLocation = path.resolve(process.cwd(), pluginName);
            }

            try {
                const plugins = await resolvePlugin(moduleLocation);
                builder.AddPlugins(plugins);
            } catch (error) {
                Logger.Error(`An error has occured while processing plugins. Resolved location:"${moduleLocation}".`, error);
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
