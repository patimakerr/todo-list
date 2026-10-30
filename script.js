//  Подключение стилей
const styleLink = document.createElement('link');
styleLink.rel = 'stylesheet';
styleLink.href = 'style.css';
document.head.append(styleLink);

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

//  Данные и LOCALSTORAGE 
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function formatDate(value) {
  const [year, month, day] = value.split('-');
  return `${day}.${month}.${year}`;
}

// Создание карточки задачи
function createTaskElement(task) {
  const item = document.createElement('li');
  item.className = 'task';
  item.dataset.id = task.id;

  if (task.done) {
    item.classList.add('task--done');
  }

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.className = 'task__checkbox';
  checkbox.checked = task.done;
  checkbox.setAttribute('aria-label', 'Отметить как выполненную');

  const content = document.createElement('div');
  content.className = 'task__content';

  const text = document.createElement('p');
  text.className = 'task__text';
  text.textContent = task.text;

  const date = document.createElement('time');
  date.className = 'task__date';
  date.dateTime = task.date;
  date.textContent = 'Срок: ' + formatDate(task.date);

  content.append(text, date);

  const actions = document.createElement('div');
  actions.className = 'task__actions';

  const editButton = document.createElement('button');
  editButton.type = 'button';
  editButton.className = 'button';
  editButton.textContent = 'Изменить';
  editButton.dataset.action = 'edit';

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'button button--danger';
  deleteButton.textContent = 'Удалить';
  deleteButton.dataset.action = 'delete';

  actions.append(editButton, deleteButton);
  item.append(checkbox, content, actions);

  return item;
}

// Сортировка списка
function renderTasks() {
  list.replaceChildren();

  if (tasks.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'list__empty';
    empty.textContent = 'Задач пока нет';
    list.append(empty);
    return;
  }

  tasks.forEach((task) => {
    list.append(createTaskElement(task));
  });
}

// Добавление задач в список
form.addEventListener('submit', (event) => {
  event.preventDefault();

  const text = textInput.value.trim();
  if (text === '') {
    return;
  }

  tasks.push({
    id: Date.now(),
    text: text,
    date: dateInput.value,
    done: false,
  });

  saveTasks();
  renderTasks();
  form.reset();
});

renderTasks();
