const Main = {
    tasks: [],
    init: function () {
        this.cacheSelectors();
        this.getStoraged();
        this.bindEvents();
        this.buildTasks();
    },
    cacheSelectors: function () {
        this.$checkButtons = document.querySelectorAll('.check');
        this.$inputTask = document.querySelector('#inputTask');
        this.$list = document.querySelector('#list');
        this.$removeButtons = document.querySelectorAll('.remove');
    },
    bindEvents: function () {
        const self = this;
        this.$checkButtons.forEach(element => {
            element.onclick = self.Events.checkButton_click.bind(self);
        });
        this.$inputTask.onkeypress = self.Events.inputTask_keypress.bind(this);
        this.$removeButtons.forEach(function (element) {
            element.onclick = self.Events.removeButtons_click.bind(self);
        });
    },

    getStoraged: function () {
        const tasks = localStorage.getItem('tasks');
        if (tasks === null)
            return;
        else {
            this.tasks = JSON.parse(tasks);
        }
    },
    getTaskHtml: function (task, isDone) {
        return `
        <li class="${isDone ? 'done' : ''}" data-task="${task}">
            <div class="check"></div>
            <label class="task">
                ${task}
            </label>
            <button class="remove"></button>
        </li>
        `
    },
    buildTasks: function () {
        let html = '';
        this.tasks.forEach(task => {
            html += this.getTaskHtml(task.task, task.done);
        })
        this.$list.innerHTML = html;
        this.cacheSelectors();
        this.bindEvents();
    },

    Events: {
        checkButton_click: function (e) {
            const li = e.target.parentElement;
            const value = li.dataset['task'];
            const isDone = li.classList.contains('done');
            const newTasksState = this.tasks.map(item => {
                if (item.task === value)
                    item.done = !isDone;
                return item;
            })
            localStorage.setItem('tasks', JSON.stringify(newTasksState));

            if (li.classList.contains('done'))
                li.classList.remove('done');
            else
                li.classList.add('done');
        },
        inputTask_keypress: function (e) {
            const key = e.key;
            const value = e.target.value;
            if (key === 'Enter') {
                this.$list.innerHTML += this.getTaskHtml(value, false);
                e.target.value = '';
                this.cacheSelectors();
                this.bindEvents();
                const obj = [
                    {
                        task: value,
                        done: false,
                    },
                    ...this.tasks,
                ]
                localStorage.setItem('tasks', JSON.stringify(obj));
            }
        },
        removeButtons_click: function (e) {
            const li = e.target.parentElement;
            const value = li.dataset['task'];
            const newItems = this.tasks.filter(task => task.task != value);
            localStorage.setItem('tasks', JSON.stringify(newItems));
            li.classList.add('removed');
            setTimeout(() => {
                li.classList.add('hidden');
            }, 300);
        }
    }
}
Main.init();