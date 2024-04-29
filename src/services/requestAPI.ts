import { NewRequestData } from 'src/interfaces/NewRequestData.interface'; // Define this interface based on your request data structure
import api from './api';
import Cookies from 'js-cookie';
import { Request } from 'src/types/request';

export const createRequest = async (data: Request) => {
  try {
    console.log('DATA USING', data.createdByUserId);
    const response = await api.post('/request', data);
    return response.data;
  } catch (error) {
    console.error('Error creating request:', error.message);
    throw error;
  }
};

export const updateRequest = async (requestId: string, data: Request) => {
  try {
    const response = await api.put(`/request/${requestId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating request-update:', error.message);
    throw error;
  }
};

export const uploadToBlockchain = async (requestId: string, data: FormData) => {
  try {
    const response = await api.put(`/request/uploadBlockchain/${requestId}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error updating request to blockchain:', error.message);
    throw error;
  }
};

export const updateRequestWithToken = async (requestId: string, data: Request, token: string) => {
  try {
    const response = await api.put(`/request/${requestId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating request with token:', error.message);
    throw error;
  }
};

export const verifyRequest = async (requestId: string, data: Request, token: string) => {
  try {
    const response = await api.put(`/request/verify/${requestId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error verifying request:', error.message);
    throw error;
  }
};

export const uploadImages = async (files: File[]) => {
  try {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    const response = await api.post('/request/uploadImages', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log("Response to upload", response);
    return response.data;
  } catch (error) {
    console.error('Error uploading images:', error.message);
    throw error;
  }
};
export const reviewRequest = async (
  requestId: string,
  data: any,
  type: 'MACHINING' | 'COATING'
) => {
  try {
    const response = await api.put(`/request/${requestId}`, data);
    return response.data;
  } catch (error) {
    console.error('Error updating request review:', error.message);
    throw error;
  }
};

export const deleteRequest = async (requestId: string) => {
  try {
    const response = await api.delete(`/request/${requestId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting request:', error.message);
    throw error;
  }
};

export const getRequestById = async (requestId: string) => {
  try {
    const response = await api.get(`/request/${requestId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching request:', error.message);
    throw error;
  }
};

export const getAllRequests = async () => {
  try {
    const response = await api.get('/request');
    return response.data;
  } catch (error) {
    console.error('Error fetching all requests:', error.message);
    throw error;
  }
};

export const getRequestsByCompany = async (companyId: string) => {
  try {
    const response = await api.get(`/request/byCompany/${companyId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching requests for company:', error.message);
    throw error;
  }
};

export const getRequestsByEmployee = async (token: string, userId: string) => {
  try {
    const response = await api.get(`/request/bySupplierEmployee/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching requests for user:', error.message);
    throw error;
  }
};
