import { React, useEffect, useState } from 'react';
import { 
  Row, Col, Card, Form, ListGroup, Button, Toast, ButtonToolbar,
  ButtonGroup,
} from 'react-bootstrap';
import { InputAdornment, OutlinedInput } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import axios from 'axios';
require('dotenv').config();

const Home = () => {
  const [movieTitle, setMovieTitle] = useState('');
  const [movieData, setMovieData] = useState({});
  const [showMovieData, setShowMovieData] = useState(false);
  const [nominations, setNominations] = useState([]);
  let rating;
  const [active, setActive] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [showNominatedNotification, setNominatedNotification] = useState(false);
  const [showDeletedNotification, setDeletedNotification] = useState(false);
  const [showRating, setShowRating] = useState(false);

  useEffect(() => {
    const getNominations = async () => {
      try {
        const results = await axios.get('http://localhost:8000/nominations');
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
      const results = await axios.get(`http://www.omdbapi.com/?apikey=${process.env.REACT_APP_OMDB_API_KEY}&t=${movieTitle}&type=movie`);
      setMovieData(results.data);
      console.log(results.data);
      setActive(true);
      setDisabled(false);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setShowMovieData(true);
    searchMovieTitle();
  };


  // adding nominations
  const addNomination = async () => {
    try {
      const params = {
        method: 'post',
        url: 'http://localhost:8000/nominations/add',
        data: {
          title: movieData.Title,
          year: movieData.Year,
          rating,
        },
      };

      const addedResults = await axios(params);
      console.log(addedResults);

      const newNominationsResults = await axios.get('http://localhost:8000/nominations');
      console.log(newNominationsResults);
      setNominations(newNominationsResults.data);
    } catch (error) {
      console.error(error);
    }
  }

  const onNominate = (e) => {
    e.preventDefault();
    setActive(false);
    setDisabled(true);
    setNominatedNotification(true);
    addNomination();
  };

  // showing movie rating and setting rating
  const onShowRate = (e) => {
    e.preventDefault();
    setShowRating(true);
    setActive(false);
  }

  const onSetRating = (e) => {
    e.preventDefault();
    let rating = e.target.value;
    console.log(rating);
    setShowRating(false);
    setActive(true);
  }

  // deleting nominations
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
    setDeletedNotification(true);
    setMovieTitle(e.target.name);
    deleteNomination(e.target.value);
  };

  return (
    <>
      <style type='text/css'>
        {`
        .btn-rating {
          background-color: #eed202;
          color: white;
        }
        `}
      </style>
      <Row style={{ width: '99%', margin: '10px auto auto' }}>
        <Col className='d-flex flex-row' md={3}>
          <h1 style={{margin: '30px auto auto'}}>The Shoppies 🏆</h1>
        </Col>
        <Col md={{ span: 3, offset: 6 }}>
        <Toast 
          role="alert"
          show={showNominatedNotification} 
          onClose={() => setNominatedNotification(false)}
          delay={2000}
          autohide
        >
          <Toast.Header>
            <h6 className='mr-auto'><strong>Nominated {movieData.Title}</strong></h6>
          </Toast.Header>
          <Toast.Body>Successfully nominated {movieData.Title} for a Shoppy</Toast.Body>
        </Toast>
        <Toast
          role="alert"
          show={showDeletedNotification} 
          onClose={() => setDeletedNotification(false)}
          delay={2000}
          autohide
        >
          <Toast.Header>
            <h6 className='mr-auto'><strong>Deleted {movieData.Title}</strong></h6>
          </Toast.Header>
          <Toast.Body>Successfully deleted your nomination for {movieData.Title}</Toast.Body>
        </Toast> 
        </Col>
      </Row>
      <Row>
        <Card
          style={{ width: '90%', margin: '40px auto auto' }}
        >
          <Card.Body>
            <h6><strong>Movie title</strong></h6>
            <Form.Group className='has-search'>
              <Form onSubmit={onSubmit}>
                <OutlinedInput    
                  disableUnderline={true}
                  id="input-with-icon-adornment"
                  startAdornment={
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  }           
                  type='text'
                  label='Outlined'
                  required
                  value={movieTitle}
                  variant='outlined'
                  placeholder='Search for movies by typing in a movie title...'
                  style={{ width: '100%' }}
                  onChange={e => setMovieTitle(e.target.value)}
                />
              </Form>
            </Form.Group> 
          </Card.Body>
        </Card>
      </Row>
      <Row style={{ width: '95%', margin: '40px auto auto' }}>
        <Col className='col-6'>
          <Card>
            <Card.Body>
              <h6><strong>Results for {movieTitle}</strong></h6>
              {showMovieData && (
                <ListGroup as='ul'>
                  <ListGroup.Item as='li'>
                    <Row>
                      <Col md={6}>
                        <h6>{movieData.Title} ({movieData.Year}) {movieData.rating}</h6>
                      </Col>
                      <Col md={{ span: 3, offset: 3 }}>
                        {active && (
                          <Row>
                            <Col md={6}>
                              <Button 
                                className='float-right' 
                                onClick={onNominate}
                                variant='info' 
                                size='sm'
                              >
                                Nominate
                              </Button>
                            </Col>
                            <Col md={{ span: 3, offset: 2 }}>
                              <Button 
                                className='float-right mr-2' 
                                onClick={onShowRate}
                                variant='dark' 
                                size='sm'
                              >
                                Rate
                              </Button>
                            </Col>
                          </Row>
                        )}
                        {disabled && (
                          <Row>
                          <Col md={6}>
                            <Button 
                              className='float-right' 
                              onClick={onNominate}
                              variant='info' 
                              size='sm'
                              disabled
                            >
                              Nominate
                            </Button>
                          </Col>
                          <Col md={{ span: 3, offset: 2 }}>
                            <Button 
                              className='float-right mr-2' 
                              onClick
                              variant='dark' 
                              size='sm'
                              disabled
                            >
                              Rate
                            </Button>
                          </Col>
                        </Row>
                        )}
                        {showRating && (
                          <Col>
                            <ButtonToolbar>
                              <ButtonGroup className='mr-2' aria-label='First group'>
                              <Button variant='rating' value='1 Star' onClick={onSetRating}>1</Button> 
                              <Button variant='rating' value='2 Stars' onClick={onSetRating}>2</Button> 
                              <Button variant='rating' value='3 Stars' onClick={onSetRating}>3</Button> 
                              <Button variant='rating' value='4 Stars' onClick={onSetRating}>4</Button>
                              <Button variant='rating' value='5 Stars' onClick={onSetRating}>5</Button>
                              </ButtonGroup>
                            </ButtonToolbar>
                          </Col>
                        )}
                      </Col>
                    </Row>
                  </ListGroup.Item>
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col className='col-6'>
          <Card>
            <Card.Body>
              <h6><strong>Nominations</strong></h6>
              <ListGroup as='ul'>
                  {nominations.map((entry) => (
                    <ListGroup.Item as='li' id={entry.id}>
                      <Row>
                        <Col md={6}>
                          <h6>{entry.title} ({entry.year})</h6>
                        </Col>
                        <Col md={{ span: 3, offset: 3 }}>
                          <Button 
                            className='float-right' 
                            onClick={onDelete}
                            value={entry._id}
                            name={entry.Title}
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
