/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Operative Company. All rights reserved.
 *  Licensed under the MIT license. See LICENSE.txt in the project root for license information.
 *  @author Evgeni Zharkov <zharkov.e.u@gmail.com>
 *--------------------------------------------------------------------------------------------*/

"use strict";

import {Arguments, IPropertyDefinition} from "../app/cli";

// Тестирование без аргументов

const RequiredProperty: IPropertyDefinition = {
  Description: "Required Property",
  Modifier: "--",
  Name: "Req",
  Required: true,
  Type: "exist",
};

const ExistProperty: IPropertyDefinition = {
  Description: "Exist Property",
  Modifier: "--",
  Name: "Ext",
  Type: "exist",
};

const BooleanProperty: IPropertyDefinition = {
  Description: "Boolean Property",
  Modifier: "--",
  Name: "Bool",
  Type: "boolean",
};

const StringProperty: IPropertyDefinition = {
  Description: "String Property",
  Modifier: "--",
  Name: "Str",
  Type: "string",
};

const IntegerProperty: IPropertyDefinition = {
  Description: "Integer Property",
  Modifier: "--",
  Name: "Nmb",
  Type: "integer",
};

const FloatProperty: IPropertyDefinition = {
  Description: "Float Property",
  Modifier: "--",
  Name: "Flt",
  Type: "float",
};

const ObjectProperty: IPropertyDefinition = {
  Description: "Object Property",
  Modifier: "--",
  Name: "Obj",
  Type: "object",
};

// Проверка обязательного свойства
const parseRequiredArguments = new Arguments({properties: [RequiredProperty]});
console.log(parseRequiredArguments.parseProperties());

// // Проверка свойства типа существует/не существует
// const parseExistArguments = new Arguments({properties: [ExistProperty]});
// console.log(parseExistArguments.parseProperties());
