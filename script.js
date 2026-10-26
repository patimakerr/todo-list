// РАЗМЕТКА СТРАНИЦЫ 

// Шапка
const header = document.createElement('header');
header.className = 'header';

const title = document.createElement('h1');
title.className = 'header__title';
title.textContent = 'Мой список задач';

header.append(title);

// Основная часть
const main = document.createElement('main');
main.className = 'main';

// Форма добавления задачи
const form = document.createElement('form');
form.className = 'form';

const textInput = document.createElement('input');
textInput.type = 'text';
textInput.className = 'form__input';
textInput.placeholder = 'Название задачи';
textInput.required = true;
textInput.setAttribute('aria-label', 'Название задачи');

const dateInput = document.createElement('input');
dateInput.type = 'date';
dateInput.className = 'form__date';
dateInput.required = true;
dateInput.setAttribute('aria-label', 'Дата задачи');

const addButton = document.createElement('button');
addButton.type = 'submit';
addButton.className = 'button';
addButton.textContent = 'Добавить';

form.append(textInput, dateInput, addButton);

// Панель управления: поиск, фильтр, сортировка
const controls = document.createElement('section');
controls.className = 'controls';

const searchInput = document.createElement('input');
searchInput.type = 'search';
searchInput.className = 'controls__search';
searchInput.placeholder = 'Поиск по названию';
searchInput.setAttribute('aria-label', 'Поиск по названию');

const filterSelect = document.createElement('select');
filterSelect.className = 'controls__select';
filterSelect.setAttribute('aria-label', 'Фильтр по статусу');

const filterOptions = [
  ['all', 'Все задачи'],
  ['active', 'Невыполненные'],
  ['done', 'Выполненные'],
];

filterOptions.forEach(([value, text]) => {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = text;
  filterSelect.append(option);
});

const sortButton = document.createElement('button');
sortButton.type = 'button';
sortButton.className = 'button';
sortButton.textContent = 'Сортировать: сначала ранние';

controls.append(searchInput, filterSelect, sortButton);

// Список задач
const list = document.createElement('ul');
list.className = 'list';

main.append(form, controls, list);

// Подвал
const footer = document.createElement('footer');
footer.className = 'footer';
footer.textContent = '2026 ToDo-лист';

// Добавляем все на страницу
document.body.append(header, main, footer);