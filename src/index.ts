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

      map("u").to("left_arrow", "left_command"),
      map("i").to("left_arrow", "left_option"),
      map("o").to("right_arrow", "left_option"),
      map("p").to("right_arrow", "left_command"),
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

      map("u").to("left_arrow", ["left_command", "left_shift"]),
      map("i").to("left_arrow", ["left_option", "left_shift"]),
      map("o").to("right_arrow", ["left_option", "left_shift"]),
      map("p").to("right_arrow", ["left_command", "left_shift"]),
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
      map("e").toApp("iTerm"),
      map("r").toApp("Linear"),
      map("t").toApp("Front"),

      map("a").toApp("Microsoft Teams (work or school)"),
      map("s").toApp("Logseq"),
      map("d").toApp("Dash"),
      map("f").toApp("Figma"),

      map("x").toApp("TypingMind"),
      map("c").toApp("Arc"),
      map("v").toApp("Visual Studio Code"),
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
      map("t").toApp("Front"),

      map("a").toApp("Microsoft Teams (work or school)"),
      map("s").toApp("Logseq"),
      map("f").toApp("Figma"),

      map("x").toApp("TypingMind"),
      map("c").toApp("Arc"),
      map("v").toApp("Visual Studio Code"),
    ]),
  ]);
};

const HyperYabai = () => {
  const yabai = "/opt/homebrew/bin/yabai";
  return rule("Hyper Yabai", unlessVoyager).manipulators([
    map("return_or_enter", ["command", "shift"]).to$(`${yabai} -m window --toggle zoom-fullscreen`),
  ]);
};

const HyperYabaiForVoyager = () => {
  const yabai = "/opt/homebrew/bin/yabai";
  return rule("Hyper Yabai: Voyager", isVoyager).manipulators([
    withModifier(["right_control", "right_option"])([
      // Focus window
      map("h").to$(`${yabai} -m window --focus west`),
      map("j").to$(`${yabai} -m window --focus south`),
      map("k").to$(`${yabai} -m window --focus north`),
      map("l").to$(`${yabai} -m window --focus east`),

      // Focus space
      // Handled by Mission Control
      // map("left_arrow").to$(`${yabai} -m space --focus prev`),
      // map("right_arrow").to$(`${yabai} -m space --focus next`),

      // Focus desktop
      map("u").to$(`${yabai} -m display --focus prev`),
      map("i").to$(`${yabai} -m display --focus next`),

      // Maximize a window
      map("return_or_enter").to$(`${yabai} -m window --toggle zoom-fullscreen`),

      // Toggle float
      map("delete_or_backspace").to$(`${yabai} -m window --toggle float --grid 1:3:1:0:1:1`),

      // Balance out tree of windows (resize to occupy same area)
      map("b").to$(`${yabai} -m space --balance`),

      // Toggle split and rebalance
      map("n").to$(`${yabai} -m window --toggle split && ${yabai} -m space --balance`),

      // Restart yabai
      map("6").to$(`${yabai} --restart-service`),
    ]),

    withModifier(["right_control", "right_option", "right_shift"])([
      // Move window within space
      map("e").to$(`${yabai} -m window --swap north`),
      map("d").to$(`${yabai} -m window --swap south`),
      map("s").to$(`${yabai} -m window --swap west`),
      map("f").to$(`${yabai} -m window --swap east`),

      // Move window to other spaces
      map("left_arrow").to$(`${yabai} -m window --space prev --focus`),
      map("right_arrow").to$(`${yabai} -m window --space next --focus`),

      // Move window to other desktops
      map("w").to$(`${yabai} -m window --display prev --focus`),
      map("r").to$(`${yabai} -m window --display next --focus`),
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
  HyperYabai(),
  HyperYabaiForVoyager(),
  HyperAppDash(),
  HyperFn(),
  HyperMisc(),
]);
