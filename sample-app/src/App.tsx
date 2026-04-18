import { useState, useEffect } from "react";
import keycloak from "./keycloak";
import "./App.css";

interface TokenParsed {
  preferred_username?: string;
  email?: string;
  given_name?: string;
  family_name?: string;
  realm_access?: { roles: string[] };
}

function App() {
  const [authenticated, setAuthenticated] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const [userInfo, setUserInfo] = useState<TokenParsed | null>(null);

  useEffect(() => {
    keycloak
      .init({ onLoad: "check-sso", checkLoginIframe: false })
      .then((auth) => {
        setAuthenticated(auth);
        setInitialized(true);
        if (auth) {
          setUserInfo(keycloak.tokenParsed as TokenParsed);
        }
      })
      .catch((err) => {
        console.error("Keycloak init failed", err);
        setInitialized(true);
      });
  }, []);

  const login = () => keycloak.login();
  const logout = () => keycloak.logout({ redirectUri: window.location.origin });

  if (!initialized) {
    return <div className="container">Loading...</div>;
  }

  if (!authenticated) {
    return (
      <div className="container">
        <h1>Keycloak Sample App</h1>
        <p>You are not logged in.</p>
        <button onClick={login}>Login</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Keycloak Sample App</h1>
      <div className="card">
        <h2>
          Welcome, {userInfo?.given_name || userInfo?.preferred_username}!
        </h2>
        <table>
          <tbody>
            <tr>
              <td>
                <strong>Username</strong>
              </td>
              <td>{userInfo?.preferred_username}</td>
            </tr>
            <tr>
              <td>
                <strong>Email</strong>
              </td>
              <td>{userInfo?.email}</td>
            </tr>
            <tr>
              <td>
                <strong>Name</strong>
              </td>
              <td>
                {userInfo?.given_name} {userInfo?.family_name}
              </td>
            </tr>
            <tr>
              <td>
                <strong>Roles</strong>
              </td>
              <td>{userInfo?.realm_access?.roles.join(", ")}</td>
            </tr>
          </tbody>
        </table>
        <h3>Access Token</h3>
        <pre>{keycloak.token}</pre>
      </div>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default App;
