"use client";

import { useState, useEffect } from "react";
import { sendMessage, sendMassMessage, getIndividualMessages } from "./actions";
import { useFormState } from "react-dom";

interface Message {
  id: number;
  senderId: number;
  recipientId: number;
  content: string;
  timestamp: Date;
  read: boolean;
  replyToMessageId: number | null;
  sender: { id: number; name: string; email: string };
  recipient: { id: number; name: string; email: string };
}

interface MassMessage {
  id: number;
  adminId: number;
  content: string;
  targetLocationIds: number[] | null;
  targetDemographicIds: number[] | null;
  timestamp: Date;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Location {
  id: number;
  name: string;
}

interface Demographic {
  id: number;
  name: string;
}

interface Conversation {
  id: string; // e.g., "userId1_userId2"
  otherParticipant: User;
  messages: Message[];
}

type FormState = {
  message: string;
  error: string;
} | undefined;

interface MessagesPageProps {
  isAdmin: boolean;
  initialInternalUsers: User[];
  initialMassMessages: MassMessage[];
  initialIndividualMessages: Message[];
  currentUserId: number | null;
}

export default function MessagesPage({
  isAdmin,
  initialInternalUsers,
  initialMassMessages,
  initialIndividualMessages,
  currentUserId,
}: MessagesPageProps) {
    const [massSendState, massSendAction] = useFormState(sendMassMessage, undefined);
    const [sendState, sendAction] = useFormState(sendMessage, undefined);
    const [selectedRecipientId, setSelectedRecipientId] = useState<number | null>(null);
    const [recipient, setRecipient] = useState("admin");
    const [messageContent, setMessageContent] = useState("");
    const [activeTab, setActiveTab] = useState(isAdmin ? "mass-messages" : "individual-messages");
    const [individualMessages, setIndividualMessages] = useState<Message[]>(initialIndividualMessages);
    const [excludeOptedOut, setExcludeOptedOut] = useState(true);
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  
    // Use initial props for data
    const users = initialInternalUsers;
    const massMessages = initialMassMessages;

    useEffect(() => {
      if (!currentUserId) return;

      const groupedConversations: { [key: string]: Conversation } = {};

      initialIndividualMessages.forEach(message => {
        const participantIds = [message.senderId, message.recipientId].sort();
        const conversationId = participantIds.join('_');

        const otherParticipantId = message.senderId === currentUserId ? message.recipientId : message.senderId;
        const otherParticipant = users.find(user => user.id === otherParticipantId);

        if (!otherParticipant) {
          console.warn(`Other participant not found for message ID: ${message.id}`);
          return;
        }

        if (!groupedConversations[conversationId]) {
          groupedConversations[conversationId] = {
            id: conversationId,
            otherParticipant: otherParticipant,
            messages: [],
          };
        }
        groupedConversations[conversationId].messages.push(message);
      });

      // Sort messages within each conversation by timestamp
      Object.values(groupedConversations).forEach(conversation => {
        conversation.messages.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
      });

      setConversations(Object.values(groupedConversations));
      console.log("Grouped Conversations:", Object.values(groupedConversations));
    }, [initialIndividualMessages, currentUserId, users]);
  
    const handleSendMessage = async (formData: FormData) => {
      // Implement send message logic here
      console.log("Message sent:", formData);
      sendAction(formData); // Use the form action
    };
  
    const handleSendMassMessage = async (formData: FormData) => {
      // Implement send mass message logic here
      console.log("Mass message sent:", formData);
      massSendAction(formData); // Use the form action
    };
  
    return (
      <>
      <div className="p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Messages</h1>
        </div>
        <div className="mt-6">
          <div className="sm:hidden">
            <label htmlFor="tabs" className="sr-only">Select a tab</label>
            <select
              id="tabs"
              name="tabs"
              className="block w-full focus:ring-primary focus:border-primary border-light-gray rounded-md"
              defaultValue={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
            >
              <option value="mass-messages">Mass Messages</option>
              <option value="individual-messages">Individual Messages</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <nav className="-mb-px flex space-x-8" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('mass-messages')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'mass-messages' ? 'bg-secondary text-foreground' : 'bg-light-gray text-foreground'}`}
              >
                Mass Messages
              </button>
              <button
                onClick={() => setActiveTab('individual-messages')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'individual-messages' ? 'bg-secondary text-foreground' : 'bg-light-gray text-foreground'}`}
              >
                Individual Messages
              </button>
            </nav>
          </div>
        </div>
  
        <div className="mt-8">
          {activeTab === 'individual-messages' && (
            <div className="flex h-[calc(100vh-200px)]"> {/* Adjust height as needed */}
              {/* Left Column: Conversation List */}
              <div className="w-1/4 border-r border-gray-200 bg-white overflow-y-auto">
                <h2 className="text-xl font-bold text-foreground p-4 border-b border-gray-200">Conversations</h2>
                {conversations.length === 0 ? (
                  <p className="text-foreground p-4">No conversations yet.</p>
                ) : (
                  <ul>
                    {conversations.map(conversation => (
                      <li
                        key={conversation.id}
                        className={`p-4 cursor-pointer hover:bg-gray-100 ${selectedConversationId === conversation.id ? 'bg-gray-100' : ''}`}
                        onClick={() => setSelectedConversationId(conversation.id)}
                      >
                        <p className="font-semibold">{conversation.otherParticipant.name}</p>
                        <p className="text-sm text-gray-500 truncate">{conversation.messages[conversation.messages.length - 1]?.content}</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Right Column: Chat Window */}
              <div className="flex-1 flex flex-col bg-white">
                {selectedConversationId ? (
                  <div className="flex-1 p-4 overflow-y-auto">
                    {/* Chat messages will go here */}
                    <h2 className="text-xl font-bold text-foreground mb-4">
                      Chat with {conversations.find(c => c.id === selectedConversationId)?.otherParticipant.name}
                    </h2>
                    <div className="space-y-4">
                      {conversations.find(c => c.id === selectedConversationId)?.messages.map(msg => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                        >
                          <div
                            className={`max-w-xs px-4 py-2 rounded-lg ${msg.senderId === currentUserId ? 'bg-primary text-white' : 'bg-gray-200 text-foreground'}`}
                          >
                            <p>{msg.content}</p>
                            <p className="text-xs text-right mt-1">{new Date(msg.timestamp).toLocaleTimeString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-gray-500">
                    Select a conversation to start chatting.
                  </div>
                )}

                {/* New Message Form */}
                {selectedConversationId && (
                  <div className="border-t border-gray-200 p-4">
                    <form action={handleSendMessage} className="flex space-x-2">
                      <input type="hidden" name="recipient" value={conversations.find(c => c.id === selectedConversationId)?.otherParticipant.id} />
                      <textarea
                        name="messageContent"
                        rows={1}
                        required
                        className="flex-1 rounded-md border-gray-300 shadow-sm focus:ring-primary focus:border-primary sm:text-sm"
                        placeholder="Type your message..."
                      ></textarea>
                      <button
                        type="submit"
                        className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Send
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          )}
  
          {activeTab === 'mass-messages' && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Mass Messages</h2>
              {massMessages.length === 0 ? (
                <p className="text-foreground">No mass messages sent yet.</p>
              ) : (
                <ul className="space-y-4">
                  {massMessages.map(msg => (
                    <li key={msg.id} className="bg-light-gray shadow overflow-hidden sm:rounded-lg p-4">
                      <p className="text-foreground">{msg.content}</p>
                      <p className="text-xs text-foreground text-right">{msg.timestamp.toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
              )}
  
              <h2 className="text-2xl font-bold text-foreground mb-4 mt-8">Send Mass Message</h2>
              <form action={handleSendMassMessage} className="space-y-4">
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    required
                    className="shadow-sm focus:ring-primary focus:border-primary mt-1 block w-full sm:text-sm border border-light-gray rounded-md"
                  ></textarea>
                </div>
                <div className="flex items-center">
                  <input
                    id="excludeOptedOut"
                    name="excludeOptedOut"
                    type="checkbox"
                    className="focus:ring-primary h-4 w-4 text-primary border-light-gray rounded"
                  />
                  <label htmlFor="excludeOptedOut" className="ml-2 text-sm text-foreground">
                    Exclude users who have opted out of mass messages
                  </label>
                </div>
                            {massSendState?.message && (
                              <p className="text-sm text-green-600 mt-2">{massSendState.message}</p>
                            )}
                            {massSendState?.error && (
                              <p className="text-sm text-red-600 mt-2">{massSendState.error}</p>
                            )}                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-secondary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  Send Mass Message
                </button>
              </form>
            </div>
          )}
  

        </div>
      </div>
    </>
  );
}