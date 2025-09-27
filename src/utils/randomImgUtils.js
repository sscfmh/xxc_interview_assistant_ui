const whArr = [
  {
    w: 200,
    h: 100,
  },
  {
    w: 200,
    h: 300,
  },
  {
    w: 230,
    h: 230,
  },
];

export const randomImgUrl = (imgUrl) => {
  const { w, h } = whArr[Math.floor(Math.random() * whArr.length)];
  return imgUrl
    ? imgUrl
    : `https://picsum.photos/${w}/${h}?__r=` + Math.random();
};

export default {
  randomImgUrl,
};
