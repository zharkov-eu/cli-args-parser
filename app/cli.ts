/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Operative Company. All rights reserved.
 *  Licensed under the MIT license. See LICENSE.txt in the project root for license information.
 *  @author Evgeni Zharkov <zharkov.e.u@gmail.com>
 *--------------------------------------------------------------------------------------------*/

"use strict";

import * as process from "process";

type TType = "boolean" | "number" | "string" | "array" | "object" | "user";

export interface IProperty {
  Modifier: string; // Модификатор (- | --)
  Name: string; // Название свойства
  RawValue: string; // Значение свойства (до преобразования в тип)
  Value: any; // Значение свойства (после преобразования в тип)
}

interface IPropertyDefinition extends IProperty {
  Deprecated?: boolean; // Вскоре перестанет поддерживаться
  Description?: string; // Описание свойства, используется для вывода справки
  Type: TType; // Тип свойства
  Transform?: (property: IProperty) => any; // Собственная валидация и трансформация свойства
}

class Property implements IProperty {
  public Modifier: string;
  public Name: string;
  public RawValue: string;
  public Value: TType;

  constructor(property: IProperty) {
    this.Modifier = property.Modifier;
    this.Name = property.Name;
    this.RawValue = property.RawValue;
  }
}

interface IArgumentsConstruct {
  name?: string; // Название приложения, используется для вывода справки
  language?: string; // Язык справки
  properties?: IPropertyDefinition[]; // Массив свойств
  source?: string[]; // Массив, из которого брать аргументы
}

export default class Arguments {
  private name: string;
  private language: string;
  private source: string[];
  private properties: { [name: string]: IPropertyDefinition };

  constructor(construct?: IArgumentsConstruct) {
    this.name = construct.name || ""; // TODO: Получать название из package.json;
    this.language = construct.language || "en"; // TODO: Интернационализация, список доступных языков
    this.source = construct.source || process.argv.slice(2);
    if (Array.isArray(construct.properties) && construct.properties.length) {
      construct.properties.forEach((property) => {
        this.properties[property.Name] = property;
      });
    }
  }

  public addProperty(property: IPropertyDefinition) {
    if (!this.properties[property.Name]) {
      this.properties[property.Name] = property;
    }
  }

  private parseProperties() {
    this.source.forEach((part: string) => {
      if (part.substring(0, 2) === "--") {

      } else if (part.substring(0, 1) === "-") {

      } else {

      }
    });
  }

  private verifyProperty(property: IProperty) {

  }
}
