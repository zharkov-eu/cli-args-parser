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

interface IProperty {
  Modifier: string; // Модификатор (- | --)
  Name: string; // Название свойства
}

export interface IPropertyParsed extends IProperty {
  RawValue?: string; // Значение свойства (до преобразования в тип)
  Value?: any; // Значение свойства (после преобразования в тип)
}

export interface IPropertyDefinition extends IProperty {
  Deprecated?: boolean; // Вскоре перестанет поддерживаться
  Description?: string; // Описание свойства, используется для вывода справки
  Type: TType; // Тип свойства
  Transform?: (rawValue: string) => any; // Собственная валидация и трансформация свойства
  Required?: boolean; // Обязательно ли наличие?
}

class Property implements IPropertyParsed {
  public Modifier: string;
  public Name: string;
  public RawValue: string;
  public Value: TType;

  constructor(property: IPropertyParsed) {
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

export class Arguments {
  private name: string;
  private language: string;
  private source: string[];
  private properties: { [name: string]: IPropertyParsed };
  private propertiesDef: { [name: string]: IPropertyDefinition };
  private propertiesRequired: string[];

  constructor(construct?: IArgumentsConstruct) {
    this.name = construct.name || ""; // TODO: Получать название из package.json;
    this.language = construct.language || "en"; // TODO: Интернационализация, список доступных языков
    this.source = construct.source || process.argv.slice(2);
    this.properties = {};
    this.propertiesDef = {};
    this.propertiesRequired = [];
    if (Array.isArray(construct.properties) && construct.properties.length) {
      construct.properties.forEach((property) => {
        this.addProperty(property);
      });
    }
  }

  public addProperty(property: IPropertyDefinition) {
    if (!this.propertiesDef[property.Name]) {
      if (property.Required) {
        this.propertiesRequired.push(property.Name);
      }
      if (typeof property.Transform !== "function") {
        property.Transform = parser[property.Type];
      }
      this.propertiesDef[property.Name] = property;
    }
  }

  public parseProperties(): { [name: string]: IPropertyParsed } {
    let propertyNameTemp: string = "";
    let propertyRequiredExist: number = this.propertiesRequired.length;
    this.source.forEach((part: string, index: number) => {
      if (propertyNameTemp) {
        this.properties[propertyNameTemp].RawValue = part;
        try {
          this.properties[propertyNameTemp].Value = this.propertiesDef[propertyNameTemp].Transform(part);
        } catch (error) {
          throw new error.PropertyValueError(this.propertiesDef[propertyNameTemp]);
        }
      } else if (part[0] === "-") {
        propertyNameTemp = part[1] === "-" ? part.substring(2) : part.substring(1);
        const property: IPropertyParsed = {
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
          if (this.propertiesDef[property.Name].Type === "exist") {
            this.properties[property.Name].RawValue = "true";
            this.properties[property.Name].Value = true;
            propertyNameTemp = "";
          }
        } catch (error) {
          console.log(error.message);
        }
      }
    });
    for (const property of Object.keys(this.properties)) {
      const requiredIndex = this.propertiesRequired.indexOf(this.properties[property].Name);
      if (requiredIndex !== -1) {
        this.propertiesRequired.splice(requiredIndex, 1);
        propertyRequiredExist--;
      }
    }
    if (propertyRequiredExist !== 0) {
      throw new error.PropertyRequired(this.propertiesDef[this.propertiesRequired[0]]);
    }
    return this.properties;
  }
}
