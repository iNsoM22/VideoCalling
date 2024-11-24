import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { sendMessage, supabase } from '@/utils/messaging';
import { useParams } from 'next/navigation';

interface Message {
  username: string;
  message: string;
}

const ChatRoom: React.FC = () => {
  const { isLoaded, user } = useUser();
  const { id } = useParams();
  const session_id = id;
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');

  if (!isLoaded) return null;

  useEffect(() => {
    const channel = supabase
      .channel('session_messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'SessionMessages' },
        (payload) => {
          if (payload.new.session_id === session_id) {
            const { username, message } = payload.new;
            setMessages((prevMessages) => [
              ...prevMessages,
              { username, message },
            ]);
          }
        },
      )
      .subscribe();

    // Fetch initial messages from the session
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('SessionMessages')
        .select('*')
        .eq('session_id', session_id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error.message);
      } else {
        setMessages(data);
      }
    };

    fetchMessages();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session_id]);

  return (
    <div className="chat-container">
      <div className="chat-box">
        <div className="messages">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              <strong>{msg.username}:</strong> {msg.message}
            </div>
          ))}
        </div>

        <div className="input-area">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button
            onClick={async () => {
              let res = await sendMessage(
                session_id?.toString()!,
                user?.username!,
                messageInput.trim(),
              );
              if (res) {
                setMessageInput('');
              }
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
