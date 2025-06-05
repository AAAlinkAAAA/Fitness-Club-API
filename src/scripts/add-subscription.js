const { Subscription } = require('../models');

async function addSubscription() {
    try {
        const subscription = await Subscription.create({
            user_id: '188dc64f-9ec8-4738-a1dd-83a83e0212dd',
            type: 'premium',
            start_date: new Date(),
            end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            price: 99.99,
            status: 'active'
        });

        console.log('Subscription created:', subscription.toJSON());
    } catch (error) {
        console.error('Error creating subscription:', error);
    }
}

addSubscription(); 