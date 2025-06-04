import ReactDOM from 'react-dom/client';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import IsAuthenticated from './components/auth.js';
import HomeAndLogOutButtons from './components/buttons/HomeAndLogOutButtons.jsx';
import StoresRadio from './components/stores/StoresRadio.jsx';
import { PathProvider } from './contexts/PDFPathContext.jsx';
import { StoreProvider } from './contexts/StoreContext.jsx';
import './index.css';
import { routes } from './Routes.jsx';

const RequireAuth = ({ children }) => {
  const isLoggedIn = IsAuthenticated();
  return isLoggedIn ? children : <Navigate to="/login" />;
};

const App = () => (
  <StoreProvider>
    <PathProvider>
      <Router>
        <Routes>
          {routes.map(({ path, element, auth, storesRadio }, i) => (
            <Route
              key={i}
              path={path}
              element={
                auth ? (
                  <RequireAuth>
                    <HomeAndLogOutButtons>
                      {storesRadio ? <StoresRadio>{element}</StoresRadio> : element}
                    </HomeAndLogOutButtons>
                  </RequireAuth>
                ) : (
                  element
                )
              }
            />
          ))}
        </Routes>
      </Router>
    </PathProvider>
  </StoreProvider>
);

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
