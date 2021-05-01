import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';import './App.css';
import { Container } from 'react-bootstrap';
import Home from './components/home';

const App = () => (
  <Router>
    <Container fluid style={{ paddingLeft: 80, paddingRight: 80, marginLeft: 'auto', marginRight: 'auto' }}>
      <Switch>
        <Route exact path='/' component={Home} />
      </Switch>
    </Container>
  </Router>
);

export default App;
