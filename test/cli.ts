/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Operative Company. All rights reserved.
 *  Licensed under the MIT license. See LICENSE.txt in the project root for license information.
 *  @author Evgeni Zharkov <zharkov.e.u@gmail.com>
 *--------------------------------------------------------------------------------------------*/

"use strict";

import * as assert from "assert";
import {Arguments, IPropertyDefinition} from "../app/cli";
import * as errors from "../app/errors";

const errorQueue = [];

const ErrorHandlers = {
  PropertyDeprecated: (error) => { errorQueue.push(error); },
  PropertyNoExist: (error) => { errorQueue.push(error); },
  PropertyRequired: (error) => { errorQueue.push(error); },
  PropertyValueError: (error) => { errorQueue.push(error); },
};

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

/*------------------------------------Проверка обязательного свойства----------------------------------*/

const parseRequiredArguments = {
  errorHandlers: ErrorHandlers,
  properties: [RequiredProperty],
};

const parseRequiredArgumentsExpected = {
  Req: {
    Modifier: "--",
    Name: "Req",
    RawValue: "true",
    Value: true,
  },
};

const parseRequiredArgumentsSuccess = new Arguments(
  Object.assign(parseRequiredArguments, { source: ["--Req"] }));
const parseRequiredArgumentsFault = new Arguments(
  Object.assign(parseRequiredArguments, { source: [""] }));

assert.deepStrictEqual(parseRequiredArgumentsSuccess.parseProperties(), parseRequiredArgumentsExpected);
assert.equal(errorQueue.length, 0);
assert.deepStrictEqual(parseRequiredArgumentsFault.parseProperties(), {});
assert.equal(errorQueue.length, 1);
assert.equal(errorQueue[0] instanceof errors.PropertyRequired, true);
errorQueue.pop();

/*-----------------------------------------------------------------------------------------------------*/
/*-Проверка свойства типа существует/не существует, проверка ошибки при задании не ожидаемого свойства-*/

const parseExistArguments = {
  errorHandlers: ErrorHandlers,
  properties: [ExistProperty],
};

const parseExistArgumentsExpected = {
  Ext: {
    Modifier: "--",
    Name: "Ext",
    RawValue: "true",
    Value: true,
  },
};

const parseExistArgumentsSuccess = new Arguments(
  Object.assign(parseExistArguments, { source: ["--Ext"]}));
const parseExistArgumentsFault = new Arguments(
  Object.assign(parseExistArguments, { source: ["--Ext.value"] }));

assert.deepStrictEqual(parseExistArgumentsSuccess.parseProperties(), parseExistArgumentsExpected);
assert.equal(errorQueue.length, 0);
assert.deepStrictEqual(parseExistArgumentsFault.parseProperties(), {});
assert.equal(errorQueue.length, 1);
assert.equal(errorQueue[0] instanceof errors.PropertyNoExist, true);
errorQueue.pop();

/*-----------------------------------------------------------------------------------------------------*/
/*-----------------------------------Проверка логического свойства-------------------------------------*/

const parseBooleanArguments = {
  errorHandlers: ErrorHandlers,
  properties: [BooleanProperty],
};

const parseBooleanArgumentsExpected = {
  Bool: {
    Modifier: "--",
    Name: "Bool",
    RawValue: "false",
    Value: false,
  },
};

const parseBooleanArgumentsSuccess = new Arguments(
  Object.assign(parseBooleanArguments, { source: ["--Bool", "false"]}));
const parseBooleanArgumentsFault = new Arguments(
  Object.assign(parseBooleanArguments, { source: ["--Bool", "10"] }));

assert.deepStrictEqual(parseBooleanArgumentsSuccess.parseProperties(), parseBooleanArgumentsExpected);
assert.equal(errorQueue.length, 0);
assert.deepStrictEqual(parseBooleanArgumentsFault.parseProperties(), {});
assert.equal(errorQueue.length, 1);
assert.equal(errorQueue[0] instanceof errors.PropertyValueError, true);
errorQueue.pop();

/*-----------------------------------------------------------------------------------------------------*/