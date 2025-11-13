import { v4 as uuidv4 } from "uuid";

export default function UsersDao(db) {
  const createUser = (user) => {
    const newUser = { ...user, _id: uuidv4() };
    db.users = [...db.users, newUser];
    return newUser;
  };

  const findUserByUsername = (username) =>
    db.users.find((user) => user.username === username);

  const findUserByCredentials = (username, password) =>
    db.users.find(
      (user) => user.username === username && user.password === password
    );

  const findAllUsers = () => db.users;

  const findUserById = (userId) =>
    db.users.find((u) => u._id === userId);

  const deleteUser = (userId) => {
    db.users = db.users.filter((u) => u._id !== userId);
    return { status: "ok" };
  };

  const updateUser = (userId, userUpdates) => {
    const user = db.users.find((u) => u._id === userId);
    if (!user) return null;
    Object.assign(user, userUpdates);
    return user;
  };

  return {
    createUser,
    findUserByUsername,
    findUserByCredentials,
    findAllUsers,
    findUserById,
    deleteUser,
    updateUser,
  };
}