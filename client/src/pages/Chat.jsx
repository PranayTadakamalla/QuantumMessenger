import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "../contexts/AuthContext";
import { useChat } from "../contexts/ChatContext";
import UserList from "../components/UserList";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import ProfileMenu from "../components/ProfileMenu";
import KeyRefreshButton from "../components/KeyRefreshButton";
import KeyRefreshModal from "../components/KeyRefreshModal";

export default function Chat() {
  const { currentUser, loading, isAuthenticated } = useAuth();
  const { selectedUser, setSelectedUser, isRefreshingKeys } = useChat();
  const [, setLocation] = useLocation();
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setLocation("/login");
    }
  }, [loading, isAuthenticated, setLocation]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary-600 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 px-4 py-2.5 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="bg-quantum-gradient p-1.5 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-white">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <span className="font-display font-bold text-lg text-primary-600">QuantumChat</span>
        </div>
        
        <div className="flex items-center">
          <KeyRefreshButton />
          <ProfileMenu user={currentUser} />
        </div>
      </nav>
      
      {/* Main Chat Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Users Sidebar */}
        <UserList selectedUser={selectedUser} onSelectUser={setSelectedUser} />
        
        {/* Chat Window */}
        {selectedUser ? (
          <div className="flex-1 flex flex-col bg-gray-50">
            <ChatWindow selectedUser={selectedUser} />
            <MessageInput selectedUser={selectedUser} />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Select a conversation</h3>
              <p className="text-gray-500 text-sm max-w-md">
                Choose a contact from the sidebar to start a quantum-encrypted conversation.
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Key Refresh Modal */}
      {isRefreshingKeys && <KeyRefreshModal />}
    </div>
  );
}
