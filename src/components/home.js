import { React, useEffect, useState } from 'react';
import { Row, Col, Card, Form, ListGroup, Button } from 'react-bootstrap';
import axios from 'axios';
require('dotenv').config();

const Home = () => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movieData, setMovieData] = useState({});
  const [showMovieData, setShowMovieData] = useState(false);
  const [nominations, setNominations] = useState([]);
  const [active, setActive] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const apiUrl = `http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&t=${movieTitle}&type=movie`;


  useEffect(() => {
    const getNominations = async () => {
      try {
        const results = await axios.get('http://localhost:8000/nominations/');
        console.log(results);
        setNominations(results.data);
      } catch (error) {
        console.error(error);
      }
    };

    getNominations();
  }, []);

  // retrieve movie data from omdb api
  const searchMovieTitle = async () => {
    try {
      const results = await axios.get(apiUrl);
      setMovieData(results.data);
      console.log(results.data);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setShowMovieData(true);
    searchMovieTitle();
  };


  const addNomination = async () => {
    try {
      const params = {
        method: 'post',
        url: 'http://localhost:8000/nominations/add/',
        data: {
          title: movieData.Title,
          year: movieData.Year,
          id: movieData.imdbID,
        },
      };

      const addedResults = await axios(params);
      console.log(addedResults);

      const newNominationsResults = await axios.get('http://localhost:8000/nominations/');
      console.log(newNominationsResults);
      setNominations(newNominationsResults.data);
      setActive(true);
      setDisabled(false);
    } catch (error) {
      console.error(error);
    }
  }

  const onNominate = (e) => {
    e.preventDefault();
    setActive(false);
    setDisabled(true);
    addNomination();
  };

  const deleteNomination = async (id) => {
    try {
      const params = {
        method: 'delete',
        url: `http://localhost:8000/nominations/delete/${id}`,
      };

      const deleteResults = await axios(params);
      console.log(deleteResults);

      const newNominationsResults = await axios.get('http://localhost:8000/nominations/');
      console.log(newNominationsResults);
      setNominations(newNominationsResults.data);
    } catch (error) {
      console.error(error);
    }
  }

  const onDelete = (e) => {
    e.preventDefault();
    deleteNomination(e.target.value);
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
                            onClick={onNominate}
                            variant='info' 
                            size='sm'
                          >
                            Nominate
                          </Button>
                        )}
                        {disabled && (
                          <Button 
                            className="float-right" 
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
              <ListGroup as="ul">
                  {nominations.map((entry) => (
                    <ListGroup.Item as='li' id={entry.id}>
                      <Row>
                        <Col md={6}>
                          <h6>{entry.title} ({entry.year})</h6>
                        </Col>
                        <Col md={{ span: 3, offset: 3 }}>
                          <Button 
                            className="float-right" 
                            onClick={onDelete}
                            value={entry._id}
                            variant='info' 
                            size='sm'
                          >
                            Remove
                          </Button>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  )
};

export default Home;
