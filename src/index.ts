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
  return map(from).to("right_shift", ["right_command", "right_option", "right_control"]);
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

      map("u").to("left_arrow", "left_command"),
      map("i").to("left_arrow", "left_option"),
      map("o").to("right_arrow", "left_option"),
      map("p").to("right_arrow", "left_command"),
    ]),
  ]);
};

const HyperSelection = () => {
  return rule("Hyper Selection", unlessVoyager).manipulators([
    withModifier(HYPER_KEY)([
      map("h", "left_command").to("left_arrow", "left_shift"),
      map("j", "left_command").to("down_arrow", "left_shift"),
      map("k", "left_command").to("up_arrow", "left_shift"),
      map("l", "left_command").to("right_arrow", "left_shift"),

      map("u", "left_command").to("left_arrow", ["left_command", "left_shift"]),
      map("i", "left_command").to("left_arrow", ["left_option", "left_shift"]),
      map("o", "left_command").to("right_arrow", ["left_option", "left_shift"]),
      map("p", "left_command").to("right_arrow", ["left_command", "left_shift"]),
    ]),
  ]);
};

const HyperDeletion = () => {
  return rule("Hyper Deletion", unlessVoyager).manipulators([
    withModifier(HYPER_KEY)([
      map("n", "left_command").to("delete_or_backspace", "left_command"),
      map("n").to("delete_or_backspace", "left_option"),
      map("m").to("delete_or_backspace"),
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
    withModifier(HYPER_KEY)([
      map("q", "left_command").toApp("Spotify"),
      map("w", "left_command").toApp("Finder"),
      map("e", "left_command").toApp("iTerm"),
      map("r", "left_command").toApp("Linear"),

      map("a", "left_command").toApp("Microsoft Teams (work or school)"),
      map("s", "left_command").toApp("Logseq"),
      map("d", "left_command").toApp("Dash"),
      map("f", "left_command").toApp("Figma"),

      map("x", "left_command").toApp("TypingMind"),
      map("c", "left_command").toApp("Arc"),
      map("v", "left_command").toApp("Visual Studio Code"),
    ]),
  ]);
};

const HyperAppsForVoyager = () => {
  return rule("Hyper Apps: Voyager", isVoyager).manipulators([
    withModifier(HYPER_KEY)([
      map("q").toApp("Spotify"),
      map("w").toApp("Finder"),
      map("e").toApp("iTerm"),
      map("r").toApp("Linear"),

      map("a").toApp("Microsoft Teams (work or school)"),
      map("s").toApp("Logseq"),
      map("f").toApp("Figma"),

      map("x").toApp("TypingMind"),
      map("c").toApp("Arc"),
      map("v").toApp("Visual Studio Code"),
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
  HyperAppDash(),
  HyperFn(),
  HyperMisc(),
]);
