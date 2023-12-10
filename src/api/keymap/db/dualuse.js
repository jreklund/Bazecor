/* bazecor-keymap -- Bazecor keymap library
 * Copyright (C) 2019  Keyboardio, Inc.
 * Copyright (C) 2019  DygmaLab SE
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { withModifiers } from "./utils";

import LetterTable from "./letters";
import DigitTable from "./digits";
import PunctuationTable from "./punctuation";
import SpacingTable from "./spacing";
import NavigationTable from "./navigation";
import FunctionKeyTable from "./fxs";
import NumpadTable from "./numpad";
import MiscellaneousTable from "./miscellaneous";

const DualUseModifierBase = 49169;

const DualUseModifierTables = [
  withModifiers(LetterTable, "Left Control /", "LCTL/", DualUseModifierBase),
  withModifiers(DigitTable, "Left Control /", "LCTL/", DualUseModifierBase),
  withModifiers(PunctuationTable, "Left Control /", "LCTL/", DualUseModifierBase),
  withModifiers(SpacingTable, "Left Control /", "LCTL/", DualUseModifierBase),
  withModifiers(NavigationTable, "Left Control /", "LCTL/", DualUseModifierBase),
  withModifiers(FunctionKeyTable, "Left Control /", "LCTL/", DualUseModifierBase),
  withModifiers(NumpadTable, "Left Control /", "LCTL/", DualUseModifierBase),
  withModifiers(MiscellaneousTable, "Left Control /", "LCTL/", DualUseModifierBase),

  withModifiers(LetterTable, "Left Shift /", "LSFT/", DualUseModifierBase + 256),
  withModifiers(DigitTable, "Left Shift /", "LSFT/", DualUseModifierBase + 256),
  withModifiers(PunctuationTable, "Left Shift /", "LSFT/", DualUseModifierBase + 256),
  withModifiers(SpacingTable, "Left Shift /", "LSFT/", DualUseModifierBase + 256),
  withModifiers(NavigationTable, "Left Shift /", "LSFT/", DualUseModifierBase + 256),
  withModifiers(FunctionKeyTable, "Left Shift /", "LSFT/", DualUseModifierBase + 256),
  withModifiers(NumpadTable, "Left Shift /", "LSFT/", DualUseModifierBase + 256),
  withModifiers(MiscellaneousTable, "Left Shift /", "LSFT/", DualUseModifierBase + 256),

  withModifiers(LetterTable, "Left Alt /", "LALT/", DualUseModifierBase + 512),
  withModifiers(DigitTable, "Left Alt /", "LALT/", DualUseModifierBase + 512),
  withModifiers(PunctuationTable, "Left Alt /", "LALT/", DualUseModifierBase + 512),
  withModifiers(SpacingTable, "Left Alt /", "LALT/", DualUseModifierBase + 512),
  withModifiers(NavigationTable, "Left Alt /", "LALT/", DualUseModifierBase + 512),
  withModifiers(FunctionKeyTable, "Left Alt /", "LALT/", DualUseModifierBase + 512),
  withModifiers(NumpadTable, "Left Alt /", "LALT/", DualUseModifierBase + 512),
  withModifiers(MiscellaneousTable, "Left Alt /", "LALT/", DualUseModifierBase + 512),

  withModifiers(LetterTable, "Left GUI /", "LGUI/", DualUseModifierBase + 768),
  withModifiers(DigitTable, "Left GUI /", "LGUI/", DualUseModifierBase + 768),
  withModifiers(PunctuationTable, "Left GUI /", "LGUI/", DualUseModifierBase + 768),
  withModifiers(SpacingTable, "Left GUI /", "LGUI/", DualUseModifierBase + 768),
  withModifiers(NavigationTable, "Left GUI /", "LGUI/", DualUseModifierBase + 768),
  withModifiers(FunctionKeyTable, "Left GUI /", "LGUI/", DualUseModifierBase + 768),
  withModifiers(NumpadTable, "Left GUI /", "LGUI/", DualUseModifierBase + 768),
  withModifiers(MiscellaneousTable, "Left GUI /", "LGUI/", DualUseModifierBase + 768),

  withModifiers(LetterTable, "Right Control /", "RCTL/", DualUseModifierBase + 1024),
  withModifiers(DigitTable, "Right Control /", "RCTL/", DualUseModifierBase + 1024),
  withModifiers(PunctuationTable, "Right Control /", "RCTL/", DualUseModifierBase + 1024),
  withModifiers(SpacingTable, "Right Control /", "RCTL/", DualUseModifierBase + 1024),
  withModifiers(NavigationTable, "Right Control /", "RCTL/", DualUseModifierBase + 1024),
  withModifiers(FunctionKeyTable, "Right Control /", "RCTL/", DualUseModifierBase + 1024),
  withModifiers(NumpadTable, "Right Control /", "RCTL/", DualUseModifierBase + 1024),
  withModifiers(MiscellaneousTable, "Right Control /", "RCTL/", DualUseModifierBase + 1024),

  withModifiers(LetterTable, "Right Shift /", "RSFT/", DualUseModifierBase + 1280),
  withModifiers(DigitTable, "Right Shift /", "RSFT/", DualUseModifierBase + 1280),
  withModifiers(PunctuationTable, "Right Shift /", "RSFT/", DualUseModifierBase + 1280),
  withModifiers(SpacingTable, "Right Shift /", "RSFT/", DualUseModifierBase + 1280),
  withModifiers(NavigationTable, "Right Shift /", "RSFT/", DualUseModifierBase + 1280),
  withModifiers(FunctionKeyTable, "Right Shift /", "RSFT/", DualUseModifierBase + 1280),
  withModifiers(NumpadTable, "Right Shift /", "RSFT/", DualUseModifierBase + 1280),
  withModifiers(MiscellaneousTable, "Right Shift /", "RSFT/", DualUseModifierBase + 1280),

  withModifiers(LetterTable, "Right Alt /", "RALT/", DualUseModifierBase + 1536),
  withModifiers(DigitTable, "Right Alt /", "RALT/", DualUseModifierBase + 1536),
  withModifiers(PunctuationTable, "Right Alt /", "RALT/", DualUseModifierBase + 1536),
  withModifiers(SpacingTable, "Right Alt /", "RALT/", DualUseModifierBase + 1536),
  withModifiers(NavigationTable, "Right Alt /", "RALT/", DualUseModifierBase + 1536),
  withModifiers(FunctionKeyTable, "Right Alt /", "RALT/", DualUseModifierBase + 1536),
  withModifiers(NumpadTable, "Right Alt /", "RALT/", DualUseModifierBase + 1536),
  withModifiers(MiscellaneousTable, "Right Alt /", "RALT/", DualUseModifierBase + 1536),

  withModifiers(LetterTable, "Right GUI /", "RGUI/", DualUseModifierBase + 1792),
  withModifiers(DigitTable, "Right GUI /", "RGUI/", DualUseModifierBase + 1792),
  withModifiers(PunctuationTable, "Right GUI /", "RGUI/", DualUseModifierBase + 1792),
  withModifiers(SpacingTable, "Right GUI /", "RGUI/", DualUseModifierBase + 1792),
  withModifiers(NavigationTable, "Right GUI /", "RGUI/", DualUseModifierBase + 1792),
  withModifiers(FunctionKeyTable, "Right GUI /", "RGUI/", DualUseModifierBase + 1792),
  withModifiers(NumpadTable, "Right GUI /", "RGUI/", DualUseModifierBase + 1792),
  withModifiers(MiscellaneousTable, "Right GUI /", "RGUI/", DualUseModifierBase + 1792),
];

const DualUseLayerTables = [
  withModifiers(LetterTable, "Layer #1 /", "L#1/", 51218),
  withModifiers(DigitTable, "Layer #1 /", "L#1/", 51218),
  withModifiers(PunctuationTable, "Layer #1 /", "L#1/", 51218),
  withModifiers(SpacingTable, "Layer #1 /", "L#1/", 51218),
  withModifiers(NavigationTable, "Layer #1 /", "L#1/", 51218),
  withModifiers(FunctionKeyTable, "Layer #1 /", "L#1/", 51218),
  withModifiers(NumpadTable, "Layer #1 /", "L#1/", 51218),
  withModifiers(MiscellaneousTable, "Layer #1 /", "L#1/", 51218),

  withModifiers(LetterTable, "Layer #2 /", "L#2/", 51474),
  withModifiers(DigitTable, "Layer #2 /", "L#2/", 51474),
  withModifiers(PunctuationTable, "Layer #2 /", "L#2/", 51474),
  withModifiers(SpacingTable, "Layer #2 /", "L#2/", 51474),
  withModifiers(NavigationTable, "Layer #2 /", "L#2/", 51474),
  withModifiers(FunctionKeyTable, "Layer #2 /", "L#2/", 51474),
  withModifiers(NumpadTable, "Layer #2 /", "L#2/", 51474),
  withModifiers(MiscellaneousTable, "Layer #2 /", "L#2/", 51474),

  withModifiers(LetterTable, "Layer #3 /", "L#3/", 51730),
  withModifiers(DigitTable, "Layer #3 /", "L#3/", 51730),
  withModifiers(PunctuationTable, "Layer #3 /", "L#3/", 51730),
  withModifiers(SpacingTable, "Layer #3 /", "L#3/", 51730),
  withModifiers(NavigationTable, "Layer #3 /", "L#3/", 51730),
  withModifiers(FunctionKeyTable, "Layer #3 /", "L#3/", 51730),
  withModifiers(NumpadTable, "Layer #3 /", "L#3/", 51730),
  withModifiers(MiscellaneousTable, "Layer #3 /", "L#3/", 51730),

  withModifiers(LetterTable, "Layer #4 /", "L#4/", 51986),
  withModifiers(DigitTable, "Layer #4 /", "L#4/", 51986),
  withModifiers(PunctuationTable, "Layer #4 /", "L#4/", 51986),
  withModifiers(SpacingTable, "Layer #4 /", "L#4/", 51986),
  withModifiers(NavigationTable, "Layer #4 /", "L#4/", 51986),
  withModifiers(FunctionKeyTable, "Layer #4 /", "L#4/", 51986),
  withModifiers(NumpadTable, "Layer #4 /", "L#4/", 51986),
  withModifiers(MiscellaneousTable, "Layer #4 /", "L#4/", 51986),

  withModifiers(LetterTable, "Layer #5 /", "L#5/", 52242),
  withModifiers(DigitTable, "Layer #5 /", "L#5/", 52242),
  withModifiers(PunctuationTable, "Layer #5 /", "L#5/", 52242),
  withModifiers(SpacingTable, "Layer #5 /", "L#5/", 52242),
  withModifiers(NavigationTable, "Layer #5 /", "L#5/", 52242),
  withModifiers(FunctionKeyTable, "Layer #5 /", "L#5/", 52242),
  withModifiers(NumpadTable, "Layer #5 /", "L#5/", 52242),
  withModifiers(MiscellaneousTable, "Layer #5 /", "L#5/", 52242),

  withModifiers(LetterTable, "Layer #6 /", "L#6/", 52498),
  withModifiers(DigitTable, "Layer #6 /", "L#6/", 52498),
  withModifiers(PunctuationTable, "Layer #6 /", "L#6/", 52498),
  withModifiers(SpacingTable, "Layer #6 /", "L#6/", 52498),
  withModifiers(NavigationTable, "Layer #6 /", "L#6/", 52498),
  withModifiers(FunctionKeyTable, "Layer #6 /", "L#6/", 52498),
  withModifiers(NumpadTable, "Layer #6 /", "L#6/", 52498),
  withModifiers(MiscellaneousTable, "Layer #6 /", "L#6/", 52498),

  withModifiers(LetterTable, "Layer #7 /", "L#7/", 52754),
  withModifiers(DigitTable, "Layer #7 /", "L#7/", 52754),
  withModifiers(PunctuationTable, "Layer #7 /", "L#7/", 52754),
  withModifiers(SpacingTable, "Layer #7 /", "L#7/", 52754),
  withModifiers(NavigationTable, "Layer #7 /", "L#7/", 52754),
  withModifiers(FunctionKeyTable, "Layer #7 /", "L#7/", 52754),
  withModifiers(NumpadTable, "Layer #7 /", "L#7/", 52754),
  withModifiers(MiscellaneousTable, "Layer #7 /", "L#7/", 52754),

  withModifiers(LetterTable, "Layer #8 /", "L#8/", 53010),
  withModifiers(DigitTable, "Layer #8 /", "L#8/", 53010),
  withModifiers(PunctuationTable, "Layer #8 /", "L#8/", 53010),
  withModifiers(SpacingTable, "Layer #8 /", "L#8/", 53010),
  withModifiers(NavigationTable, "Layer #8 /", "L#8/", 53010),
  withModifiers(FunctionKeyTable, "Layer #8 /", "L#8/", 53010),
  withModifiers(NumpadTable, "Layer #8 /", "L#8/", 53010),
  withModifiers(MiscellaneousTable, "Layer #8 /", "L#8/", 53010),
];

export { DualUseModifierTables, DualUseLayerTables };
