import { Route, BrowserRouter as Router, Switch } from "react-router-dom/cjs/react-router-dom.min";
import Home from "./pages/Home.js"
import UserAccount from "./pages/UserAccount.js"
import RegisterForm from './pages/RegisterForm.js'
import ResetPassword from './pages/ResetPassword.js'
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { loadUser } from "./actions/userAction.js"
import ProtectedRoute from "./routes/ProtectedRoute.js"
import HomeRoute from './routes/HomeRoute.js'
import ForgotPassword from "./pages/ForgotPassword.js"



function App() {

  const dispatch = useDispatch()

  const { isAuthenticated } = useSelector(state => state.loadUser)



  //useEffect
  useEffect(() => {

    if (isAuthenticated !== true) {
      dispatch(loadUser())
    }

  }, [dispatch, isAuthenticated])


  return (
    <div className="App">
      <Router>
        <Switch>
          <HomeRoute exact path="/" component={Home} />
          <Route exact path="/forgot/password" component={ForgotPassword} />
          <ProtectedRoute exact path="/user/account" component={UserAccount} />
          <Route exact path="/register/form/:email/:token/:role" component={RegisterForm} />
          <Route exact path="/reset/form/:email/:token" component={ResetPassword} />
        </Switch>
      </Router>
    </div>
  );
}

export default App
