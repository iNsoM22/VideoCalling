import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { sendMessage, supabase } from '@/utils/messaging';
import { useParams } from 'next/navigation';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Skeleton } from './ui/skeleton';

interface Message {
  id: string; // Added `id` for message tracking
  username: string;
  message: string;
}

interface ChatRoomProps {
  setStateProp: (newState: boolean) => void;
  lastMessageId: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ setStateProp, lastMessageId }) => {
  const { isLoaded, user } = useUser();
  const { id } = useParams();
  const sessionId = id;
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const channel = supabase
      .channel('session_messages')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'SessionMessages' },
        (payload) => {
          if (payload.new.session_id === sessionId) {
            const { id, username, message } = payload.new;
            setMessages((prevMessages) => {
              const newMessages = [...prevMessages, { id, username, message }];
              if (newMessages.length > 0) {
                const lastMsg = newMessages[newMessages.length - 1];
                // Check if the incoming message is new
                if (lastMsg.id !== lastMessageId) {
                  setStateProp(true); // Set state to true if new message arrives
                }
              }
              return newMessages;
            });
          }
        },
      )
      .subscribe();

    const fetchMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('SessionMessages')
        .select('*')
        .eq('session_id', sessionId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error.message);
      } else {
        setMessages(data);
        setLoading(false);
        scrollToBottom();
      }
    };

    fetchMessages();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionId, lastMessageId, setStateProp]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isLoaded) return null;

  const handleSend = async () => {
    if (messageInput.trim() === '') return;
    const res = await sendMessage(
      sessionId?.toString()!,
      user?.username!,
      messageInput.trim(),
    );
    if (res) {
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chat-container mx-auto w-full max-w-md rounded-lg bg-gray-800 p-4 text-white shadow-lg">
      <h2 className="mb-1 self-center text-lg font-bold">Session Messages</h2>
      <div className="chat-box flex flex-col justify-between">
        <div className="messages max-h-[400px] flex-1 space-y-3 overflow-y-auto border-b border-gray-700 pb-4">
          {loading ? (
            <div className="flex items-center justify-center">
              <Skeleton className="h-[20px] w-[100px] rounded-full" />
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={msg.id} // Ensure the key is unique
                className="message rounded-md bg-gray-700 p-3 text-sm"
              >
                <strong className="text-blue-400">{msg.username}:</strong>{' '}
                {msg.message}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area mt-1 flex gap-2">
          <Input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 border-gray-700 bg-gray-900 text-white focus:ring-2 focus:ring-blue-500"
          />
          <Button
            variant="outline"
            className="bg-blue-600 text-white transition hover:bg-blue-700"
            onClick={handleSend}
          >
            Send
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
