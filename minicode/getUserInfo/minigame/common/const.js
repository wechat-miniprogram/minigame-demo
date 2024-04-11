export var Platform;
(function (Platform) {
    Platform["devtools"] = "devtools";
    Platform["android"] = "android";
    Platform["ios"] = "ios";
    Platform["windows"] = "windows";
    Platform["mac"] = "mac";
})(Platform || (Platform = {}));
export var DeviceOrientation;
(function (DeviceOrientation) {
    DeviceOrientation["portrait"] = "portrait";
    DeviceOrientation["landscape"] = "landscape";
    DeviceOrientation["landscapeLeft"] = "landscapeLeft";
    DeviceOrientation["landscapeRight"] = "landscapeRight";
})(DeviceOrientation || (DeviceOrientation = {}));
export var EnvType;
(function (EnvType) {
    EnvType["DEVELOP"] = "develop";
    EnvType["TRIAL"] = "trial";
    EnvType["RELEASE"] = "release";
})(EnvType || (EnvType = {}));
export var AppStateType;
(function (AppStateType) {
    AppStateType[AppStateType["release"] = 1] = "release";
    AppStateType[AppStateType["develop"] = 2] = "develop";
    AppStateType[AppStateType["trial"] = 3] = "trial";
})(AppStateType || (AppStateType = {}));
