import * as ts from "typescript";
import * as path from "path";
import { Extractor, GetCompilerOptions } from "ts-extractor";

import { GeneratorConfiguration, WorkingGeneratorConfiguration } from "../contracts/generator-configuration";
import { Plugin } from "../contracts/plugin";

import { PluginRegistry } from "../registries/plugin-registry";
import { DefaultPlugins } from "../default-plugins";

export class GeneratorConfigurationBuilder {
    constructor(private projectDirectory: string) {
        this.configuration.ProjectDirectory = projectDirectory;
    }

    private configuration: Partial<WorkingGeneratorConfiguration> = {};
    private compilerOptions: Partial<ts.CompilerOptions>;
    private tsConfigLocation: string | undefined;

    private resolveProjectDirectory(): string {
        return this.configuration.ProjectDirectory || this.projectDirectory;
    }

    /**
     * @param tsconfigLocation Relative `tsconfig.json` location from `projectDirectory`.
     */
    public SetTsConfigLocation(tsconfigLocation: string): this {
        this.tsConfigLocation = tsconfigLocation;

        return this;
    }

    public OverrideCompilerOptions(compilerOptions: Partial<ts.CompilerOptions>): this {
        this.compilerOptions = {
            ...this.compilerOptions,
            ...compilerOptions
        };

        return this;
    }

    /**
     * Override configuration with a new configuration object.
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
            // Registering given plugins.
            for (const plugin of this.configuration.Plugins) {
                pluginManager.Register(plugin);
            }

        }

        // Resolve tsconfig
        let compilerOptions = this.compilerOptions;
        if (compilerOptions == null) {
            const tsconfigLocation = this.tsConfigLocation || path.join(this.resolveProjectDirectory(), "tsconfig.json");
            compilerOptions = await GetCompilerOptions(tsconfigLocation);
        }

        // Extractor
        const extractor = new Extractor({
            CompilerOptions: compilerOptions,
            ProjectDirectory: this.resolveProjectDirectory(),
            Exclude: this.configuration.Exclude,
            OutputPathSeparator: this.configuration.OutputPathSeparator
        });

        const outputDirectory = this.configuration.OutputDirectory || path.join(this.resolveProjectDirectory(), "/docs/");

        return {
            PluginManager: pluginManager,
            ExtractedData: extractor.Extract(entryFiles),
            OutputDirectory: outputDirectory
        };
    }
}
