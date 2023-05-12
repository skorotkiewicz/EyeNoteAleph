export const COMMENT_SELECT_FIELDS = {
  // id: true,
  // message: true,
  comment: true,
  parentId: true,
  createdAt: true,
  uniqId: true,
  User: {
    select: {
      username: true,
      joined: true,
      lastSeen: true,
    },
  },
};

export const timeControlor = (createdAt: Date) => {
  const limitDate = new Date(createdAt.getTime());
  limitDate.setMinutes(createdAt.getMinutes() + 15);

  if (limitDate.getTime() > new Date().getTime()) {
    return true;
  } else {
    return false;
  }
};
