import { faker } from "@faker-js/faker";
import { UserModel } from './model/User';
import { MyListModel } from './model/Mylist';
import { ReminderModel } from './model/Reminder';
import { db } from './db';
import { reset } from 'drizzle-seed';
import * as schema from "./schema";

const main = async () => {
  console.log("Resetting schema");
  await reset(db, schema);
  
  console.log("Seed start");
  
  const password = await Bun.password.hash("12345678", {
    algorithm: "bcrypt",
    cost: 10
  });
  
  for (let i = 0; i < 2; i++) {
    console.log(`Seed user ${i + 1}`);
    const makeUser = await UserModel.create({
      email: faker.internet.email(),
      fullName: faker.person.fullName(),
      password,
      phone: faker.phone.number({ style: 'international'}),
    });
    
    if (i === 0) {
      
      console.log(`Seed list`);
      const makeFirstList = await MyListModel.create({
        title: "One Piece",
        userId: makeUser.id,
        episode: 100,
        image: "https://elexmedia.s3.amazonaws.com/product/9789792041224.jpg"
      });
      
      const makeSecondList = await MyListModel.create({
        title: "Solo Leveling",
        userId: makeUser.id,
        episode: 5,
        image: "https://play.google.com/books/publisher/content/images/frontcover/IF0QEAAAQBAJ?fife=w240-h345"
      });
      
      console.log(`Seed reminder`);
      await ReminderModel.create({
        userId: makeUser.id,
        listId: makeFirstList.id,
        waitingType: "episode",
        onEpisode: 110
      });
      
      await ReminderModel.create({
        userId: makeUser.id,
        listId: makeSecondList.id,
        waitingType: "date",
        onDate: new Date("2025-08-22")
      });
    }

  }

  console.log("Seed done");
};

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });