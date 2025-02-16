// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract ToDoList {

    struct Task {
        uint id;
        string content;
        bool completed;
    }

    mapping(address => uint) public tasksCount;
    mapping(address => mapping(uint => Task)) public tasks;

    event TaskCompleted(
        uint id,
        bool completed
    );

    event TaskCreated(
        uint id,
        string content,
        bool completed
    );

    function createTask(string memory _content) public {
        tasksCount[msg.sender] ++;
        tasks[msg.sender][tasksCount[msg.sender]] = Task(tasksCount[msg.sender], _content, false);
        emit TaskCreated(tasksCount[msg.sender], _content, false);
    }

    function toggleCompleted(uint _id) public {
        Task memory _task = tasks[msg.sender][_id];
        _task.completed = !_task.completed;
        tasks[msg.sender][_id] = _task;
        emit TaskCompleted(_id, _task.completed);
    }
}