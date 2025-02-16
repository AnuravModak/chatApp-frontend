import axios from 'axios';

const api=axios.create({
    baseURL:"http://localhost:8080",
});



export const fetchUsers=()=> api.get("/api/users/admin/all/users");
export const fetchUserById =(id)=> api.get(`/api/users/admin/user/${id}`);
export const fetchMessagesBetweenUsers =(senderId, receiverId)=> api.get(`/admin/getMessages/${senderId}/${receiverId}`);
export const sendMessage = (messageData) => api.post("/api/chat/send", messageData);
export const readReceipt = (id) => api.post("/read-receipt",id);
export const onlineStatus = (id, isOnline) => 
    api.post("/api/users/online-status", null, { params: { userId: id, isOnline } });

export const typingStatus = (senderId, receiverId, isTyping) => 
    api.post("/api/users/typing-status", null, { 
        params: { senderId, receiverId, isTyping } 
    });