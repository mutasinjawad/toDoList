App = {
    loading: false,
    contracts: {},

    load: async () => {
        await App.loadContract()
        await App.render()
    },

    loadContract: async () => {
        const todoList = await $.getJSON('ToDoList.json')
        App.contracts.ToDoList = TruffleContract(todoList)
        App.contracts.ToDoList.setProvider(window.ethereum)
        App.todoList = await App.contracts.ToDoList.deployed()
    },

    render: async () => {
        if (App.loading) {
            return
        }

        App.setLoading(true)

        await App.renderTasks()

        App.setLoading(false)
    },

    renderTasks: async () => {
        const account = window.userAccount
        const taskCount = await App.todoList.tasksCount(account)
        const $taskTemplate = $('.taskTemplate')
        
        for (var i = 1; i <= taskCount; i++) {
            const task = await App.todoList.tasks(account, i)
            const taskId = task[0].toNumber()
            const taskContent = task[1]
            const taskCompleted = task[2]
            
            const $newTaskTemplate = $taskTemplate.clone()
            $newTaskTemplate.find('.content').html(taskContent)
            $newTaskTemplate.find('input')
            .prop('name', taskId)
            .prop('checked', taskCompleted)
            .on('click', App.toggleCompleted)
            
            if (taskCompleted) {
                $('#completedTaskList').append($newTaskTemplate)
            } else {
                $('#taskList').append($newTaskTemplate)
            }
            
            $newTaskTemplate.show()
        }
    },
    
    toggleCompleted: async (e) => {
        console.log("Pressed")
        App.setLoading(true)
        const taskId = e.target.name
        
        if (!window.userAccount) {
            console.error("User account not found!")
            App.setLoading(false)
            return
        }
    
        await App.todoList.toggleCompleted(taskId, { from: window.userAccount })
        window.location.reload()
    },
    
    createTask: async () => {
        App.setLoading(true)
        const content = $('#newTask').val()
        await App.todoList.createTask(content, { from: window.userAccount })
        window.location.reload()
    },

    setLoading: (boolean) => {
        App.loading = boolean
        const loader = $('#loader')
        const content = $('#content')

        if (boolean) {
            loader.show()
            content.hide()
        } else {
            loader.hide()
            content.show()
        }  
    }

}

$(() => {
    $(document).ready(() => {
        App.load()
    })
})