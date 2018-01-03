import { ApiSourceFilePlugin } from "./plugins/api-source-file-plugin";
import { ApiVariablePlugin } from "./plugins/api-variable-plugin";
import { ApiEnumPlugin } from "./plugins/api-enum-plugin";
import { ApiFunctionPlugin } from "./plugins/api-function-plugin";
import { ApiTypePlugin } from "./plugins/api-type-plugin";
import { ApiNamespacePlugin } from "./plugins/api-namespace-plugin";
import { ApiInterfacePlugin } from "./plugins/api-interface-plugin";
import { ApiCallablePlugin } from "./plugins/api-callable-plugin";
import { ApiIndexPlugin } from "./plugins/api-index-plugin";
import { ApiClassPlugin } from "./plugins/api-class-plugin";
import { ApiClassConstructorPlugin } from "./plugins/api-class-constructor-plugin";
import { ApiClassMethodPlugin } from "./plugins/api-class-method-plugin";
import { ApiClassPropertyPlugin } from "./plugins/api-class-property-plugin";
import { ApiClassAccessorPlugin } from "./plugins/api-class-accessor-plugin";

export const DefaultPlugins = [
    new ApiSourceFilePlugin(),
    new ApiVariablePlugin(),
    new ApiEnumPlugin(),
    new ApiFunctionPlugin(),
    new ApiTypePlugin(),
    new ApiNamespacePlugin(),
    new ApiInterfacePlugin(),
    new ApiCallablePlugin(),
    new ApiIndexPlugin(),
    new ApiClassPlugin(),
    new ApiClassConstructorPlugin(),
    new ApiClassMethodPlugin(),
    new ApiClassPropertyPlugin(),
    new ApiClassAccessorPlugin()
];
