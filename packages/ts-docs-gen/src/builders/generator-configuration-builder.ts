import * as ts from "typescript";
import * as path from "path";
import * as fs from "fs-extra";
import { Extractor, GetCompilerOptions, Contracts } from "ts-extractor";
import { ApiHelpers } from "ts-extractor/dist/internal";

import { GeneratorConfiguration, WorkingGeneratorConfiguration } from "../contracts/generator-configuration";
import { Plugin } from "../contracts/plugin";

import { PluginRegistry } from "../registries/plugin-registry";
import { DefaultPlugins } from "../default-plugins";
import { GeneratorHelpers } from "../generator-helpers";
import { LoggerHelpers } from "../utils/logger";

export class GeneratorConfigurationBuilder {
    constructor(private projectDirectory: string) {
        this.configuration.projectDirectory = projectDirectory;
    }

    private configuration: Partial<WorkingGeneratorConfiguration> = {
        excludePrivateApi: true
    };
    private compilerOptions: Partial<ts.CompilerOptions> | undefined;
    private tsConfigLocation: string | undefined;

    private resolveProjectDirectory(): string {
        return this.configuration.projectDirectory || this.projectDirectory;
    }

    private extractorFilterApiItem: Contracts.FilterApiItemsHandler = (apiItem): boolean => {
        // Exclude private api.
        if (this.configuration.excludePrivateApi) {
            // Check Access Modifier.
            const accessModifier = ApiHelpers.ResolveAccessModifierFromModifiers(apiItem.Declaration.modifiers);
            if (accessModifier === Contracts.AccessModifier.Private) {
                return false;
            }

            // Look for JSDocTag "@private"
            const metadata = apiItem.GetItemMetadata();
            if (metadata.JSDocTags.findIndex(x => x.name === GeneratorHelpers.JSDocTags.Private) !== -1) {
                return false;
            }
        }
        return true;
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

    public SetExternalPackages(packages: string[]): this {
        this.configuration.externalPackage = packages;

        return this;
    }

    public SetOutputDirectory(outputDirectory: string): this {
        this.configuration.outputDirectory = outputDirectory;

        return this;
    }

    public AddPlugins(plugins: Plugin[]): this {
        const currentPlugins = this.configuration.plugins || [];
        this.configuration.plugins = [...plugins, ...currentPlugins];

        return this;
    }

    public async Build(entryFiles: string[]): Promise<GeneratorConfiguration> {
        // Verbosity level.
        if (this.configuration.verbosity != null) {
            LoggerHelpers.SetLogLevel(this.configuration.verbosity);
        }

        // Register all plugins.
        const pluginManager = new PluginRegistry();
        // Register default plugins
        for (const item of DefaultPlugins) {
            pluginManager.Register(item);
        }

        if (this.configuration.plugins != null) {
            // Registering given plugins.
            for (const plugin of this.configuration.plugins) {
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
            Exclude: this.configuration.exclude,
            OutputPathSeparator: this.configuration.outputPathSeparator,
            ExternalPackages: this.configuration.externalPackage,
            FilterApiItems: this.extractorFilterApiItem,
            Verbosity: this.configuration.verbosity
        });

        const extractedData = extractor.Extract(entryFiles);
        // extractorOutput
        if (this.configuration.extractorOutput) {
            await fs.writeJson(this.configuration.extractorOutput, extractedData, { spaces: 4 });
        }

        // Output directory
        const outputDirectory = this.configuration.outputDirectory || path.join(this.resolveProjectDirectory(), "/docs/");

        return {
            PluginManager: pluginManager,
            ExtractedData: extractedData,
            OutputDirectory: outputDirectory
        };
    }
}
