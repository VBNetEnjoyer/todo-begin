// принимает title и возвращает h2 заголовок
function createAppTitle(title){
    let appTitle = document.createElement('h2');
    appTitle.textContent = title;
    return appTitle;
}

// Создает форму с встроенным поведением кнопки
// возвращает форму, кнопку и инпут
function createForm(){
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonsWrapper = document.createElement('div');
    let button = document.createElement('button');

    form.classList.add('input-group','mb-3');
    input.classList.add('form-control');
    input.placeholder = "Введите название нового дела";
    buttonsWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = "Сохранить"

    form.append(input);
    form.append(buttonsWrapper);
    buttonsWrapper.append(button);

    button.disabled = true;

    input.addEventListener('input',()=>{
        if(input.value == ''){
            button.disabled = true;
        } else {
            button.disabled = false;
        }
    })

    return{
        form,
        button,
        input,
    }
}

// Создает пустой лист <ul></ul>
function createTodoList(){
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
}

/*
    Создает тудушку
    Первым аргументом передается объект типа {name: String, done: Boolean}
    Второй аргумент localStorage в который будеи запинсана тудушка
    Возвращает <li></li>
*/
function createTodoItem(todo, data){
    const item = document.createElement('li');

    const buttonGroup = document.createElement('div');
    const buttonDone = document.createElement('button');
    const buttonDelete = document.createElement('delete');

    item.classList.add('d-flex','list-group-item','justify-content-between','align-items-center');
    item.textContent = todo.name;

    buttonGroup.classList.add('btn-group','btn-group-sm');
    buttonDelete.classList.add('btn','btn-danger');
    buttonDelete.textContent = 'Удалить'
    buttonDone.classList.add('btn','btn-success')
    buttonDone.textContent = 'Готово'

    buttonGroup.append(buttonDelete);
    buttonGroup.append(buttonDone);

    if(todo.done){
        item.classList.add('list-group-item-success')
    }

    buttonGroup.addEventListener('click',(e)=>{
        if(e.target.closest('.btn-success')){
            item.classList.toggle('list-group-item-success')
            todo.done = todo.done ? false : true;
            data.updateElement(todo)
        }
        if (e.target.closest('.btn-danger')){
            if(confirm("Вы действительно хотите удалить задачу?")){
                data.deleteElement(todo)
                item.remove();
            }
        }
    })

    item.append(buttonGroup)

    return item
    
}

/*
    Принимает ключ для localStorage
    Возвращает методы для работы с данными
    Если ключ ранее не использовался создается новый key:value в localStorage
*/
function createStorage(key){
    let data = null;

    if(localStorage.getItem(key) == null){
        data = []
    } else {
        data = JSON.parse(localStorage.getItem(key))
    }

    function addElement(element){
        for(let i in data){
            if(element.name == data[i].name) return
        }
        data.push(element)
        updateLocalStorage(data)
    }
    
    function updateElement(element){
        for(let i in data){
            if(element.name == data[i].name){
                data[i] = element;
            }
        }
        updateLocalStorage(data)
    }

    function deleteElement(element){
        for(let i in data){
            if(element.name == data[i].name){
                console.log("insideDeleteElement");
                data.splice(i, 1);
            }
        }
        updateLocalStorage(data)
    }

    function updateLocalStorage(item){
        localStorage.setItem(key, JSON.stringify(item));
    }

    function getData(){
        return data;
    }

    return{
        addElement,
        deleteElement,
        updateElement,
        getData,
    }
}

/*  
    Инициализация приложения
    container - css selector куда будет вложенно приложение
    title - заголовок для страницы + ключ для localStorage
    todos - тудушки по умолчания; {name: String, done: Boolean}
*/
function createToDoApp(container, title="Список дел", todos=[]){
    const app = document.querySelector(container);
    const todoList = createTodoList()
    const todoItemForm = createForm()
    const data = createStorage(title);
    
    for(let todoFromConstructor of todos){
        data.addElement(todoFromConstructor)
    }
    if(data.getData().length > 0){
        for(let todoFromData of data.getData()){
            todoList.append(createTodoItem(todoFromData, data));
        }
    }
    
    app.append(createAppTitle(title));
    app.append(todoItemForm.form);
    app.append(todoList);

    todoItemForm.form.addEventListener('submit',(e)=>{
        e.preventDefault();

        const todoItem = {name: todoItemForm.input.value, done: false}
        const todoItemElement = createTodoItem(todoItem, data);
        data.addElement(todoItem)

        todoList.append(todoItemElement);

        todoItemForm.input.value = '';
    })

}

// доступ к инициализации в любой точке
window.createToDoApp = createToDoApp;
