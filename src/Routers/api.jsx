import axios from 'axios';

const api=axios.create({
    baseURL:"http://localhost:8080",
});



export const fetchUsers=()=> api.get("/api/users/admin/all/users");
export const fetchUserById =(id)=> api.get(`/api/users/admin/user/${id}`);
export const fetchMessagesBetweenUsers =(senderId, receiverId)=> api.get(`/admin/getMessages/${senderId}/${receiverId}`);
export const sendMessage = (messageData) => api.post("/api/chat/send", messageData);