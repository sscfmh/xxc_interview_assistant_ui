// load model modules
const modelModules = import.meta.glob(["./*.js", "!./index.js"], {
  eager: true,
});
const exportDefault = {};
for (let modelMod of Object.keys(modelModules)) {
  // modelMod = "./commonDetailModel.js"
  exportDefault[
    modelMod.substring(modelMod.lastIndexOf("/") + 1, modelMod.lastIndexOf("."))
  ] = modelModules[modelMod].default;
}
export default {
  ...exportDefault,
};
