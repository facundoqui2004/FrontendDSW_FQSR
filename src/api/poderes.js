const API_URL = 'http://localhost:3000/api/poderes';

// Obtener todos los poderes
export const getPoderes = async () => {
  try {
    const response = await fetch(API_URL, {
      // credentials: 'include' // TEMPORALMENTE DESHABILITADO - Problema de CORS
    });
    if (!response.ok) {
      throw new Error('Error al obtener poderes');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en getPoderes:', error);
    throw error;
  }
};

// Obtener un poder por ID
export const getPoderById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      // credentials: 'include' // TEMPORALMENTE DESHABILITADO - Problema de CORS
    });
    if (!response.ok) {
      throw new Error('Error al obtener el poder');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en getPoderById:', error);
    throw error;
  }
};

// Crear un nuevo poder
export const createPoder = async (poderData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      // credentials: 'include', // TEMPORALMENTE DESHABILITADO - Problema de CORS
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(poderData),
    });
    if (!response.ok) {
      throw new Error('Error al crear el poder');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en createPoder:', error);
    throw error;
  }
};

// Actualizar un poder
export const updatePoder = async (id, poderData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      // credentials: 'include', // TEMPORALMENTE DESHABILITADO - Problema de CORS
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(poderData),
    });
    if (!response.ok) {
      throw new Error('Error al actualizar el poder');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en updatePoder:', error);
    throw error;
  }
};

// Eliminar un poder
export const deletePoder = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      // credentials: 'include', // TEMPORALMENTE DESHABILITADO - Problema de CORS
    });
    if (!response.ok) {
      throw new Error('Error al eliminar el poder');
    }
    return await response.json();
  } catch (error) {
    console.error('Error en deletePoder:', error);
    throw error;
  }
};