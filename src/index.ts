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
      // Focus window
      map("h").to$(`${aerospace} focus --boundaries-action stop left`),
      map("j").to$(`${aerospace} focus --boundaries-action stop down`),
      map("k").to$(`${aerospace} focus --boundaries-action stop up`),
      map("l").to$(`${aerospace} focus --boundaries-action stop right`),

      // Focus workspace
      map("left_arrow").to$(`${aerospace} workspace prev`),
      map("right_arrow").to$(`${aerospace} workspace next`),

      // Maximize a window
      map("return_or_enter").to$(`${aerospace} fullscreen`),

      // Toggle layout mode
      map("delete_or_backspace").to$(`${aerospace} layout accordion tiles`),

      // Rotate
      map("r").to$(`${aerospace} layout horizontal vertical`),
    ]),

    withModifier(["right_control", "right_option", "right_shift"])([
      // Move window within workspace
      map("y").to$(`${aerospace} move left`),
      map("u").to$(`${aerospace} move down`),
      map("i").to$(`${aerospace} move up`),
      map("o").to$(`${aerospace} move right`),

      // Join window within workspace
      map("e").to$(`${aerospace} join-with up`),
      map("d").to$(`${aerospace} join-with down`),
      map("s").to$(`${aerospace} join-with left`),
      map("f").to$(`${aerospace} join-with right`),

      // Move window to other workspaces
      map("left_arrow").to$(`${aerospace} move-node-to-workspace prev | ${aerospace} workspace prev`),
      map("right_arrow").to$(`${aerospace} move-node-to-workspace next | ${aerospace} workspace next`),

      // Move window to other desktops
      map("a").to$(`${aerospace} move-node-to-monitor prev`),
      map("g").to$(`${aerospace} move-node-to-monitor next`),

      // Resize window
      map("b").to$(`${aerospace} balance-sizes`),
      map("n").to$(`${aerospace} resize smart -50`),
      map("m").to$(`${aerospace} resize smart +50`),

      map("6").to$(`${aerospace} flatten-workspace-tree`),
    ]),

    withModifier(HYPER_KEY)([
      // Move to specific workspace
      map("1").to$(`${aerospace} workspace 1`),
      map("2").to$(`${aerospace} workspace 2`),
      map("3").to$(`${aerospace} workspace 3`),
      map("4").to$(`${aerospace} workspace 4`),
      map("5").to$(`${aerospace} workspace 5`),
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
