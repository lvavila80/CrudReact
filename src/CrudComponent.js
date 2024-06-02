import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CrudComponent = () => {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [editId, setEditId] = useState(null);

  // URL base de la API de JSONPlaceholder
  const apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  // Función para cargar los posts al montar el componente
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await axios.get(apiUrl);
      setPosts(response.data.slice(0, 10)); // Limitamos a 10 posts para el ejemplo
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Función para crear un nuevo post
  const createPost = async () => {
    try {
      const response = await axios.post(apiUrl, { title, body });
      setPosts([...posts, response.data]); // Agrega el nuevo post al estado
      setTitle('');
      setBody('');
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  // Función para actualizar un post existente
  const updatePost = async () => {
    if (editId) {
        try {
            // Simula una respuesta exitosa de PUT
            const updatedPost = { id: editId, title, body };
            const updatedPosts = posts.map(post => post.id === editId ? updatedPost : post);
            setPosts(updatedPosts); // Actualiza el estado con el post modificado
            setTitle('');
            setBody('');
            setEditId(null);
            console.log('Post updated successfully:', updatedPost);
        } catch (error) {
            console.error('Error updating post:', error);
            alert('Failed to update post. Please try again.'); // Aviso simple al usuario
        }
    }
  };

  // Función para eliminar un post
  const deletePost = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      const filteredPosts = posts.filter(post => post.id !== id);
      setPosts(filteredPosts); // Actualiza el estado eliminando el post
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  // Manejador de envíos de formularios para crear o actualizar posts
  const handleSubmit = (e) => {
    e.preventDefault();
    if (editId) {
      updatePost();
    } else {
      createPost();
    }
  };

  // Prepara el formulario para actualizar un post
  const handleEdit = (post) => {
    setTitle(post.title);
    setBody(post.body);
    setEditId(post.id);
  };

  return (
    <div>
      <h1>CRUD con React y API</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Cuerpo"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />
        <button type="submit">{editId ? 'Actualizar' : 'Crear'}</button>
      </form>
      <ul>
        {posts.map(post => (
          <li key={post.id}>
            <h2>{post.title}</h2>
            <p>{post.body}</p>
            <button onClick={() => handleEdit(post)}>Editar</button>
            <button onClick={() => deletePost(post.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CrudComponent;
