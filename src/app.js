import { getDataFromApi, addTaskToApi, deleteTaskFromApi } from './data';

class PomodoroApp {
  constructor(options) {
    let { tableTbodySelector, taskFormSelector } = options;
    this.$tableTbody = document.querySelector(tableTbodySelector);
    this.$taskForm = document.querySelector(taskFormSelector);
    this.$taskFormInput = this.$taskForm.querySelector('input');
  }

  addTask(task) {
    addTaskToApi(task)
      .then((data) => data.json())
      .then((newTask) => {
        this.addTaskToTable(newTask);
      });
  }

  addTaskToTable(task, index) {
    const $newTaskEl = document.createElement('tr');
    $newTaskEl.innerHTML = `<th scope="row">${task.id}</th><td>${task.title} <td><button  id="${task.id}" class="delete-button">Delete</button></td>`;
    this.$tableTbody.appendChild($newTaskEl);

    this.$taskFormInput.value = '';
  }

  handleAddTask() {
    this.$taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const task = { title: this.$taskFormInput.value };
      this.addTask(task);
    });
  }

  fillTasksTable() {
    getDataFromApi().then((currentTasks) => {
      currentTasks.forEach((task, index) => {
        this.addTaskToTable(task, index + 1);
      });
      this.deleteTask();
    });
  }

  deleteTask() {
    const $deleteButton = document.querySelectorAll('.delete-button');
    for (let i = 0; i < $deleteButton.length; i++) {
      $deleteButton[i].addEventListener('click', (e) => {
        deleteTaskFromApi($deleteButton[i].id).then((res) => {
          if (res.status == '200') {
            const $newTaskEl = this.$tableTbody.querySelectorAll('tr');
            $newTaskEl.forEach((tr) => {
              tr.remove();
            });
            this.fillTasksTable();
          }
        });
      });
    }
  }
  init() {
    this.fillTasksTable();
    this.handleAddTask();
  }
}

export default PomodoroApp;
