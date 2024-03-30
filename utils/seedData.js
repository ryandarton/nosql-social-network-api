const { User, Thought } = require('../models');
const connection = require('../config/connection');

const seedData = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Thought.deleteMany({});

    // Create sample users
    const users = await User.insertMany([
      {
        username: 'john_doe',
        email: 'john@example.com',
      },
      {
        username: 'jane_smith',
        email: 'jane@example.com',
      },
      {
        username: 'jim_bob',
        email: 'jimbob@example.com',
      },
      {
        username: 'joe_bob',
        email: 'joebob@example.com',
      },
      {
        username: 'mary_jane',
        email: 'maryjane@example.com',
      },
      {
        username: 'bob_smith',
        email: 'bobsmith@example.com',
      },
      {
        username: 'sarah_doe',
        email: 'sarah@example.com',
      },
      {
        username: 'mike_jones',
        email: 'mikejones@example.com',
      },
    ]);

    // Create sample thoughts
    const thoughts = await Thought.insertMany([
      {
        thoughtText: 'I am amazed by the power of technology!',
        username: 'john_doe',
        userId: users[0]._id,
      },
      {
        thoughtText: 'Exploring the depths of the universe!',
        username: 'jane_smith',
        userId: users[1]._id,
      },
      {
        thoughtText: 'Coding is my superpower.',
        username: 'jim_bob',
        userId: users[2]._id,
      },
      {
        thoughtText: 'Dream big, buy a cat!',
        username: 'joe_bob',
        userId: users[3]._id,
      },
      {
        thoughtText: 'Nature is the best.',
        username: 'mary_jane',
        userId: users[4]._id,
      },
      {
        thoughtText: 'Creating art with lines of code is my jam.',
        username: 'bob_smith',
        userId: users[5]._id,
      },
      {
        thoughtText: 'Spreading positivity and love is what you should do.',
        username: 'sarah_doe',
        userId: users[6]._id,
      },
      {
        thoughtText: 'Zuckerburgers would taste goooood.',
        username: 'mike_jones',
        userId: users[7]._id,
      },
    ]);

    // Update users with created thoughts
    await User.updateMany({}, { $push: { thoughts: { $each: thoughts.map((thought) => thought._id) } } });

    console.log('Seed data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

connection.once('open', () => {
  seedData();
});
