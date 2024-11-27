import React, { useState, useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { sendMessage, supabase } from '@/utils/messaging';
import { useParams } from 'next/navigation';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Skeleton } from './ui/skeleton';

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

    const fetchMessages = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('SessionMessages')
        .select('*')
        .eq('session_id', session_id)
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
  }, [session_id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (!isLoaded) return null;

  const handleSend = async () => {
    if (messageInput.trim() === '') return;
    const res = await sendMessage(
      session_id?.toString()!,
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
    <div className="chat-container bg-gray-800 text-white p-4 rounded-lg shadow-lg w-full max-w-md mx-auto">
      <h2 className="text-lg self-center font-bold mb-1">Session Messages</h2>
      <div className="chat-box flex flex-col justify-between">
        <div className="messages flex-1 space-y-3 overflow-y-auto max-h-[400px] border-b border-gray-700 pb-4">
          {loading ? (
            <div className="flex justify-center items-center">
              <Skeleton className="w-[100px] h-[20px] rounded-full" />
            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className="message bg-gray-700 p-3 rounded-md text-sm"
              >
                <strong className="text-blue-400">{msg.username}:</strong>{' '}
                {msg.message}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="input-area flex mt-1 gap-2">
          <Input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 bg-gray-900 text-white border-gray-700 focus:ring-2 focus:ring-blue-500"
          />
          <Button
            variant="outline"
            className="bg-blue-600 text-white hover:bg-blue-700 transition"
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
