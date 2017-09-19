/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Operative Company. All rights reserved.
 *  Licensed under the MIT license. See LICENSE.txt in the project root for license information.
 *  @author Evgeni Zharkov <zharkov.e.u@gmail.com>
 *--------------------------------------------------------------------------------------------*/

"use strict";

import * as assert from "assert";
import "mocha";
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
  Name: "Int",
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

describe("Проверка обязательного свойства", () => {
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

  it("Обработка при наличии обязательного свойства", () => {
    errorQueue.length = 0;
    assert.deepStrictEqual(parseRequiredArgumentsSuccess.parseProperties(), parseRequiredArgumentsExpected);
  });
  it("Массив ошибок пуст", () => {
    assert.equal(errorQueue.length, 0);
  });
  it("Обработка при отсутсвии обязательного свойства", () => {
    errorQueue.length = 0;
    assert.deepStrictEqual(parseRequiredArgumentsFault.parseProperties(), {});
  });
  it("Массив ошибок содержит одну ошибку", () => {
    assert.equal(errorQueue.length, 1);
  });
  it("Ошибка относится к классу PropertyRequired", () => {
    assert.equal(errorQueue[0] instanceof errors.PropertyRequired, true);
  });
});

/*-----------------------------------------------------------------------------------------------------*/
/*--------------------------Проверка свойства типа существует/не существует----------------------------*/

describe("Проверка свойства типа существует/не существует", () => {
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

  it("Обработка при наличии свойства типа существует/не существует", () => {
    errorQueue.length = 0;
    assert.deepStrictEqual(parseExistArgumentsSuccess.parseProperties(), parseExistArgumentsExpected);
  });
  it("Массив ошибок пуст", () => {
    assert.equal(errorQueue.length, 0);
  });
});

/*-----------------------------------------------------------------------------------------------------*/
/*---------------------------Проверка ошибки при задании не ожидаемого свойства------------------------*/

describe("Проверка ошибки при задании не ожидаемого свойства", () => {
  const parseExistArguments = {
    errorHandlers: ErrorHandlers,
    properties: [ExistProperty],
  };

  const parseExistArgumentsFault = new Arguments(
    Object.assign(parseExistArguments, { source: ["--Ext.value"] }));

  it("Обработка при задании не ожидаемого свойства", () => {
    errorQueue.length = 0;
    assert.deepStrictEqual(parseExistArgumentsFault.parseProperties(), {});
  });
  it("Массив ошибок содержит одну ошибку", () => {
    assert.equal(errorQueue.length, 1);
  });
  it("Ошибка относится к классу PropertyNoExist", () => {
    assert.equal(errorQueue[0] instanceof errors.PropertyNoExist, true);
  });
});

/*-----------------------------------------------------------------------------------------------------*/
/*-----------------------------------Проверка логического свойства-------------------------------------*/

describe("Проверка логического свойства", () => {
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

  it("Обработка логического свойства", () => {
    errorQueue.length = 0;
    assert.deepStrictEqual(parseBooleanArgumentsSuccess.parseProperties(), parseBooleanArgumentsExpected);
  });
  it("Массив ошибок пуст", () => {
    assert.equal(errorQueue.length, 0);
  });
  it("Обработка логического свойства с невалидным значением", () => {
    errorQueue.length = 0;
    assert.deepStrictEqual((parseBooleanArgumentsFault.parseProperties()).Bool.Value, undefined);
  });
  it("Массив ошибок содержит одну ошибку", () => {
    assert.equal(errorQueue.length, 1);
  });
  it("Ошибка относится к классу PropertyValueError", () => {
    assert.equal(errorQueue[0] instanceof errors.PropertyValueError, true);
  });
});

/*-----------------------------------------------------------------------------------------------------*/
/*-----------------------------------Проверка строкового свойства--------------------------------------*/

describe("Проверка строкового свойства", () => {
  const parseStringArguments = {
    errorHandlers: ErrorHandlers,
    properties: [StringProperty],
  };

  const parseStringArgumentsExpected = {
    Str: {
      Modifier: "--",
      Name: "Str",
      RawValue: "string value",
      Value: "string value",
    },
  };

  const parseStringArgumentsSuccess = new Arguments(
    Object.assign(parseStringArguments, { source: ["--Str", "string value"]}));

  it("Обработка строкового свойства", () => {
    errorQueue.length = 0;
    assert.deepStrictEqual(parseStringArgumentsSuccess.parseProperties(), parseStringArgumentsExpected);
  });
  it("Массив ошибок пуст", () => {
    assert.equal(errorQueue.length, 0);
  });
});

/*-----------------------------------------------------------------------------------------------------*/
/*-----------------------------------Проверка целочисленного свойства----------------------------------*/

describe("Проверка целочисленного свойства", () => {
  const parseIntegerArguments = {
    errorHandlers: ErrorHandlers,
    properties: [IntegerProperty],
  };

  const parseIntegerArgumentsExpected = {
    Int: {
      Modifier: "--",
      Name: "Int",
      RawValue: "1890121",
      Value: 1890121,
    },
  };

  const parseIntegerArgumentsSuccess = new Arguments(
    Object.assign(parseIntegerArguments, { source: ["--Int", "1890121"]}));
  const parseIntegerArgumentsFault = new Arguments(
    Object.assign(parseIntegerArguments, { source: ["--Int", "#a310"] }));

  it("Обработка целочисленного свойства", () => {
    errorQueue.length = 0;
    assert.deepStrictEqual(parseIntegerArgumentsSuccess.parseProperties(), parseIntegerArgumentsExpected);
  });
  it("Массив ошибок пуст", () => {
    assert.equal(errorQueue.length, 0);
  });
  it("Обработка целочисленного свойства с невалидным значением", () => {
    errorQueue.length = 0;
    assert.deepStrictEqual((parseIntegerArgumentsFault.parseProperties()).Int.Value, undefined);
  });
  it("Массив ошибок содержит одну ошибку", () => {
    assert.equal(errorQueue.length, 1);
  });
  it("Ошибка относится к классу PropertyValueError", () => {
    assert.equal(errorQueue[0] instanceof errors.PropertyValueError, true);
  });
});

/*-----------------------------------------------------------------------------------------------------*/
/*-----------------------------------Проверка числового свойства с плавающей точкой--------------------*/

describe("Проверка числового свойства с плавающей точкой", () => {
  const parseFloatArguments = {
    errorHandlers: ErrorHandlers,
    properties: [FloatProperty],
  };

  const parseFloatArgumentsExpected = {
    Flt: {
      Modifier: "--",
      Name: "Flt",
      RawValue: "182.1212",
      Value: 182.1212,
    },
  };

  const parseFloatArgumentsSuccess = new Arguments(
    Object.assign(parseFloatArguments, { source: ["--Flt", "182.1212"]}));
  const parseFloatArgumentsFault = new Arguments(
    Object.assign(parseFloatArguments, { source: ["--Flt", "f12.12"] }));

  it("Обработка числового свойства с плавающей точкой", () => {
    errorQueue.length = 0;
    assert.deepStrictEqual(parseFloatArgumentsSuccess.parseProperties(), parseFloatArgumentsExpected);
  });
  it("Массив ошибок пуст", () => {
    assert.equal(errorQueue.length, 0);
  });
  it("Обработка числового свойства с плавающей точкой с невалидным значением", () => {
    errorQueue.length = 0;
    assert.deepStrictEqual((parseFloatArgumentsFault.parseProperties()).Flt.Value, undefined);
  });
  it("Массив ошибок содержит одну ошибку", () => {
    assert.equal(errorQueue.length, 1);
  });
  it("Ошибка относится к классу PropertyValueError", () => {
    assert.equal(errorQueue[0] instanceof errors.PropertyValueError, true);
  });
});

/*-----------------------------------------------------------------------------------------------------*/
