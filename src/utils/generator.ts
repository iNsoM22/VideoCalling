export const MeetingGenerator = (): string => {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
  const linkLength = 8;
  let meetingLink = '';

  for (let i = 0; i < linkLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    meetingLink += characters[randomIndex];
  }

  return meetingLink;
};
