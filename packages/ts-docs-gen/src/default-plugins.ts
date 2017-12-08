import { ApiVariablePlugin } from "./plugins/api-variable-plugin";
import { ApiEnumPlugin } from "./plugins/api-enum-plugin";
import { ApiFunctionPlugin } from "./plugins/api-function-plugin";

export const DefaultPlugins = [
    new ApiVariablePlugin(),
    new ApiEnumPlugin(),
    new ApiFunctionPlugin()
];
