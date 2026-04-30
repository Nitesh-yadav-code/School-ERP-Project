import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import * as Sentry from "@sentry/react";
import ErrorBoundary from './ErrorBoundary.jsx';
import { UserProvider } from './components/UserContext.jsx';

Sentry.init({
  dsn: "https://c080ba15945af3e04089cab92415f09d@o4510379711463424.ingest.de.sentry.io/4510379713560656",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* <ErrorBoundary> */}
    <UserProvider>
      <App />
    </UserProvider>
    {/* </ErrorBoundary> */}
  </StrictMode>,
)
