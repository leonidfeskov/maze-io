const { random } = require('./utils');

const firsWord = [
    'Грязный',
    'Чистый',
    'Вкусный',
    'Питательный',
    'Упитанный',
    'Худой',
    'Мокрый',
    'Толстый',
    'Мохнатый',
    'Трусливый',
];

const secondWord = [
    'Свин',
    'Хряк',
    'Хрюн',
    'Наф-наф',
    'Ниф-ниф',
    'Нуф-нуф',
    'Поросенок',
    'Пяточек',
    'Пиг',
    'Хрю',
];

const createName = () => {
    const firstName = firsWord[random(0, firsWord.length - 1)];
    const lastName = secondWord[random(0, secondWord.length - 1)];
    return `${firstName} ${lastName}`;
};

module.exports = createName;
