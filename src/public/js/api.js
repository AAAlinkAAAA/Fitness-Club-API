// Базовый URL для API запросов
const API_BASE_URL = 'http://localhost:3000';

// Общий метод для выполнения запросов к API
async function request(endpoint, options = {}) {
    try {
        console.log('Making request to:', `${API_BASE_URL}${endpoint}`);
        
        const user = auth.getUser();
        const headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...options.headers
        };

        // Add user_id to request body if user is logged in
        if (user && user.user_id) {
            if (options.body) {
                const body = JSON.parse(options.body);
                body.user_id = user.user_id;
                options.body = JSON.stringify(body);
            } else if (options.method !== 'GET') {
                options.body = JSON.stringify({ user_id: user.user_id });
            }
        }

        console.log('Request options:', options);

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Error response:', errorText);
            throw new Error(`Server error: ${response.status} ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            console.log('Response data:', data);
            return data;
        }
        const text = await response.text();
        console.log('Response text:', text);
        return text;
    } catch (error) {
        console.error('API request error:', error);
        throw error;
    }
}

// API клиент для взаимодействия с сервером
const API = {
    // Методы для работы с пользователями
    users: {
        register: (userData) => request('/api/users', {
            method: 'POST',
            body: JSON.stringify(userData)
        }),
        login: (credentials) => request('/api/users/login', {
            method: 'POST',
            body: JSON.stringify(credentials)
        }),
        getProfile: () => request('/api/users/profile'),
        updateProfile: (userData) => request('/api/users/profile', {
            method: 'PUT',
            body: JSON.stringify(userData)
        })
    },

    // Методы для работы с классами
    classes: {
        getAll: () => request('/api/classes'),
        getById: (id) => request(`/api/classes/${id}`),
        create: (classData) => request('/api/classes', {
            method: 'POST',
            body: JSON.stringify(classData)
        }),
        update: (id, classData) => request(`/api/classes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(classData)
        }),
        delete: (id) => request(`/api/classes/${id}`, {
            method: 'DELETE'
        })
    },

    // Методы для работы с расписанием
    schedules: {
        getSchedule: () => request('/api/schedules'),
        getById: (id) => request(`/api/schedules/${id}`),
        create: (scheduleData) => request('/api/schedules', {
            method: 'POST',
            body: JSON.stringify(scheduleData)
        }),
        update: (id, scheduleData) => request(`/api/schedules/${id}`, {
            method: 'PUT',
            body: JSON.stringify(scheduleData)
        }),
        delete: (id) => request(`/api/schedules/${id}`, {
            method: 'DELETE'
        })
    },

    // Методы для работы с бронированиями
    bookings: {
        getAll: () => request('/api/bookings'),
        getById: (id) => request(`/api/bookings/${id}`),
        create: (scheduleId) => request('/api/bookings', {
            method: 'POST',
            body: JSON.stringify({ schedule_id: scheduleId })
        }),
        cancel: (id) => request(`/api/bookings/${id}/cancel`, {
            method: 'POST'
        })
    },

    // Методы для работы с подписками
    subscriptions: {
        getAll: () => request('/api/subscriptions'),
        getMySubscriptions: () => request('/api/subscriptions/my-subscriptions'),
        getById: (id) => request(`/api/subscriptions/${id}`),
        create: (data) => request('/api/subscriptions', {
            method: 'POST',
            body: JSON.stringify(data)
        }),
        update: (id, data) => request(`/api/subscriptions/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        }),
        cancel: (id) => request(`/api/subscriptions/${id}/cancel`, {
            method: 'PATCH'
        })
    },

    // Методы для работы с платежами
    payments: {
        create: (paymentData) => request('/api/payments', {
            method: 'POST',
            body: JSON.stringify(paymentData)
        }),
        getById: (id) => request(`/api/payments/${id}`)
    },

    // Методы для работы с уведомлениями
    notifications: {
        getAll: () => request('/api/notifications'),
        markAsRead: (id) => request(`/api/notifications/${id}/read`, {
            method: 'POST'
        })
    }
};

// Экспорт API
window.API = API; 