export default function useNestedComments(comments = []) {
  const map = {};
  const roots = [];

  comments.forEach((c) => {
    c.replies = [];
    map[c._id] = c;
  });

  comments.forEach((c) => {
    if (c.parent) {
      map[c.parent]?.replies.push(c);
    } else {
      roots.push(c);
    }
  });

  return roots;
}
