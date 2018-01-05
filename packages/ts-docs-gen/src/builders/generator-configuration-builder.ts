import * as ts from "typescript";
import * as path from "path";
import { Extractor, GetCompilerOptions } from "ts-extractor";

import { GeneratorConfiguration, WorkingGeneratorConfiguration } from "../contracts/generator-configuration";
import { Plugin } from "../contracts/plugin";

import { PluginRegistry } from "../registries/plugin-registry";
import { DefaultPlugins } from "../default-plugins";

// TODO: Add method to read compiler options from tsconfig.
export class GeneratorConfigurationBuilder {
    constructor(private projectDirectory: string) { }

    private configuration: Partial<WorkingGeneratorConfiguration> = {};
    private compilerOptions: Partial<ts.CompilerOptions>;

    public OverrideCompilerOptions(compilerOptions: Partial<ts.CompilerOptions>): this {
        this.compilerOptions = {
            ...this.compilerOptions,
            ...compilerOptions
        };

        return this;
    }

    /**
     * Override configuration with new configuration object.
     *
     * @param configuration Partial configuration object.
     */
    public OverrideConfiguration(configuration: Partial<WorkingGeneratorConfiguration>): this {
        this.configuration = {
            ...this.configuration,
            ...configuration
        };

        return this;
    }

    public SetOutputDirectory(outputDirectory: string): this {
        this.configuration.OutputDirectory = outputDirectory;

        return this;
    }

    public AddPlugins(plugins: Plugin[]): this {
        const currentPlugins = this.configuration.Plugins || [];
        this.configuration.Plugins = [...plugins, ...currentPlugins];

        return this;
    }

    public async Build(entryFiles: string[]): Promise<GeneratorConfiguration> {
        // Register all plugins.
        const pluginManager = new PluginRegistry();
        // Register default plugins
        for (const item of DefaultPlugins) {
            pluginManager.Register(item);
        }

        if (this.configuration.Plugins != null) {
            // TODO: Register default plugins.
            // Registering given plugins.
            for (const plugin of this.configuration.Plugins) {
                pluginManager.Register(plugin);
            }

        }

        // Resolve tsconfig
        let compilerOptions = this.compilerOptions;
        if (compilerOptions == null) {
            compilerOptions = await GetCompilerOptions(path.join(this.projectDirectory, "tsconfig.json"));
        }

        // Extractor
        const extractor = new Extractor({
            CompilerOptions: compilerOptions,
            ProjectDirectory: this.projectDirectory
        });

        const outputDirectory = this.configuration.OutputDirectory || path.join(this.projectDirectory, "/docs/");

        return {
            PluginManager: pluginManager,
            ExtractedData: extractor.Extract(entryFiles),
            OutputDirectory: outputDirectory
        };
    }
}
