import { ApiVariablePlugin } from "./plugins/api-variable-plugin";
import { ApiEnumPlugin } from "./plugins/api-enum-plugin";

export const DefaultPlugins = [
    new ApiVariablePlugin(),
    new ApiEnumPlugin()
];
