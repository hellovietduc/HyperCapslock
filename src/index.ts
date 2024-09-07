import {
  FromKeyParam,
  FromModifierParam,
  ifApp,
  ifDevice,
  map,
  rule,
  withModifier,
  writeToProfile,
} from "karabiner.ts";

const isVoyager = ifDevice({ vendor_id: 12951, product_id: 6519 });
const unlessVoyager = isVoyager.unless();
const isDash = ifApp("^com\\.kapeli\\.dash-setapp$");

const HYPER_KEY: FromModifierParam = ["right_shift", "right_command", "right_option", "right_control"];

const createHyperKey = (from: FromKeyParam) => {
  // Any modifier combined with the Hyper key won't trigger the Hyper key's original action
  return map(from, null, "any").to("right_shift", ["right_command", "right_option", "right_control"]);
};

const HyperCapslock = () => {
  return rule("Hyper CapsLock").manipulators([
    // CapsLock is Hyper
    createHyperKey("caps_lock").toIfAlone("escape", undefined, { lazy: true }),

    // CapsLock + Escape to enable CapsLock
    map("escape", HYPER_KEY, "caps_lock").to("caps_lock", "left_control"),
  ]);
};

const HyperNavigation = () => {
  return rule("Hyper Navigation", unlessVoyager).manipulators([
    withModifier(HYPER_KEY)([
      map("h").to("left_arrow"),
      map("j").to("down_arrow"),
      map("k").to("up_arrow"),
      map("l").to("right_arrow"),

      map("y").to("left_arrow", "left_command"),
      map("u").to("left_arrow", "left_option"),
      map("i").to("right_arrow", "left_option"),
      map("o").to("right_arrow", "left_command"),
    ]),
  ]);
};

const HyperSelection = () => {
  return rule("Hyper Selection", unlessVoyager).manipulators([
    withModifier(["left_command", ...HYPER_KEY])([
      map("h").to("left_arrow", "left_shift"),
      map("j").to("down_arrow", "left_shift"),
      map("k").to("up_arrow", "left_shift"),
      map("l").to("right_arrow", "left_shift"),

      map("y").to("left_arrow", ["left_command", "left_shift"]),
      map("u").to("left_arrow", ["left_option", "left_shift"]),
      map("i").to("right_arrow", ["left_option", "left_shift"]),
      map("o").to("right_arrow", ["left_command", "left_shift"]),
    ]),
  ]);
};

const HyperDeletion = () => {
  return rule("Hyper Deletion", unlessVoyager).manipulators([
    withModifier(["left_command", ...HYPER_KEY])([
      map("n").to("delete_or_backspace", "left_command"),
      //
    ]),
    withModifier(HYPER_KEY)([
      map("n").to("delete_or_backspace", "left_option"),
      map("m").to("delete_or_backspace"),
      //
    ]),
  ]);
};

const HyperSymbols = () => {
  return rule("Hyper Symbols", unlessVoyager).manipulators([
    withModifier(HYPER_KEY)([
      /* ` */ map("q").to("`"),
      /* _ */ map("w").to("-", "left_shift"),
      /* - */ map("e").to("-"),
      /* = */ map("r").to("="),
      /* + */ map("t").to("=", "left_shift"),

      /* { */ map("a").to("[", "left_shift"),
      /* } */ map("s").to("]", "left_shift"),
      /* ( */ map("d").to(9, "left_shift"),
      /* ) */ map("f").to(0, "left_shift"),

      /* [ */ map("c").to("["),
      /* ] */ map("v").to("]"),
    ]),
  ]);
};

const HyperApps = () => {
  return rule("Hyper Apps", unlessVoyager).manipulators([
    withModifier(["left_command", ...HYPER_KEY])([
      map("q").toApp("Spotify"),
      map("w").toApp("Finder"),
      map("e").toApp("WezTerm"),
      map("r").toApp("Linear"),
      map("t").toApp("Front"),

      map("a").toApp("Microsoft Teams (work or school)"),
      map("s").toApp("Obsidian"),
      map("d").toApp("Dash"),
      map("f").toApp("Figma"),

      map("x").toApp("TypingMind"),
      map("c").toApp("Arc"),
      map("v").toApp("Neovide"),
    ]),
  ]);
};

const HyperAppsForVoyager = () => {
  return rule("Hyper Apps: Voyager", isVoyager).manipulators([
    withModifier(HYPER_KEY)([
      map("q").toApp("Spotify"),
      map("w").toApp("Finder"),
      map("e").toApp("WezTerm"),
      map("r").toApp("Linear"),
      map("t").toApp("Front"),

      map("a").toApp("Microsoft Teams (work or school)"),
      map("s").toApp("Obsidian"),
      map("d").to("spacebar", ["left_option"]), // Dash
      map("f").toApp("Figma"),

      map("x").toApp("TypingMind"),
      map("c").toApp("Arc"),
      map("v").toApp("Neovide"),
    ]),
  ]);
};

const HyperRectangleForVoyager = () => {
  return rule("Hyper Rectangle: Voyager", isVoyager).manipulators([
    withModifier(HYPER_KEY)([
      /* left half   */ map("h").to("left_arrow", ["left_control", "left_option"]),
      /* center half */ map("j").to("down_arrow", ["left_control", "left_option"]),
      /* max height  */ map("k").to("up_arrow", ["left_control", "left_option"]),
      /* right half  */ map("l").to("right_arrow", ["left_control", "left_option"]),

      /* maximize    */ map("return_or_enter").to("return_or_enter", ["left_control", "left_option"]),
      /* restore     */ map("delete_or_backspace").to("delete_or_backspace", ["left_control", "left_option"]),

      /* left space  */ map("y").to("left_arrow", ["left_control"]),
      /* right space */ map("o").to("right_arrow", ["left_control"]),
    ]),
  ]);
};

const HyperAppDash = () => {
  return rule("Hyper App: Dash", isDash).manipulators([
    map("j", "left_shift").to("page_down"),
    map("k", "left_shift").to("page_up"),
    map("j", ["left_command", "left_shift"]).to("down_arrow", "left_option"),
    map("k", ["left_command", "left_shift"]).to("up_arrow", "left_option"),
  ]);
};

const HyperFn = () => {
  return rule("Hyper Fn", unlessVoyager).manipulators([
    withModifier(HYPER_KEY)([
      map("1").to("display_brightness_decrement"),
      map("2").to("display_brightness_increment"),

      map("7").to("rewind"),
      map("8").to("play_or_pause"),
      map("9").to("fastforward"),

      map("0").to("mute"),
      map("-").to("volume_decrement"),
      map("=").to("volume_increment"),

      map("spacebar").to("z", "left_option"), // change input language
    ]),
  ]);
};

const HyperMisc = () => {
  const SYS_HYPER_KEY: FromModifierParam = ["left_command", "left_option", "left_shift", "left_control"];
  return rule("Hyper Misc").manipulators([
    // disable system diagnostic shortcuts
    map("period", SYS_HYPER_KEY).to("f17"),
    map("comma", SYS_HYPER_KEY).to("f18"),
    map("w", SYS_HYPER_KEY).to("f19"),
  ]);
};

writeToProfile("Default", [
  HyperCapslock(),
  HyperNavigation(),
  HyperSelection(),
  HyperDeletion(),
  HyperSymbols(),
  HyperApps(),
  HyperAppsForVoyager(),
  HyperRectangleForVoyager(),
  HyperAppDash(),
  HyperFn(),
  HyperMisc(),
]);
