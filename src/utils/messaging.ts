import { createClient } from '@supabase/supabase-js';
import React from 'react';

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

// Function to clear all messages for a session
export const clearMessages = async (sessionId: string) => {
  await supabase.from('SessionMessages').delete().eq('session_id', sessionId);
};

// Function to send a message to the session
export const sendMessage = async (
  sessionId: string,
  username: string,
  message: string,
): Promise<boolean> => {
  if (message.trim() === '') return false;

  const { data, error } = await supabase
    .from('SessionMessages')
    .insert([{ session_id: sessionId, username, message }]);

  if (error) {
    console.error('Error sending message:', error.message);
    return false;
  }

  console.log('Message sent:', data);
  return true;
};
