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
      map("e").toApp("WezTerm"),
      map("r").toApp("Linear"),
      map("t").toApp("Front"),

      map("a").toApp("Microsoft Teams (work or school)"),
      map("s").toApp("Logseq"),
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
      map("s").toApp("Logseq"),
      map("f").toApp("Figma"),

      map("x").toApp("TypingMind"),
      map("c").toApp("Arc"),
      map("v").toApp("Neovide"),
    ]),
  ]);
};

const HyperAerospace = () => {
  const aerospace = "/opt/homebrew/bin/aerospace";
  return rule("Hyper Aerospace", unlessVoyager).manipulators([
    map("return_or_enter", ["command", "control"]).to$(`${aerospace} fullscreen`),
  ]);
};

const HyperAerospaceForVoyager = () => {
  const aerospace = "/opt/homebrew/bin/aerospace";
  return rule("Hyper Aerospace: Voyager", isVoyager).manipulators([
    withModifier(["right_control", "right_option"])([
      // Focus workspace
      map("left_arrow").to$(`${aerospace} workspace prev`),
      map("right_arrow").to$(`${aerospace} workspace next`),
      map("1").to$(`${aerospace} workspace 1`),
      map("2").to$(`${aerospace} workspace 2`),
      map("3").to$(`${aerospace} workspace 3`),
      map("4").to$(`${aerospace} workspace 4`),
      map("5").to$(`${aerospace} workspace 5`),
      map("6").to$(`${aerospace} workspace 6`),
      map("7").to$(`${aerospace} workspace 7`),
      map("8").to$(`${aerospace} workspace 8`),
      map("9").to$(`${aerospace} workspace 9`),

      // Move window within workspace
      map("h").to$(`${aerospace} layout tiling | ${aerospace} move left`),
      map("l").to$(`${aerospace} layout tiling | ${aerospace} move right`),
      map("j").to$(`${aerospace} layout tiling | ${aerospace} move down`),
      map("k").to$(`${aerospace} layout tiling | ${aerospace} move up`),

      // Maximize a window
      map("return_or_enter").to$(`${aerospace} layout tiling | ${aerospace} fullscreen`),
    ]),

    withModifier(["right_control", "right_option", "right_shift"])([
      // Move window to other workspaces
      map("left_arrow").to$(`${aerospace} move-node-to-workspace prev | ${aerospace} workspace prev`),
      map("right_arrow").to$(`${aerospace} move-node-to-workspace next | ${aerospace} workspace next`),

      // Resize window
      map("n").to$(`${aerospace} resize smart -50`),
      map("m").to$(`${aerospace} resize smart +50`),

      // Reset
      map("r").to$(`${aerospace} flatten-workspace-tree | ${aerospace} balance-sizes`),
      map("f").to$(`${aerospace} layout floating`),
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
  HyperAerospace(),
  HyperAerospaceForVoyager(),
  HyperAppDash(),
  HyperFn(),
  HyperMisc(),
]);
