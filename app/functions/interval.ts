
const mainIx = (inter: string) => {
  const date = new Date();

  if (inter == "monthly") {
    const datex: number = new Date(
      date.getFullYear(),
      date.getMonth() + 1,
      0
    ).getDate();

    return datex * 86400;
  } else if (inter == "yearly") {
    const year = date.getFullYear();

    return year % 4 ? 31536000 : 31622400;
  } else if (inter == "daily") {
    return 86400;
  } else if (inter == "weekly") {
    return 604800;
  }

  return 0;
};

export default mainIx;