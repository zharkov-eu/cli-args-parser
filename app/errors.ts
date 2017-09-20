/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Operative Company. All rights reserved.
 *  Licensed under the MIT license. See LICENSE.txt in the project root for license information.
 *  @author Evgeni Zharkov <zharkov.e.u@gmail.>
 *--------------------------------------------------------------------------------------------*/

"use strict";

import {IPropertyDefinition, IPropertyParsed} from "./cli";
import Language from "./gettext";

export class LocalizedError extends Error {
  public static dictionary: Language = new Language();
}

export class PropertyNoExist extends Error {
  constructor(property: IPropertyParsed) {
    super(`${LocalizedError.dictionary.getText("Property {0}{1} not allowed",
      property.Modifier, property.Name)}`);
    Object.setPrototypeOf(this, PropertyNoExist.prototype);
  }
}

export function propertyNoExist(property: IPropertyParsed) {
  throw new PropertyNoExist(property);
}

export class PropertyRequired extends Error {
  constructor(property: IPropertyParsed) {
    super(`${LocalizedError.dictionary.getText("Property {0}{1} is required",
      property.Modifier, property.Name)}`);
    Object.setPrototypeOf(this, PropertyRequired.prototype);
  }
}

export function propertyRequired(property: IPropertyParsed) {
  throw new PropertyRequired(property);
}

export class PropertyDeprecated extends Error {
  constructor(property: IPropertyParsed) {
    super(`${LocalizedError.dictionary.getText("Property {0}{1} is deprecated",
      property.Modifier, property.Name)}`);
    Object.setPrototypeOf(this, PropertyDeprecated.prototype);
  }
}

export function propertyDeprecated(property: IPropertyParsed) {
  throw new PropertyDeprecated(property);
}

export class PropertyValueError extends Error {
  constructor(property: IPropertyDefinition) {
    super(`${LocalizedError.dictionary.getText("Property {0}{1} value not valid. Awaiting type {2}",
      property.Modifier, property.Name, property.Type)}`);
    Object.setPrototypeOf(this, PropertyValueError.prototype);
  }
}

export function propertyValueError(property: IPropertyDefinition) {
  throw new PropertyValueError(property);
}
