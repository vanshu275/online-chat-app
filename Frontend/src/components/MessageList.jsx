function MessageList({ messages, currentUserId, chatRef }) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg, index) => {
        const isMe = msg.user === currentUserId; // ID comparison
        const isSystem = msg.user === "System";

        return (
          <div key={index} className={`flex ${isSystem ? "justify-center" : isMe ? "justify-end" : "justify-start"}`}>
            <div className={`px-4 py-2 rounded-xl max-w-[80%] wrap-break-word ${
              isSystem ? "bg-transparent text-gray-500 text-xs" : 
              isMe ? "bg-blue-600 text-white rounded-tr-none" : "bg-gray-700 text-white rounded-tl-none"
            }`}>
              {!isSystem && !isMe && <p className="text-[10px] font-bold text-blue-400 uppercase">{msg.username}</p>}
              <p className="text-sm">{msg.message}</p>
            </div>
          </div>
        );
      })}
      <div ref={chatRef} />
    </div>
  );
}
export default MessageList;