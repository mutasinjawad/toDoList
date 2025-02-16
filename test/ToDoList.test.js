const ToDoList = artifacts.require('./ToDoList.sol')

contract('ToDoList', (accounts) => {
    before(async () => {
        this.todoList = await ToDoList.deployed()
    })

    it('deploys successfully', async () => {
        const address = await this.todoList.address
        assert.notEqual(address, 0x0)
        assert.notEqual(address, '')
        assert.notEqual(address, null)
        assert.notEqual(address, undefined)
    })

    it('lists tasks', async () => {
        const address = window.userAccount
        const taskCount = await this.todoList.tasksCount(address)
        const task = await this.todoList.tasks(address, taskCount)
        assert.equal(task.id.toNumber(), taskCount.toNumber())
        assert.equal(task.content, 'This is your to do List!')
        assert.equal(task.completed, false)
        assert.equal(taskCount.toNumber(), 1)
    })

    it('creates tasks', async () => {
        const result = await this.todoList.createTask('A new task')
        const taskCount = await this.todoList.taskCount()
        assert.equal(taskCount, 2)
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), 2)
        assert.equal(event.content, 'A new task')
        assert.equal(event.completed, false)
    })

    it('toggles task completion', async () => {
        const address = window.userAccount
        const result = await this.todoList.toggleCompleted(1)
        const task = await this.todoList.tasks(address, 1)
        assert.equal(task.completed, true)
        const event = result.logs[0].args
        assert.equal(event.id.toNumber(), 1)
        assert.equal(event.completed, true)
    })
})