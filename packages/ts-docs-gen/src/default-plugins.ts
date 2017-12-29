import { ApiSourceFilePlugin } from "./plugins/api-source-file-plugin";
import { ApiVariablePlugin } from "./plugins/api-variable-plugin";
import { ApiEnumPlugin } from "./plugins/api-enum-plugin";
import { ApiFunctionPlugin } from "./plugins/api-function-plugin";
import { ApiTypePlugin } from "./plugins/api-type-plugin";
import { ApiNamespacePlugin } from "./plugins/api-namespace-plugin";
import { ApiClassPlugin } from "./plugins/api-class-plugin";
import { ApiClassConstructorPlugin } from "./plugins/api-class-constructor-plugin";
import { ApiClassMethodPlugin } from "./plugins/api-class-method-plugin";
import { ApiClassPropertyPlugin } from "./plugins/api-class-property-plugin";

export const DefaultPlugins = [
    new ApiSourceFilePlugin(),
    new ApiVariablePlugin(),
    new ApiEnumPlugin(),
    new ApiFunctionPlugin(),
    new ApiTypePlugin(),
    new ApiNamespacePlugin(),
    new ApiClassPlugin(),
    new ApiClassConstructorPlugin(),
    new ApiClassMethodPlugin(),
    new ApiClassPropertyPlugin()
];
