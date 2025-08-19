// seed.cjs
const { PrismaClient } = require('../generated/prisma'); // or '@prisma/client' if you switch to default
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt')

const prisma = new PrismaClient();

const plainPassword = "test123";

async function main() {
  // Create fake users
  const users = [];
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  for (let i = 0; i < 10; i++) {
    const user = await prisma.user.create({
      data: {
        email: faker.internet.email(),
        username: faker.internet.userName(),
        gender: faker.name.sexType(),
        hashedpass: hashedPassword,
        birthday: faker.date.birthdate({ min: 18, max: 45, mode: 'age' }).toISOString(),
        bio: faker.lorem.sentence(),
        hobbies: faker.word.words(3),
        profilePic: faker.image.avatar(),
      },
    });
    users.push(user);
  }

  // Create posts for each user
  for (const user of users) {
    await prisma.post.create({
      data: {
        caption: faker.lorem.sentence(),
        photo: faker.image.urlPicsumPhotos(),
        created_at: faker.date.recent(),
        author: { connect: { id: user.id } },
      },
    });
  }

  // Send random messages between users
  for (let i = 0; i < 15; i++) {
    const sender = faker.helpers.arrayElement(users);
    let receiver = faker.helpers.arrayElement(users);
    while (receiver.id === sender.id) {
      receiver = faker.helpers.arrayElement(users);
    }

    await prisma.messages.create({
      data: {
        senderid: sender.id,
        receiverid: receiver.id,
        text: faker.lorem.sentence(),
        time: faker.date.recent(),
      },
    });
  }

  // Add some friend requests
  for (let i = 0; i < 5; i++) {
    const request_by = faker.helpers.arrayElement(users);
    let request_to = faker.helpers.arrayElement(users);
    while (request_to.id === request_by.id) {
      request_to = faker.helpers.arrayElement(users);
    }

    await prisma.friends.create({
      data: {
        request_by: request_by.id,
        request_to: request_to.id,
        pending: true,
        accepted: false,
      },
    });
  }
}

main()
  .then(() => {
    console.log('🌱 Seeding complete!');
    return prisma.$disconnect();
  })
  .catch((e) => {
    console.error(e);
    return prisma.$disconnect();
  });
