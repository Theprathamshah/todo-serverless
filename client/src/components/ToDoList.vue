
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const header = ref('To Do List');
const newTodo = ref("");
const priority = ref(false);
const items = ref<Todo[]>([]);

type Todo = {
    id: string,
    text: string,
    isCompleted: boolean,
    isHighPriority: boolean,
};

const props = defineProps<{ greetings: string }>();

function toggleCompleted(todo: Todo) {
    todo.isCompleted = !todo.isCompleted;
}

async function deleteTodo(id: string) {
    console.log(id);
    try {
        
        const response = await axios.delete(`https://c1atfnipk4.execute-api.ap-south-1.amazonaws.com/dev/todos/${id}`);
        items.value = items.value.filter((item) => item.id !== id);
    } catch (error) {
        console.error('Error deleting todo:', error);
    }
}

async function markCompleted(todo:Todo) {
    try {
        const response = await axios.put(`https://c1atfnipk4.execute-api.ap-south-1.amazonaws.com/dev/todos/${todo.id}`, {text:todo.text, isCompleted: !todo.isCompleted });
        

        const updatedTodo = response.data; 

        const todoIndex = items.value.findIndex(item => item.id === todo.id);
        if (todoIndex !== -1) {
            items.value[todoIndex].isCompleted = !todo.isCompleted;
        } else {
            console.error('Todo not found in local state');
        }

    } catch (error) {
        console.error('Error marking todo as completed:', error);
    }
}

async function addTodo() {
    if (newTodo.value.trim() === "") return;

    try {
        const newTodoItem: Omit<Todo, 'id'> = { 
            text: newTodo.value, 
            isCompleted: false, 
            isHighPriority: priority.value 
        };

        // Send POST request to add new todo
        const response = await axios.post<Todo>(`https://c1atfnipk4.execute-api.ap-south-1.amazonaws.com/dev/todos`, newTodoItem);

        // Update local state with newly created todo
        items.value.push(response.data);

        // Clear input fields
        newTodo.value = "";
        priority.value = false;

    } catch (error) {
        console.error('Error adding todo:', error);
    }
}

// Fetch todos from the API
async function fetchTodos() {
    try {
        const response = await axios.get('https://c1atfnipk4.execute-api.ap-south-1.amazonaws.com/dev/todos');
        console.log('Response data is ', response.data.data);
        const todos = response.data.data;
        items.value = todos.map((item: Todo) => ({
            id: item.id,
            text: item.text, 
            isCompleted: item.isCompleted,
            isHighPriority: false
        })) as Todo[];
    } catch (error) {
        console.error("Error fetching todos:", error);
    }
}

onMounted(() => {
    fetchTodos();
});
</script>

<template>
    <h1>{{ props.greetings }}</h1>
    <h3>{{ header }}</h3>
    <form class="add-item-form" @submit.prevent="addTodo">
        <input v-model="newTodo" placeholder="Add new Todo" type="text">
        <label>
            <input type="checkbox" v-model="priority"> High Priority
        </label>
        <button class="btn btn-primary">Add Item</button>
    </form>
    <ul>
        <li v-for="item in items" :key="item.id">
            <span :class="{ completed: item.isCompleted }" @click="markCompleted(item)">
                {{ item.text }}
                <span v-if="item.isHighPriority"> (High Priority) </span>
            </span>
            <button @click="deleteTodo(item.id)" class="btn btn-danger">Delete</button>
        </li>
    </ul>
</template>

<style>
.completed {
    text-decoration: line-through;
}
</style>
