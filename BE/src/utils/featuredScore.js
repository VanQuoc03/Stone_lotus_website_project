function getFeaturedScore({ views = 0, likes = 0, createdAt }) {
  const viewWeight = 1;
  const likeWeight = 3;
  const now = new Date();
  const daysOld = Math.max(
    1,
    Math.floor((now - new Date(createdAt)) / (1000 * 60 * 60 * 24))
  );
  const recencyBoost = 1 / daysOld;

  return (views * viewWeight + likes * likeWeight) * recencyBoost;
}

module.exports = getFeaturedScore;
