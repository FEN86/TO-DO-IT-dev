
const mainButtons = document.querySelectorAll('[data-tab');

mainButtons.forEach(btn => {
  btn.addEventListener('click', function (e) {

    let x = e.clientX - e.target.offsetLeft;
    let y = e.clientY - e.target.offsetTop;

    let ripples = document.createElement('span');
    ripples.style.left = x + 'px';
    ripples.style.top = y + 'px';
    this.appendChild(ripples);

    setTimeout(() => {
      ripples.remove()
    }, 1000);
  })
})

// * Статус
const TODO_STATUS = {
  hold: 'hold',
  pending: 'pending',
  done: 'done'
};
// * Список задач
const todos = [
  {
    id: "5ebea0fe9e935985e5c34f83",
    title: "Lorem ipsum",
    description: "Ea commodo elit Lorem aliquip voluptate consectetur sit ex tempor ullamco sit.  nisi eiusmod ullamco. Laboris do consequat esse anim ullamco deserunt. Tempor in excepteur non cupidatat proident ea sit cillum. Nulla qui labore elit anim reprehenderit occaecat dolore pariatur et Lorem cillum ad. Minim tempor ad nisi culpa dolor esse ad in tempor consequat elit sunt.\r\n",
    status: TODO_STATUS.pending,
  },
  {
    id: "5ebea0fe1a90e2de21c3067b",
    title: "Lorem ipsum",
    description: "Laboris sit cillum laborum fugiat aliqua ad incididunt et eiusmod aute.\r\n",
    status: TODO_STATUS.hold
  },
  {
    id: "5ebea0fedd36a6a8b74a96ce",
    title: "Lorem ipsum",
    description: "Anim officia Lorem sint velit deserunt culpa aliquip ullamco tempor excepteur voluptate non eiusmod. Labore reprehenderit elit labore irure nostrud in. Do ex sit sint velit ex ut veniam elit sint.\r\n",
    status: TODO_STATUS.done
  },
];

(function (arrayOfTask) {
  const objOfTasks = arrayOfTask.reduce((acc, task) => {
    acc[task.id] = task;
    return acc;
  }, {});

  // * Element UI
  const listContainer = document.querySelector('.list');
  const form = document.forms['addTask'];
  const inputTitle = form.elements['title'];
  const inputDesc = form.elements['description'];
  // const searchForm = document.forms['searchForm'];
  // const inputSearch = form.elements['search'];




  // * Events
  renderTodoList(objOfTasks);
  form.addEventListener('submit', handleAddTodo);



  function renderTodoList(taskList) {
    if (!taskList) {
      console.error("Submit task list!");
      return;
    }

    const fragment = document.createDocumentFragment();
    Object.values(taskList).forEach(task => {
      const listItem = getTemplateTodo(task);
      fragment.appendChild(listItem);
    });
    listContainer.appendChild(fragment);
  }

  function getTemplateTodo({ id, title, description, status } = {}) {
    const listItem = document.createElement("div");
    listItem.classList.add('list__item');

    const card = document.createElement("div");
    card.classList.add('card');

    const cardBody = document.createElement("div");
    cardBody.classList.add('card__body');

    const cardTitle = document.createElement("h3");
    cardTitle.textContent = title
    cardTitle.classList.add('card__title');

    const cardText = document.createElement("p");
    cardText.textContent = description
    cardText.classList.add('card__text');

    const cardControl = document.createElement("div");
    cardControl.classList.add('card__control', 'group-btn');

    const editButton = document.createElement("button");
    editButton.textContent = "Edit"
    editButton.classList.add('btn', 'btn--sz-sm');

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete"
    deleteButton.classList.add('btn', 'btn--sz-sm');

    const holdButton = document.createElement("button");
    holdButton.textContent = "Hold"
    holdButton.classList.add('btn', 'btn--sz-sm');

    const doneButton = document.createElement("button");
    doneButton.textContent = "Hold"
    doneButton.classList.add('btn', 'btn--sz-sm');

    const cardFlag = document.createElement("div");
    cardFlag.textContent = (status == TODO_STATUS.pending) ? "Pending" : (status == TODO_STATUS.Hold) ? "Hold" : "Done";
    cardFlag.classList.add('card__flag');

    listItem.appendChild(card);
    card.appendChild(cardBody);
    card.appendChild(cardControl);
    card.appendChild(cardFlag);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);
    cardControl.appendChild(editButton);
    cardControl.appendChild(deleteButton);
    cardControl.appendChild(holdButton);
    cardControl.appendChild(doneButton);

    return listItem;
  }

  function handleAddTodo(e) {
    e.preventDefault();
    const titleValue = inputTitle.value;
    const descValue = inputDesc.value;

    if (!titleValue || !descValue) {
      alert('Please fill in the blank form fields');
      return;
    }
    const task = createNewTodo(titleValue, descValue);
    const listItem = getTemplateTodo(task);
    listContainer.insertAdjacentElement('afterbegin', listItem);
    form.reset();
  }

  function createNewTodo(title, description) {
    const newTodo = {
      title,
      description,
      status: TODO_STATUS.pending,
      id: `task-${Math.random() * 100}`,
    };

    objOfTasks[newTodo.id] = newTodo;

    return { ...newTodo };
  }

  function deleteTodo(e) {
    console.log(e.target)
  }


})(todos);