/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Operative Company. All rights reserved.
 *  Licensed under the MIT license. See LICENSE.txt in the project root for license information.
 *  @author Evgeni Zharkov <zharkov.e.u@gmail.com>
 *--------------------------------------------------------------------------------------------*/

"use strict";

export const type = {
  array: (text: string): any[] => {
    return JSON.parse(text);
  },
  boolean: (text: string): boolean => {
    if (text !== "true" && text !== "false") {
      throw new Error();
    }
    return (text === "true");
  },
  float: (text: string): number => {
    if (isNaN(parseFloat(text))) {
      throw new Error();
    }
    return parseFloat(text);
  },
  integer: (text: string): number => {
    if (isNaN(parseInt(text, 10))) {
      throw new Error();
    }
    return parseInt(text, 10);
  },
  object: (text: string): any => {
    return JSON.parse(text);
  },
  string: (text: string): string => {
    return text.toString();
  },
};

