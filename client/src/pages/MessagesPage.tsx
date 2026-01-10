import "../styles/MessagesPage.css";

export const MessagesPage = () => {
  return (
    <div className="messages-layout">
      <aside className="inbox-sidebar">
        <div className="inbox-header">
          <h2>Inbox</h2>
        </div>
        <div className="chat-list">
          {/* Conversation Preview */}
          <div className="chat-preview active">
            <div className="chat-avatar-sm">J</div>
            <div className="chat-details">
              <span className="chat-user">John Host</span>
              <span className="chat-snippet">Is 3 PM arrival okay?</span>
            </div>
          </div>
        </div>
      </aside>

      <main className="chat-window">
        <div className="chat-empty">
          <p>Select a message to read it</p>
        </div>
      </main>
    </div>
  );
};
