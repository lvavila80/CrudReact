import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import axios from 'axios';
import config from './config'; // Importar configuración
import reportWebVitals from './reportWebVitals';

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Lógica de CRUD
const apiUrl = config.apiUrl; // Usar la URL del API desde la configuración
let posts = [];
let editId = null;

const fetchPosts = async () => {
  try {
    const response = await axios.get(apiUrl);
    posts = response.data.slice(0, 10);
    renderPosts();
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const renderPosts = () => {
  const postsList = document.getElementById('posts-list');
  postsList.innerHTML = '';
  posts.forEach(post => {
    const li = document.createElement('li');
    const title = document.createElement('h2');
    title.textContent = post.title;
    const body = document.createElement('p');
    body.textContent = post.body;
    const editButton = document.createElement('button');
    editButton.textContent = 'Editar';
    editButton.onclick = () => handleEdit(post);
    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    deleteButton.onclick = () => deletePost(post.id);
    li.append(title, body, editButton, deleteButton);
    postsList.appendChild(li);
  });
};

const createPost = async (title, body) => {
  try {
    const response = await axios.post(apiUrl, { title, body });
    posts.push(response.data);
    renderPosts();
  } catch (error) {
    console.error('Error creating post:', error);
  }
};

const updatePost = async (id, title, body) => {
  try {
    const updatedPost = { id, title, body };
    posts = posts.map(post => post.id === id ? updatedPost : post);
    renderPosts();
    editId = null;
  } catch (error) {
    console.error('Error updating post:', error);
    alert('Failed to update post. Please try again.');
  }
};

const deletePost = async (id) => {
  try {
    await axios.delete(`${apiUrl}/${id}`);
    posts = posts.filter(post => post.id !== id);
    renderPosts();
  } catch (error) {
    console.error('Error deleting post:', error);
  }
};

const handleEdit = (post) => {
  document.getElementById('title-input').value = post.title;
  document.getElementById('body-input').value = post.body;
  editId = post.id;
  document.getElementById('crud-submit').textContent = 'Actualizar';
};

const handleSubmit = (e) => {
  e.preventDefault();
  const title = document.getElementById('title-input').value;
  const body = document.getElementById('body-input').value;
  if (editId) {
    updatePost(editId, title, body);
    document.getElementById('crud-submit').textContent = 'Crear';
  } else {
    createPost(title, body);
  }
  document.getElementById('title-input').value = '';
  document.getElementById('body-input').value = '';
};

document.getElementById('crud-form').addEventListener('submit', handleSubmit);

fetchPosts();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
