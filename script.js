const styleLink = document.createElement('link');
styleLink.rel = 'stylesheet';
styleLink.href = 'style.css';
document.head.append(styleLink);

const header = document.createElement('header');
header.className = 'header';

const title = document.createElement('h1');
title.className = 'header__title';
title.textContent = 'Мой список задач';

header.append(title);

const main = document.createElement('main');
main.className = 'main';

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
sortButton.title = 'Сортировка задач по дате';

controls.append(searchInput, filterSelect, sortButton);

const list = document.createElement('ul');
list.className = 'list';

main.append(form, controls, list);

const footer = document.createElement('footer');
footer.className = 'footer';
footer.textContent = '2026 ToDo-лист';

document.body.append(header, main, footer);

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function formatDate(value) {
  const [year, month, day] = value.split('-');
  return `${day}.${month}.${year}`;
}

function createTaskElement(task) {
  const item = document.createElement('li');
  item.className = 'task';
  item.dataset.id = task.id;
  item.draggable = true;

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

function renderTasks() {
  list.replaceChildren();

  const searchText = searchInput.value.trim().toLowerCase();
  const filter = filterSelect.value;

  const visibleTasks = tasks.filter((task) => {
    if (filter === 'active' && task.done) {
      return false;
    }
    if (filter === 'done' && !task.done) {
      return false;
    }
    return task.text.toLowerCase().includes(searchText);
  });

  if (visibleTasks.length === 0) {
    const empty = document.createElement('li');
    empty.className = 'list__empty';
    empty.textContent = 'Задачи не найдены';
    list.append(empty);
    return;
  }

  visibleTasks.forEach((task) => {
    list.append(createTaskElement(task));
  });
}

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
  textInput.focus();
});

renderTasks();

list.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button || button.dataset.action !== 'delete') {
    return;
  }

  const id = Number(button.closest('.task').dataset.id);
    if (!confirm('Удалить задачу?')) {
    return;
  }

  tasks = tasks.filter((task) => task.id !== id);

  saveTasks();
  renderTasks();
});

list.addEventListener('change', (event) => {
  if (!event.target.classList.contains('task__checkbox')) {
    return;
  }

  const id = Number(event.target.closest('.task').dataset.id);
  const task = tasks.find((item) => item.id === id);
  task.done = event.target.checked;

  saveTasks();
  renderTasks();
});


function startEdit(item, task) {
  item.draggable = false;
  item.replaceChildren();

  const editText = document.createElement('input');
  editText.type = 'text';
  editText.className = 'task__edit-text';
  editText.value = task.text;
  editText.setAttribute('aria-label', 'Новое название');

  const editDate = document.createElement('input');
  editDate.type = 'date';
  editDate.className = 'task__edit-date';
  editDate.value = task.date;
  editDate.setAttribute('aria-label', 'Новая дата');

  const actions = document.createElement('div');
  actions.className = 'task__actions';

  const saveButton = document.createElement('button');
  saveButton.type = 'button';
  saveButton.className = 'button';
  saveButton.textContent = 'Сохранить';

  const cancelButton = document.createElement('button');
  cancelButton.type = 'button';
  cancelButton.className = 'button button--secondary';
  cancelButton.textContent = 'Отмена';

  saveButton.addEventListener('click', () => {
    const newText = editText.value.trim();

    if (newText === '' || editDate.value === '') {
      alert('Заполните название и дату');
      return;
    }

    task.text = newText;
    task.date = editDate.value;
    saveTasks();
    renderTasks();
  });

  cancelButton.addEventListener('click', () => {
    renderTasks();
  });

  editText.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      saveButton.click();
    }
  });

  actions.append(saveButton, cancelButton);
  item.append(editText, editDate, actions);
  editText.focus();
}

list.addEventListener('click', (event) => {
  const button = event.target.closest('button');
  if (!button || button.dataset.action !== 'edit') {
    return;
  }

  const item = button.closest('.task');
  const id = Number(item.dataset.id);
  const task = tasks.find((t) => t.id === id);

  startEdit(item, task);
});

let sortAscending = true;

sortButton.addEventListener('click', () => {
  tasks.sort((a, b) => {
    if (sortAscending) {
      return a.date.localeCompare(b.date);
    }
    return b.date.localeCompare(a.date);
  });

  sortAscending = !sortAscending;
  sortButton.textContent = sortAscending
    ? 'Сортировать: сначала ранние'
    : 'Сортировать: сначала поздние';

  saveTasks();
  renderTasks();
});

filterSelect.addEventListener('change', renderTasks);
searchInput.addEventListener('input', renderTasks);

let draggedId = null;

list.addEventListener('dragstart', (event) => {
  const item = event.target.closest('.task');
  if (!item) {
    return;
  }

  draggedId = Number(item.dataset.id);
  event.dataTransfer.setData('text/plain', item.dataset.id);
  item.classList.add('task--dragging');
});

list.addEventListener('dragend', (event) => {
  const item = event.target.closest('.task');
  if (item) {
    item.classList.remove('task--dragging');
  }
});

list.addEventListener('dragover', (event) => {
  event.preventDefault();
});

list.addEventListener('drop', (event) => {
  event.preventDefault();

  const target = event.target.closest('.task');
  if (!target || draggedId === null) {
    return;
  }

  const targetId = Number(target.dataset.id);
  if (targetId === draggedId) {
    return;
  }

  const fromIndex = tasks.findIndex((task) => task.id === draggedId);
  const toIndex = tasks.findIndex((task) => task.id === targetId);

  const [movedTask] = tasks.splice(fromIndex, 1);
  tasks.splice(toIndex, 0, movedTask);

  draggedId = null;
  saveTasks();
  renderTasks();
});