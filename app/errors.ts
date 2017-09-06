/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Operative Company. All rights reserved.
 *  Licensed under the MIT license. See LICENSE.txt in the project root for license information.
 *  @author Evgeni Zharkov <zharkov.e.u@gmail.>
 *--------------------------------------------------------------------------------------------*/

"use strict";

import {IProperty} from "./cli";
import {en} from "./gettext";

export class PropertyNoExist extends Error {
  constructor(property: IProperty) {
    super(`${en.getText("Property {0}{1} not allowed", property.Modifier, property.Name)}`);
  }
}

export class PropertyDeprecated extends Error {
  constructor(property: IProperty) {
    super(`${en.getText("Property {0}{1} is deprecated", property.Modifier, property.Name)}`);
  }
}

export class PropertyValueError extends Error {
  constructor(property: IProperty) {
    super(`${en.getText("Property {0}{1} is deprecated", property.Modifier, property.Name)}`);
  }
}
