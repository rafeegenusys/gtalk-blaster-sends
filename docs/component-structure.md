
# GTalk Component Structure

## Page Components

These components represent the main routes in the application:

1. **Index.tsx**
   - Landing dashboard for authenticated users
   - Displays statistics overview, recent activity, and credit balance

2. **Auth.tsx**
   - Authentication page with sign-in, sign-up, and password reset forms
   - Uses Tabs component to switch between sign-in and sign-up forms
   - Handles form submission and error display

3. **ResetPassword.tsx**
   - Dedicated page for password reset functionality

4. **Messaging.tsx**
   - Main messaging interface
   - Displays contacts and message threads

5. **Contacts.tsx**
   - Contact management page
   - Lists individual contacts and groups

6. **Templates.tsx**
   - Message template management
   - Creation and editing of reusable templates

7. **Scheduler.tsx**
   - Message scheduling interface
   - Calendar view of scheduled messages

8. **Chat.tsx**
   - Internal team chat functionality

9. **Settings.tsx**
   - Application settings and preferences

10. **Credits.tsx**
    - Credit management and purchasing

11. **AISettings.tsx**
    - Configuration for AI-assisted messaging

12. **Reports.tsx**
    - Analytics and reporting dashboard
    - Message delivery statistics and costs

13. **NotFound.tsx**
    - 404 page for non-existent routes

## Layout Components

1. **Dashboard.tsx**
   - Main application layout
   - Contains sidebar and main content area

2. **Sidebar.tsx**
   - Navigation sidebar
   - Links to main application routes

## Feature Components

### Authentication

1. **ProtectedRoute.tsx**
   - Wraps routes that require authentication
   - Redirects to /auth if user is not authenticated

### Messaging

1. **MessageThread.tsx**
   - Displays conversation with a contact
   - Shows message history

2. **MessageComposer.tsx**
   - Text input for composing messages
   - File attachment functionality

3. **ContactList.tsx**
   - List of contacts for messaging

4. **AIAssistant.tsx**
   - AI-powered suggestions for replies

5. **NotificationBell.tsx**
   - Notifications for incoming messages

### Contacts

1. **ContactList.tsx**
   - List of individual contacts
   - Search and filter functionality

2. **GroupList.tsx**
   - List of contact groups

3. **DialogAddContact.tsx**
   - Modal form for adding new contacts

4. **DialogAddGroup.tsx**
   - Modal form for creating contact groups

### Templates

1. **TemplateGrid.tsx**
   - Grid display of message templates

2. **TemplateCard.tsx**
   - Card component for individual templates

3. **DialogAddTemplate.tsx**
   - Modal form for creating templates

4. **DialogEditTemplate.tsx**
   - Modal form for editing templates

### Reports

1. **ReportsDashboard.tsx**
   - Overview of messaging analytics

2. **DeliveryReports.tsx**
   - Detailed message delivery reporting

3. **MessageLogs.tsx**
   - Logs of all sent messages

4. **TeamAnalytics.tsx**
   - Analysis of team messaging activity

5. **CostInsights.tsx**
   - Cost analysis for messaging

### Chat

1. **TeamChat.tsx**
   - Internal team chat interface

2. **MessageList.tsx**
   - List of chat messages

3. **MessageInput.tsx**
   - Input for team chat messages

4. **TeamMentions.tsx**
   - @mentions functionality for team chat

## Utility Components

1. **Sonner.tsx** / **Toaster.tsx**
   - Toast notification components

2. **Dialog components**
   - Modal dialogs for forms and confirmations

## Context Providers

1. **AuthProvider (AuthContext.tsx)**
   - Authentication state management
   - User sign-in, sign-up, and sign-out functionality

## Routes Structure

```
/                     - Index (Dashboard)
/auth                 - Authentication
/reset-password       - Password Reset
/messaging            - Messaging
/contacts             - Contacts
/templates            - Templates
/scheduler            - Scheduler
/chat                 - Team Chat
/settings             - Settings
/credits              - Credits
/ai-settings          - AI Settings
/reports              - Reports
*                     - NotFound (404)
```

All routes except `/auth` and `/reset-password` are protected with the `ProtectedRoute` component, requiring authentication to access.
