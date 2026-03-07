function ChatHeader({ username }) {
  return (
    <div className="bg-gray-700 p-4 rounded-t-2xl text-white font-semibold">
      Logged in as: {username}
    </div>
  );
}

export default ChatHeader;