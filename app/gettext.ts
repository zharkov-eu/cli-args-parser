/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Operative Company. All rights reserved.
 *  Licensed under the MIT license. See LICENSE.txt in the project root for license information.
 *  @author Evgeni Zharkov <zharkov.e.u@gmail.com>
 *--------------------------------------------------------------------------------------------*/

"use strict";

import * as fs from "fs";

export default class Language {
  public static loadDictionary(filepath: string): {[index: string]: string} {
    return JSON.parse(fs.readFileSync(filepath).toString());
  }

  private static format(text: string): string {
    const args = Array.prototype.slice.call(arguments, 1);
    return text.replace(/{(\d+)}/g, (match: string, count: number) => {
      return typeof args[count] !== "undefined" ? args[count] : match;
    });
  }

  private dictionary: {[index: string]: string};

  constructor(dictionary?: {[index: string]: string}) {
    this.dictionary = dictionary;
  }

  public getText(text: string, ...args): string {
    return this.dictionary[text] ? Language.format(this.dictionary[text], ...args) : Language.format(text, ...args);
  }
}
