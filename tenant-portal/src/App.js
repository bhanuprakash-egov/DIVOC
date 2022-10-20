import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useKeycloak } from "@react-keycloak/web";
import Login from "./components/Login";
import Home from "./components/Home/Home";
import { PrivateRoute } from "./utils/PrivateRoute";
import CreateSchema from "./components/CreateSchema/CreateSchema";
import config from "./config.json"
import Footer from "./components/Footer/Footer";
import Welcome from "./components/Welcome/Welcome";
import Header from "./components/Header/Header";
import GenerateToken from "./components/GenerateToken/GenerateToken";
import ViewToken from "./components/ViewToken/ViewToken";

function App() {
  const { initialized, keycloak } = useKeycloak();
  if (!initialized) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Header />
      <Router>
        <Routes>
        
          <Route exact path={config.urlPath + "/"} element={<Home />} />
          <Route exact path={config.urlPath + "/login"} element={<Login />} />
          <Route exact path={config.urlPath + "/vcwelcome"} element={<Welcome />} />
          <Route exact path={config.urlPath + "/generatetoken"} element={<GenerateToken />} />
          <Route exact path={config.urlPath + "/viewtoken"} element={<ViewToken />} />
          <Route path={config.urlPath + "/create-schema"}
             element={
                        <PrivateRoute>
                          <CreateSchema /> role={"tenant"} clientId={"certificate-login"} 
                        </PrivateRoute>
                     }
           >
           </Route>
        </Routes>
      </Router>
      <Footer/>
    </div>
  );
}

export default App;
