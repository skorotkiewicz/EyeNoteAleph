// import type { UserConfig } from "@unocss/core";
// import presetUno from "@unocss/preset-uno";
import transformerCompileClass from "@unocss/transformer-compile-class";

// @ref https://github.com/unocss/unocss#configurations
// export default <UserConfig>{
//   presets: [],
//   //   presets: [presetUno()],
// };

export default {
  presets: [],
  transformers: [transformerCompileClass()],
  //   presets: [presetUno()],
};
