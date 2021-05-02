import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';import './App.css';
import { Container } from 'react-bootstrap';
import Home from './components/home';

const App = () => (
  <Router>
    <Container fluid='md' style={{ paddingLeft: 10, paddingRight: 10, marginLeft: 'auto', marginRight: 'auto' }}>
      <Switch>
        <Route exact path='/' component={Home} />
      </Switch>
    </Container>
  </Router>
);

export default App;
