// SPDX-License-Identifier: MIT
pragma solidity ^0.8.16;

contract ToDoList {
    uint public taskCount;

    struct Task {
        uint id;
        string content;
        bool completed;
    }

    mapping(uint => Task) public tasks;

    event TaskCompleted(
        uint id,
        string content,
        bool completed
    );

    constructor() {
        createTask("This is your to do List!");
    }
    function createTask(string memory _content) public {
        taskCount ++;
        tasks[taskCount] = Task(taskCount, _content, false);
        emit TaskCompleted(taskCount, _content, false);
    }
}