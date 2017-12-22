import { ApiSourceFilePlugin } from "./plugins/api-source-file-plugin";
import { ApiVariablePlugin } from "./plugins/api-variable-plugin";
import { ApiEnumPlugin } from "./plugins/api-enum-plugin";
import { ApiFunctionPlugin } from "./plugins/api-function-plugin";
import { ApiTypePlugin } from "./plugins/api-type-plugin";
import { ApiNamespacePlugin } from "./plugins/api-namespace-plugin";

export const DefaultPlugins = [
    new ApiSourceFilePlugin(),
    new ApiVariablePlugin(),
    new ApiEnumPlugin(),
    new ApiFunctionPlugin(),
    new ApiTypePlugin(),
    new ApiNamespacePlugin()
];
