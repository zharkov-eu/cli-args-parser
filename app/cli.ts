/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Operative Company. All rights reserved.
 *  Licensed under the MIT license. See LICENSE.txt in the project root for license information.
 *  @author Evgeni Zharkov <zharkov.e.u@gmail.com>
 *--------------------------------------------------------------------------------------------*/

"use strict";

import * as process from "process";
import * as error from "./errors";
import * as parser from "./parser";

type TType = "boolean" | "integer" | "float" | "string" | "array" | "object" | "exist" | "user";

export interface IProperty {
  Modifier: string; // Модификатор (- | --)
  Name: string; // Название свойства
  RawValue?: string; // Значение свойства (до преобразования в тип)
  Value?: any; // Значение свойства (после преобразования в тип)
}

interface IPropertyDefinition extends IProperty {
  Deprecated?: boolean; // Вскоре перестанет поддерживаться
  Description?: string; // Описание свойства, используется для вывода справки
  Type: TType; // Тип свойства
  Transform?: (rawValue: string) => any; // Собственная валидация и трансформация свойства
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
  private properties: { [name: string]: IProperty };
  private propertiesDef: { [name: string]: IPropertyDefinition };

  constructor(construct?: IArgumentsConstruct) {
    this.name = construct.name || ""; // TODO: Получать название из package.json;
    this.language = construct.language || "en"; // TODO: Интернационализация, список доступных языков
    this.source = construct.source || process.argv.slice(2);
    if (Array.isArray(construct.properties) && construct.properties.length) {
      construct.properties.forEach((property) => {
        this.propertiesDef[property.Name] = property;
      });
    }
  }

  public addProperty(property: IPropertyDefinition) {
    if (!this.propertiesDef[property.Name]) {
      if (typeof property.Transform !== "function") {
        property.Transform = parser[property.Type];
      }
      this.propertiesDef[property.Name] = property;
    }
  }

  private parseProperties() {
    let propertyNameTemp: string = "";
    this.source.forEach((part: string, index: number) => {
      if (propertyNameTemp) {
        if (this.propertiesDef[propertyNameTemp].Type !== "exist") {
          this.properties[propertyNameTemp].RawValue = part;
          this.properties[propertyNameTemp].Value = this.propertiesDef[propertyNameTemp].Transform(part);
          return;
        } else {
          this.properties[propertyNameTemp].RawValue = "true";
          this.properties[propertyNameTemp].Value = true;
          propertyNameTemp = "";
        }
      }
      if (part[0] === "-") {
        propertyNameTemp = part[1] === "-" ? part.substring(2) : part.substring(1);
        const property: IProperty = {
          Modifier: part[1] === "-" ? "--" : "-",
          Name: propertyNameTemp,
        };
        try {
          if (!this.propertiesDef[property.Name]) {
            throw new error.PropertyNoExist(property);
          }
          if (this.propertiesDef[property.Name].Deprecated) {
            throw new error.PropertyDeprecated(property);
          }
          this.properties[property.Name] = property;
        } catch (error) {
          console.log(error.message);
        }
      } else {

      }
    });
  }

  private verifyProperty(property: IProperty) {

  }
}
