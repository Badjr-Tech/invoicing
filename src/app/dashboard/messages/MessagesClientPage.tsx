"use client";

import { useState, useEffect } from "react";
import { sendMessage, sendMassMessage, getIndividualMessages } from "./actions";
import { searchBusinesses } from "../businesses/actions";
import { Business } from "@/db/schema";
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

interface PendingRequest extends Message {
  sender: { id: number; name: string; email: string };
  recipient: { id: number; name: string; email: string };
}

type FormState = {
  message: string;
  error: string;
} | undefined;

interface MessagesPageProps {
  isAdmin: boolean;
  initialInternalUsers: User[];
  initialMassMessages: MassMessage[];
  initialLocations: Location[];
  initialDemographics: Demographic[];
  initialIndividualMessages: Message[];
  currentUserId: number | null;
}

export default function MessagesPage({
  isAdmin,
  initialInternalUsers,
  initialMassMessages,
  initialLocations,
  initialDemographics,
  initialIndividualMessages,
  currentUserId,
}: MessagesPageProps) {
    const [massSendState, massSendAction] = useFormState(sendMassMessage, undefined);
    const [sendState, sendAction] = useFormState(sendMessage, undefined);
    const [selectedRecipientId, setSelectedRecipientId] = useState<number | null>(null);
    const [recipient, setRecipient] = useState("admin");
    const [messageContent, setMessageContent] = useState("");
    const [activeTab, setActiveTab] = useState(isAdmin ? "mass-messages" : "correspondence");
    const [individualMessages, setIndividualMessages] = useState<Message[]>(initialIndividualMessages);
    const [selectedLocations, setSelectedLocations] = useState<number[]>([]);
    const [selectedDemographics, setSelectedDemographics] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Business[]>([]);
    const [excludeOptedOut, setExcludeOptedOut] = useState(true);
  
    // Use initial props for data
    const users = initialInternalUsers;
    const massMessages = initialMassMessages;
    const locations = initialLocations;
    const demographics = initialDemographics;
    const pendingRequests: PendingRequest[] = []; // Assuming pending requests are not yet implemented or fetched here
  
    useEffect(() => {
      if (searchQuery.length > 2) {
        searchBusinesses(searchQuery).then(setSearchResults);
      }
    }, [searchQuery]);
  
    const handleLocationChange = (locationId: number) => {
      setSelectedLocations(prev =>
        prev.includes(locationId)
          ? prev.filter(id => id !== locationId)
          : [...prev, locationId]
      );
    };
  
    const handleDemographicChange = (demographicId: number) => {
      setSelectedDemographics(prev =>
        prev.includes(demographicId)
          ? prev.filter(id => id !== demographicId)
          : [...prev, demographicId]
      );
    };
  
    const handleCreateCollaborationRequest = async (formData: FormData) => {
      // Implement collaboration request logic here
      console.log("Collaboration request created:", formData);
    };
  
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
              <option value="correspondence">Correspondence</option>
              <option value="pending-requests">Pending Requests</option>
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
                onClick={() => setActiveTab('correspondence')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'correspondence' ? 'bg-secondary text-foreground' : 'bg-light-gray text-foreground'}`}
              >
                Correspondence
              </button>
              <button
                onClick={() => setActiveTab('pending-requests')}
                className={`px-4 py-2 rounded-md text-sm font-medium ${activeTab === 'pending-requests' ? 'bg-secondary text-foreground' : 'bg-light-gray text-foreground'}`}
              >
                Pending Requests
              </button>
            </nav>
          </div>
        </div>
  
        <div className="mt-8">
          {activeTab === 'correspondence' && (
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Create Collaboration Request</h2>
              <form action={handleCreateCollaborationRequest} className="space-y-4">
                <div>
                  <label htmlFor="recipientId" className="block text-sm font-medium text-foreground">Recipient</label>
                  <select
                    id="recipientId"
                    name="recipientId"
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-light-gray focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                  >
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                    ))}
                  </select>
                </div>
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
                <button
                  type="submit"
                  className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-ring-offset-2"
                >
                  Send Request
                </button>
              </form>
  
              <h2 className="text-2xl font-bold text-foreground mb-4 mt-8">Pending Requests</h2>
              {pendingRequests.length === 0 ? (
                <p className="text-foreground">No pending collaboration requests.</p>
              ) : (
                <ul className="space-y-4">
                  {pendingRequests.map(request => (
                    <li key={request.id} className="bg-light-gray shadow overflow-hidden sm:rounded-lg p-4">
                      <p className="text-sm font-semibold">{request.senderId === currentUserId ? "You" : "User"} to {request.senderId === currentUserId ? "User" : "You"}:</p>
                      <p className="text-foreground">{request.content}</p>
                      <p className="text-xs text-foreground text-right">{request.timestamp.toLocaleString()}</p>
                    </li>
                  ))}
                </ul>
              )}
  
              <h2 className="text-2xl font-bold text-foreground mb-4 mt-8">New Message</h2>
              <form action={handleSendMessage} className="space-y-4">
                <div>
                  <label htmlFor="recipient" className="block text-sm font-medium text-foreground">Recipient</label>
                  <select
                    id="recipient"
                    name="recipient"
                    required
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-light-gray focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                  >
                    {users.map(user => (
                      <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
                    ))}
                  </select>
                </div>
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
                {sendState?.message && (
                  <p className="text-sm text-green-600 mt-2">{sendState.message}</p>
                )}
                {sendState?.error && (
                  <p className="text-sm text-red-600 mt-2">{sendState.error}</p>
                )}
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Send Message
                </button>
              </form>
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
                  <label className="block text-sm font-medium text-foreground">Target Locations</label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {locations.map(location => (
                      <div key={location.id} className="flex items-center">
                        <input
                          id={`location-${location.id}`}
                          name="targetLocations"
                          type="checkbox"
                          value={location.id}
                          className="focus:ring-primary h-4 w-4 text-primary border-light-gray rounded"
                        />
                        <label htmlFor={`location-${location.id}`} className="ml-2 text-sm text-foreground">
                          {location.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground">Target Demographics</label>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {demographics.map(demographic => (
                      <div key={demographic.id} className="flex items-center">
                        <input
                          id={`demographic-${demographic.id}`}
                          name="targetDemographics"
                          type="checkbox"
                          value={demographic.id}
                          className="focus:ring-primary h-4 w-4 text-primary border-light-gray rounded"
                        />
                        <label htmlFor={`demographic-${demographic.id}`} className="ml-2 text-sm text-foreground">
                          {demographic.name}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
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
  
          {activeTab === 'pending-requests' && (
            <div className="mt-8">
              <div className="mb-8 p-6 bg-background shadow-md rounded-lg">
                <h2 className="text-2xl font-bold text-foreground mb-4">Create Collaboration Request</h2>
                <form action={async (formData) => {
                  const selectedBusinessId = formData.get("business-id");
                  console.log("Collaboration request created for business:", selectedBusinessId);
                }}>
                  <div className="flex items-center">
                    <input
                      type="search"
                      name="business-search"
                      placeholder="Search for a business..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-foreground"
                    />
                    <button
                      type="submit"
                      className="ml-4 inline-flex justify-center rounded-md border border-transparent bg-secondary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-secondary"
                    >
                      Send Request
                    </button>
                  </div>
                  {searchResults.length > 0 && (
                    <ul className="mt-4 border border-gray-200 rounded-md">
                      {searchResults.map((business) => (
                        <li key={business.id} className="p-2 border-b border-gray-200">
                          <label className="flex items-center">
                            <input type="radio" name="business-id" value={business.id} className="mr-2" />
                            {business.businessName}
                          </label>
                        </li>
                      ))}
                    </ul>
                  )}
                </form>
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">Pending Requests</h2>
              <div className="p-6 bg-background shadow-md rounded-lg h-96 overflow-y-auto">
                <p className="text-gray-500">This feature is coming soon.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}