function MessageInput({
  message,
  setMessage,
  sendMessage,
  socket
}) {
  return (
    <div className="p-4 flex gap-2 border-t border-gray-700">
      <input
        className="flex-1 p-3 rounded-lg bg-gray-700 text-white outline-none"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          socket.emit("typing");

          setTimeout(() => {
            socket.emit("stopTyping");
          }, 2000);
        }}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />

      <button
        onClick={sendMessage}
        className="bg-blue-600 hover:bg-blue-700 transition px-6 rounded-lg text-white font-semibold"
      >
        Send
      </button>
    </div>
  );
}

export default MessageInput;