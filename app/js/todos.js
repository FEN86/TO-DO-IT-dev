const TODO_STATUS = {
  hold: 'hold',
  pending: 'pending',
  done: 'done'
};

const STATUS_PRIORITY = {
  pending: 0,
  hold: 1,
  done: 2
};

const todos = {
  listContainer: document.querySelector('.list'),
  addForm: document.forms['addTask'],

  get inputTitle() { return this.addForm.elements['title']; },
  get inputDesc() { return this.addForm.elements['description']; },

  searchForm: document.forms['searchForm'],
  get inputSearch() { return this.searchForm.elements['search']; },

  allTodos: [],

  curTodos: [],

  todoElems: {},

  updateStorage() {
    window.localStorage.setItem('todos', JSON.stringify(this.allTodos));
  },

  getTodos() {
    return this.allTodos.slice();
  },

  findTodoIndex(id, collection) {
    return collection.findIndex((todo) => id === todo.id);
  },

  add(todo) {
    this.allTodos.unshift(todo);
    this.curTodos.unshift(todo);
    this.updateStorage();
  },

  edit(todoId, newTodo) {
    const index = this.findTodoIndex(todoId);

    if (index >= 0) {
      this.allTodos[index] = newTodo;
      this.updateStorage();
    }
  },

  delete(todoId) {
    [this.allTodos, this.curTodos].forEach((collection) => {
      const index = this.findTodoIndex(todoId, collection);

      if (index >= 0) {
        collection.splice(index, 1);
      }
    });

    this.updateStorage();
  },

  setStatus(todoId, status) {
    [this.allTodos, this.curTodos].forEach((collection) => {
      const index = this.findTodoIndex(todoId, collection);

      if (index >= 0) {
        collection[index].status = status;
      }
    });

    this.updateStorage();
  },

  deleteAll() {
    this.allTodos = [];
    this.curTodos = [];
    this.updateStorage();
  },

  setStatusToAll(status) {
    [this.allTodos, this.curTodos].forEach((collection) => {
      collection.forEach(function (todo) {
        todo.status = status;
      });
    });
    this.updateStorage();
  },

  hasStatus(status, todoId) {
    const index = this.findTodoIndex(todoId);

    if (index >= 0) {
      return this.allTodos[index].status === status;
    }
    else {
      return false;
    }
  },

  sortByTitle() {
    this.curTodos.sort((a, b) => {
      return a.title.toLowerCase() < b.title.toLowerCase() ? 1 : -1;
    });
  },

  sortByStatus() {
    this.curTodos.sort((a, b) => {
      return STATUS_PRIORITY[b.status] - STATUS_PRIORITY[a.status];
    });
  },

  search(input) {
    return this.allTodos.filter((todo) => {
      return todo.title.includes(input);
    });
  },

  isSomeHold() {
    return this.curTodos.some((todo) => todo.status === TODO_STATUS.hold);
  },

  handleAddTodo(e) {
    e.preventDefault();

    let title = this.inputTitle.value.trim();
    let desc = this.inputDesc.value.trim();

    if (title == '' || desc == '') {
      return;
    }

    const todo = this.createNewTodo(title, desc);

    this.add(todo);
    this.renderTodo(todo);
    this.addForm.reset();
  },

  handleSearchTodo(e) {
    const val = e.target.value.trim();

    if (val === '' && this.curTodos.length === this.allTodos.length) return;

    this.curTodos = this.search(val);
    this.renderTodoList();
  },

  setStaticListeners() {
    this.addForm.addEventListener('submit', this.handleAddTodo.bind(this));
    this.inputSearch.addEventListener('input', this.handleSearchTodo.bind(this));

    document.querySelector('.js-action-hold').addEventListener('click', () => {
      this.setStatusToAll(this.isSomeHold() ? TODO_STATUS.pending : TODO_STATUS.hold);
      this.updateAllElems();
    });

    document.querySelector('.js-action-done').addEventListener('click', () => {
      this.setStatusToAll(TODO_STATUS.done);
      this.updateAllElems();
    });

    document.querySelector('.js-action-remove').addEventListener('click', () => {
      this.deleteAll();
      this.listContainer.innerHTML = '';
    });

    document.querySelector('.js-sort-status').addEventListener('click', () => {
      this.sortByStatus();
      this.renderTodoList();
    });

    document.querySelector('.js-sort-title').addEventListener('click', () => {
      this.sortByTitle();
      this.renderTodoList();
    });
  },

  setTodoListeners(todo) {
    const elem = this.todoElems[todo.id];
    const card = elem.querySelector('.card');
    const btnEdit = elem.querySelector('.js-edit');
    const btnDelete = elem.querySelector('.js-delete');
    const btnHold = elem.querySelector('.js-hold');
    const btnDone = elem.querySelector('.js-done');

    const inpTitle = elem.querySelector('.card__inp-title');
    const inpDesc = elem.querySelector('.card__inp-desc');
    const btnSave = elem.querySelector('.js-save');
    const btnCancel = elem.querySelector('.js-cancel');

    btnEdit.addEventListener('click', () => {
      card.classList.add('card--edit');
      inpTitle.value = todo.title;
      inpDesc.value = todo.description;
    });

    btnSave.addEventListener('click', () => {
      const title = inpTitle.value.trim();
      const desc = inpDesc.value.trim();

      if (title == '' || desc == '') return;

      todo.title = title;
      todo.description = desc;
      card.classList.remove('card--edit');
      this.updateTodoElem(todo);
    });

    btnCancel.addEventListener('click', () => {
      card.classList.remove('card--edit');
    });

    btnDelete.addEventListener('click', () => {
      this.delete(todo.id);
      delete this.todoElems[todo.id];
      this.listContainer.removeChild(elem);
    });

    btnHold.addEventListener('click', () => {
      const newStatus = todo.status === TODO_STATUS.hold ? TODO_STATUS.pending : TODO_STATUS.hold;

      this.setStatus(todo.id, newStatus);
      this.updateTodoElem(todo);
    });

    btnDone.addEventListener('click', () => {
      const newStatus = todo.status === TODO_STATUS.done ? TODO_STATUS.pending : TODO_STATUS.done;

      this.setStatus(todo.id, newStatus);
      this.updateTodoElem(todo);
    });
  },

  renderTodo(todo) {
    let elem = this.todoElems[todo.id];

    if (elem == null) {
      const holder = document.createElement('div');

      holder.innerHTML = this.getTodoTemplate(todo);
      elem = holder.firstElementChild;

      this.todoElems[todo.id] = elem;
      this.setTodoListeners(todo);
      this.updateTodoElem(todo);
    }

    this.listContainer.insertBefore(elem, this.listContainer.firstChild);
  },

  updateTodoElem(todo) {
    const elem = this.todoElems[todo.id];
    const status = todo.status;
    const isHolded = status === "hold";
    const isDone = status === "done";

    const card = elem.querySelector('.card');
    const title = elem.querySelector('.card__title');
    const desc = elem.querySelector('.card__text');
    const btnEdit = elem.querySelector('.js-edit');
    const btnDelete = elem.querySelector('.js-delete');
    const btnHold = elem.querySelector('.js-hold');
    const btnDone = elem.querySelector('.js-done');
    const statusElem = elem.querySelector('.card__flag');

    card.className = `card js-card--${status}`;
    title.textContent = todo.title;
    desc.textContent = todo.description;
    btnEdit.disabled = isHolded || isDone;
    btnDelete.disabled = isHolded;
    btnHold.disabled = isDone;
    btnHold.textContent = status == 'hold' ? 'Unhold' : 'Hold';
    btnDone.disabled = isHolded;
    btnDone.textContent = status == 'done' ? 'Undone' : 'Done';
    statusElem.textContent = status;
  },

  updateAllElems() {
    this.curTodos.forEach((todo) => {
      this.updateTodoElem(todo);
    });
  },

  renderTodoList() {
    this.listContainer.innerHTML = '';
    this.curTodos.forEach((todo) => {
      this.renderTodo(todo);
    });
  },

  getTodoTemplate() {
    return `
      <div class="list__item">
          <div class="card">
            <div class="card__info">
              <div class="card__body">
                <h3 class="card__title"></h3>
                <p class="card__text"></p>
              </div>
              <div class="card__control group-btn">
                <button class="btn btn--sz-sm js-edit">Edit</button>
                <button class="btn btn--sz-sm js-delete">Delete</button>
                <button class="btn btn--sz-sm js-hold"></button>
                <button class="btn btn--sz-sm js-done"></button>
              </div>
            </div>
            <div class="card__edit">
              <div class="card__body">
                <input class="form__input card__inp-title" type="text">
                <input class="form__input card__inp-desc" type="text">
              </div>
              <div class="card__control group-btn">
                <button class="btn btn--sz-sm js-save">Save</button>
                <button class="btn btn--sz-sm js-cancel">Cancel</button>
              </div>
            </div>
          <div class="card__flag"></div>
        </div>
      </div>`;
  },

  createNewTodo(title, description) {
    return {
      title,
      description,
      status: TODO_STATUS.pending,
      id: `task-${Math.random() * 100000}`,
    };
  },

  getTodosFromStorage() {
    this.allTodos = JSON.parse(window.localStorage.getItem('todos')) || [];
    this.curTodos = this.allTodos.slice();
  },

  init() {
    this.getTodosFromStorage();
    this.setStaticListeners();
    this.renderTodoList();
    this.initTabs();
  },

  initTabs() {
    const tabBtn = document.querySelectorAll('[data-tab]');
    let activeTab;

    tabBtn.forEach(function (item) {
      let nameAtr = item.getAttribute('data-tab');
      let findAtrId = document.getElementById(nameAtr);
      findAtrId.style.display = 'none';

      item.addEventListener('click', function () {
        if (activeTab === findAtrId) return;

        findAtrId.style.display = '';

        if (activeTab != null) {
          activeTab.style.display = 'none';
        }

        activeTab = findAtrId;
      });

      let closeBtn = findAtrId.querySelector('.close-btn');

      closeBtn.addEventListener('click', function () {
        findAtrId.style.display = 'none';
        activeTab = null;
      });
    });
  }
};

todos.init();
