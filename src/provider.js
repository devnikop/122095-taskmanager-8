import {generateId, objectToArray} from './util';
import ModelTask from './model-task';

export class Provider {
  constructor({api, store}) {
    this._api = api;
    this._store = store;
    this._needSync = false;
  }

  updateTask({id, data}) {
    if (this._isOnline()) {
      return this._api.updateTask({id, data})
      .then((task) => {
        this._store.setItem({key: task.id, item: task.toRAW()});
        return task;
      });
    } else {
      const task = data;
      this._needSync = true;
      this._store.setItem({key: task.id, item: task});
      return Promise.resolve(ModelTask.parseTask(task));
    }
  }

  createTask({task}) {
    if (this._isOnline()) {
      return this._api.createTask({task})
      .then((currentTask) => {
        this._store.setItem({key: currentTask.id, item: currentTask.toRAW()});
        return currentTask;
      });
    } else {
      task.id = generateId();
      this._needSync = true;

      this._store.setItem({key: task.id, item: task});
      return Promise.resolve(ModelTask.parseTask(task));
    }

  }

  deleteTask({id}) {
    if (this._isOnline()) {
      return this._api.deleteTask({id})
      .then(() => {
        this._store.removeItem({key: id});
      });
    } else {
      this._needSync = true;
      this._store.removeItem({key: id});
      return Promise.resolve(true);
    }
  }

  getTasks() {
    if (this._isOnline()) {
      return this._api.getTasks()
      .then((tasks) => {
        tasks.map((it) => this._store.setItem({key: it.id, item: it.toRAW()}));
        return tasks;
      });
    } else {
      const rawTasksMap = this._store.getAll();
      const rawTasks = objectToArray(rawTasksMap);
      const tasks = ModelTask.parseTasks(rawTasks);

      return Promise.resolve(tasks);
    }
  }

  syncTasks() {
    return this._api.syncTasks({tasks: objectToArray(this._store.getAll())});
  }

  _isOnline() {
    return window.navigator.onLine;
  }
}
