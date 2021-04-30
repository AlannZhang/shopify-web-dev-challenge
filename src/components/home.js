import { React, useEffect, useState } from 'react';
import { Row, Col, Card, Form, ListGroup, Button } from 'react-bootstrap';
import axios from 'axios';
require('dotenv').config();

const Home = () => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movieData, setMovieData] = useState({});
  const [showMovieData, setShowMovieData] = useState(false);
  const [active, setActive] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const apiUrl = `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_API_KEY}&t=${movieTitle}&type=movie`;

  const searchMovieTitle = async () => {
    try {
      const results = await axios.get(apiUrl);
      console.log(results);
      setMovieData(results.data);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setShowMovieData(true);
    searchMovieTitle();
  };

  const nominate = (e) => {
    e.preventDefault();
    setActive(false);
    setDisabled(true);
  };

  return (
    <>
      <Row>
        <h1>The Shoppies</h1>
      </Row>
      <Row>
        <Card>
          <Card.Body>
            <h6>Movie title</h6>
            <Form onSubmit={onSubmit}>
              <input
                type='text'
                required
                value={movieTitle}
                placeholder='Search using a movie title...'
                onChange={e => setMovieTitle(e.target.value)}
              />
            </Form>
          </Card.Body>
        </Card>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <h6><strong>Results for {movieTitle}</strong></h6>
              {showMovieData && (
                <ListGroup as="ul">
                  <ListGroup.Item as='li'>
                    <Row>
                      <Col md={6}>
                        <h6>{movieData.Title} ({movieData.Year})</h6>
                      </Col>
                      <Col md={{ span: 3, offset: 3 }}>
                        {active && (
                          <Button 
                            className="float-right" 
                            onClick={nominate}
                            variant='info' 
                            size='sm'
                          >
                            Nominate
                          </Button>
                        )}
                        {disabled && (
                          <Button 
                            className="float-right" 
                            onClick={nominate}
                            variant='info' 
                            size='sm'
                            disabled
                          >
                            Nominate
                          </Button>
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col>
          <Card>
            <Card.Body>
              <h6><strong>Nominations</strong></h6>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
};

export default Home;