  const formatLastSeen = (timestamp) => {
  if (!timestamp) return "recently";
  const date = new Date(timestamp);
  const now = new Date();

  // Same day → show time only
  if (date.toDateString() === now.toDateString()) {
    return `today at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }

  // Yesterday
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `yesterday at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }

  // Otherwise → full date
  return date.toLocaleDateString([], { month: "short", day: "numeric" }) +
         " at " +
         date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default formatLastSeen