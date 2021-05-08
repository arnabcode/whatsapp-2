const getRecipientEmail = (users, userLoggedIn, location = "") => {
  console.log(location);
  return users?.filter(
    (userToFilter) => userToFilter !== userLoggedIn?.email
  )[0];
};

export default getRecipientEmail;
