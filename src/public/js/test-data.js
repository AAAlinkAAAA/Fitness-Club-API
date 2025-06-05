// src/public/js/test-data.js
const classesData = [
    { name: 'Yoga Basics', description: 'Beginner yoga class', duration: 60, type: 'yoga' },
    { name: 'Cardio Blast', description: 'High-intensity cardio', duration: 45, type: 'cardio' },
    { name: 'Strength Training', description: 'Full-body strength', duration: 60, type: 'fitness' }
  ];
  
  const usersData = [
    {
      first_name: 'John',
      last_name: 'Doe',
      email: 'client@fitnesscenter.com',
      password: 'password123',
      role: 'client',
      phone: '1234567890'
    },
    {
      first_name: 'Jane',
      last_name: 'Smith',
      email: 'trainer@fitnesscenter.com',
      password: 'trainer123',
      role: 'trainer',
      phone: '0987654321'
    }
  ];
  
  const schedulesData = [
    { date: new Date(Date.now() + 86400000).toISOString(), classIndex: 0, trainerEmail: 'trainer@fitnesscenter.com' },
    { date: new Date(Date.now() + 2 * 86400000).toISOString(), classIndex: 1, trainerEmail: 'trainer@fitnesscenter.com' },
    { date: new Date(Date.now() + 3 * 86400000).toISOString(), classIndex: 2, trainerEmail: 'trainer@fitnesscenter.com' }
  ];
  
  async function checkEmail(email) {
    console.log('Checking email:', email);
    try {
      const response = await fetch('/api/users/check-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to check email');
      }
  
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error('Error checking email:', error);
      throw error;
    }
  }
  
  async function createTestUser(user) {
    try {
      console.log('Checking email:', user.email);
      const emailExists = await checkEmail(user.email);
      if (emailExists) {
        console.log('User already exists:', user.email);
        const response = await fetch('/api/users', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const users = await response.json();
        const existingUser = users.find(u => u.email === user.email);
        return existingUser || null;
      }
  
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create user');
      }
  
      const data = await response.json();
      console.log('Created user:', user.email);
      return data.user;
    } catch (error) {
      console.error(`Error creating user: ${user.email}`, error);
      throw error;
    }
  }
  
  async function createTestClass(classData) {
    try {
      const checkResponse = await fetch('/api/classes', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!checkResponse.ok) {
        throw new Error('Failed to fetch classes');
      }
      const existingClasses = await checkResponse.json();
      const existingClass = existingClasses.find(c => c.name === classData.name);
      if (existingClass) {
        console.log('Class already exists:', classData.name);
        return existingClass;
      }
  
      const response = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(classData)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create class');
      }
  
      const data = await response.json();
      console.log('Created class:', classData.name);
      return data;
    } catch (error) {
      console.error(`Error creating class: ${classData.name}`, error);
      throw error;
    }
  }
  
  async function createTestSchedule(scheduleData, classes, users) {
    try {
      const classItem = classes[scheduleData.classIndex];
      const trainer = users.find(u => u && u.email === scheduleData.trainerEmail);
  
      if (!classItem || !trainer) {
        throw new Error('Class or trainer not found');
      }
  
      const checkResponse = await fetch('/api/schedules', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!checkResponse.ok) {
        throw new Error('Failed to fetch schedules');
      }
      const existingSchedules = await checkResponse.json();
      const existingSchedule = existingSchedules.find(s => 
        s.class_id === classItem.class_id && 
        new Date(s.date).toISOString() === new Date(scheduleData.date).toISOString()
      );
      if (existingSchedule) {
        console.log('Schedule already exists for:', classItem.name);
        return existingSchedule;
      }
  
      const response = await fetch('/api/schedules', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: scheduleData.date,
          class_id: classItem.class_id,
          trainer_id: trainer.user_id
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create schedule');
      }
  
      const data = await response.json();
      console.log('Created schedule for:', classItem.name);
      return data;
    } catch (error) {
      console.error('Error creating schedule:', error);
      throw error;
    }
  }
  
  async function initializeTestData() {
    console.log('Starting test data initialization');
    try {
      // Create users
      const createdUsers = [];
      for (const user of usersData) {
        const createdUser = await createTestUser(user);
        if (createdUser) {
          createdUsers.push(createdUser);
        }
      }
  
      // Create classes
      const createdClasses = [];
      for (const classData of classesData) {
        const createdClass = await createTestClass(classData);
        if (createdClass) {
          createdClasses.push(createdClass);
        }
      }
  
      // Create schedules
      for (const schedule of schedulesData) {
        await createTestSchedule(schedule, createdClasses, createdUsers);
      }
  
      console.log('Test data initialization completed');
    } catch (error) {
      console.error('Error initializing test data:', error);
    }
  }
  
  document.addEventListener('DOMContentLoaded', initializeTestData);