# cli-args-parser
Обработка аргументов командной строки

## Основные особенности:
* Вывод сообщений
* Поддержка интернационализации
* Генерация help-файла
* Произвольные (включая производные) типы аргументов
* Расширяемость

Использование:

    const Arguments = require('cli-args-parser').Arguments

    const RequiredProperty = {
      Description: 'Required Property',
      Modifier: '--',
      Name: 'Req',
      Required: true,
      Type: 'exist'
    }

    const args = new Arguments({properties: [RequiredProperty], language: 'ru'})
    args.parseProperties()