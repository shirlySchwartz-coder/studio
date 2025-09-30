import axios from 'axios';
import { API_URL } from './constants';

export const uploadImage = async (file: File): Promise<string> => { 
    const formData = new FormData();
    formData.append('image', file);
    
    const token = localStorage.getItem('access_token');
    if (!token) {
        throw new Error('Authentication required.');
    }

    try {
        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
            },
        });
        return response.data.imageUrl; // Assuming the server responds with { imageUrl: '...' }
    } catch (error) {
        console.error('Image upload failed:', error);
        throw new Error('Image upload failed.');
    }
}