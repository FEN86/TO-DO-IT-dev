const TODO_STATUS = {
  hold: 'hold',
  pending: 'pending',
  done: 'done'
};

const todos = {
  listContainer: document.querySelector('.list'),
  addForm: document.forms['addTask'],
  get inputTitle() { return this.addForm.elements['title']; },
  get inputDesc() { return this.addForm.elements['description']; },

  todos: [
    {
      id: 1,
      title: 'Titel1',
      description: 'Desc1',
      status: TODO_STATUS.hold
    },
    {
      id: 2,
      title: 'Titel1',
      description: 'Desc1',
      status: TODO_STATUS.pending
    },
    {
      id: 3,
      title: 'Titel1',
      description: 'Desc1',
      status: TODO_STATUS.done
    }
  ],

  getTodos() {
    return this.todos.slice();
    //... this.todos -> fetch().then(todos => this.todos = todos) .> render
  },

  add(todo) {
    this.todos.push(todo);
  },

  edit(todoId, newTodo) {
    const index = this.todos.findIndex((todo) => todoId === todo.id);

    if (index >= 0) {
      this.todos[index] = newTodo;
    }
  },

  delete(todoId) {
    const index = this.todos.findIndex((todo) => todoId === todo.id);

    if (index >= 0) {
      this.todos.splice(index, 1);
    }
  },

  setStatus(todoId, status) {
    const index = this.todos.findIndex((todo) => todoId === todo.id);

    if (index >= 0) {
      this.todos[index].status = status;
    }
  },

  deleteAll() {
    this.todos = [];
  },

  setStatusToAll(status) {
    this.todos.forEach(function (todo) {
      todo.status = status;
    });
  },

  hasStatus(status, todoId) {
    const index = this.todos.findIndex((todo) => todoId === todo.id);

    if (index >= 0) {
      return this.todos[index].status === status;
    }
    else {
      return false;
    }
  },

  sortByTitle() {
    this.todos.sort((a, b) => {
      return a.title < b.title ? -1 : 1;
    });
  },

  sortByStatus() {
    this.todos.sort((a, b) => {
      return a.status < b.status ? -1 : 1;
    });
  },

  search(input) {
    return this.todos.filter((todo) => {
      return todo.title.includes(input);
    });
  },

  getTemplateBulkActions() { },
  getTemplateTodo() { },
  getTemplateTodoControls() { },
  getTemplateTodoList() { },
  handleAddTodo(e) {
    e.preventDefault();

    const todo = this.createNewTodo(this.inputTitle.value, this.inputDesc.value);

    this.add(todo);
    this.renderTodo(todo);
    this.addForm.reset();
  },

  handleSearchTodo() {
    // call search(input)
  },

  handleTabSelection() {
    //
  },

  handleCloseAddForm() {
    //..
  },

  handleCloseSearchForm() {
    //..
  },

  setStaticListeners() {
    //
  },

  handleTodoControlClick() {
    //
  },

  setTodoListeners(elem, todo) {
    const card = elem.querySelector('.card');
    const btnEdit = elem.querySelector('.js-edit');
    const btnDelete = elem.querySelector('.js-delete');
    const btnHold = elem.querySelector('.js-hold');
    const btnDone = elem.querySelector('.js-done');

    btnEdit.addEventListener('click', () => {

    });

    btnDelete.addEventListener('click', () => {
      this.delete(todo.id);
      this.listContainer.removeChild(elem);
    });

    btnHold.addEventListener('click', () => {
      const newStatus = todo.status === TODO_STATUS.hold ? TODO_STATUS.pending : TODO_STATUS.hold;

      card.classList.remove(`js-card--${todo.status}`);
      card.classList.add(`js-card--${newStatus}`);
      this.setStatus(todo.id, newStatus);
    });

    btnDone.addEventListener('click', () => {
      card.classList.remove(`js-card--${todo.status}`);
      card.classList.add(`js-card--${TODO_STATUS.done}`);
      this.setStatus(todo.id, TODO_STATUS.done);
    });
  },

  renderTodo(todo) {
    const holder = document.createElement('div');

    holder.innerHTML = this.getTodoTemplate(todo);

    const elem = holder.firstElementChild;

    this.listContainer.appendChild(elem);
    this.setTodoListeners(elem, todo);
  },

  renderTodoList() {
    this.todos.forEach((todo) => {
      this.renderTodo(todo);
    });
  },

  getTodoTemplate(todo) {
    const status = todo.status;
    const isHolded = status == "hold" ? "disabled" : "";
    const isDone = status == "done" ? "disabled" : "";

    return `
      <div class="list__item">
          <div class="card js-card--${status}">
            <div class="card__body">
              <h3 class="card__title">${todo.title}</h3>
                <p class="card__text">${todo.description}</p>
            </div>
            <div class="card__control group-btn">
              <button class="btn btn--sz-sm js-edit" ${isHolded || isDone}>Edit</button>
              <button class="btn btn--sz-sm js-delete" ${isHolded}>Delete</button>
              <button class="btn btn--sz-sm js-hold" ${isDone}>${status == "hold" ? "Unhold" : "Hold"}</button>
              <button class="btn btn--sz-sm js-done" ${isHolded || isDone}>${status == "done" ? "Undone" : "Done"}</button>
            </div>
          <div class="card__flag">${status}</div>
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

  init() {

    this.renderTodoList();
    this.addForm.addEventListener('submit', this.handleAddTodo.bind(this));
    // setStaticListeners
    // getTodos
    // render todos
    // set dynamic listeners
  }
};

todos.init();

// todo container

// todo list controls
// tabs
// add form
// search form
// bulk actions
// todo list
// todo item
