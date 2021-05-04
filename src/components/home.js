import { React, useEffect, useState } from 'react';
import { 
  Row, Col, Card, Form, ListGroup, Button, Toast, ButtonToolbar,
  ButtonGroup, Modal,
} from 'react-bootstrap';
import { InputAdornment, OutlinedInput } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import axios from 'axios';
require('dotenv').config();

const Home = () => {
  const [movieTitle, setMovieTitle] = useState('');
  const [resultsMovieTitle, setResultsMovieTitle] = useState('');
  const [movieData, setMovieData] = useState({});
  const [showMovieData, setShowMovieData] = useState(false);
  const [nominations, setNominations] = useState([]);
  const [rating, setRating] = useState('');
  const [active, setActive] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [showNominatedNotification, setNominatedNotification] = useState(false);
  const [showDeletedNotification, setDeletedNotification] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [plot, setPlot] = useState('');

  // retrieve all nominations
  useEffect(() => {
    const getNominations = async () => {
      try {
        const results = await axios.get('.netlify/functions/server/nominations');
        setNominations(results.data);
      } catch (error) {
        console.error(error);
      }
    };

    // show banner if 5 movies are nominated
    if (nominations.length === 5) {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }

    getNominations();
  }, []);

  // show banner if 5 movies are nominated
  useEffect(() => {
    if (nominations.length === 5) {
      setShowBanner(true);
    } else {
      setShowBanner(false);
    }
  }, [nominations]);

  // retrieve movie data from omdb api
  const searchMovieTitle = async () => {
    try {
      const results = await axios.get(`.netlify/functions/server/movies/${movieTitle}`);
      setMovieData(results);
      setActive(true);
      setDisabled(false);
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setShowMovieData(true);
    setShowRating(false);
    searchMovieTitle();
  };

  // adding nominations
  const addNomination = async () => {
    try {
      const params = {
        method: 'post',
        url: '.netlify/functions/server/nominations/add',
        data: {
          title: movieData.Title,
          year: movieData.Year,
          rating,
          plot: movieData.Plot,
        },
      };

      await axios(params);
      const newNominationsResults = await axios.get('.netlify/functions/server/nominations');
      setNominations(newNominationsResults.data);
      setRating('');
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

  // deleting nominations
  const deleteNomination = async (id) => {
    try {
      const params = {
        method: 'delete',
        url: `.netlify/functions/server/nominations/delete/${id}`,
      };

      const deleteResults = await axios(params);
      console.log(deleteResults);

      const newNominationsResults = await axios.get('.netlify/functions/server/nominations/');
      setNominations(newNominationsResults.data);
    } catch (error) {
      console.error(error);
    }
  }

  const onDelete = (id, title) => {
    deleteNomination(id);
    setMovieTitle(title);
    setDeletedNotification(true)
  };

  // showing movie rating and setting rating
  const onShowRate = (e) => {
    e.preventDefault();
    setShowRating(true);
    setActive(false);
  }

  const onSetRating = (e) => {
    e.preventDefault();
    setRating(e.target.value);
    setShowRating(false);
    setActive(true);
  }

  // show plot in modal popup
  const onShowModal = (title, plot) => {
    setPlot(plot);
    setMovieTitle(title);
    setShowModal(true);
  }

  return (
    <>
      <style type='text/css'>
        {`
        .btn-rating {
          background-color: #eed202;
          color: white;
        }
        `}
        {`
        .btn-transparent {
          color: black;
        }
        `}
      </style>
      <Row style={{ width: '90%', margin: '30px auto auto' }}>
        <Col className='d-flex flex-row' md={4}>
          <h1>The Shoppies</h1>
        </Col>
        <Col md={{ span: 4, offset: 4 }}>
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
            <h6 className='mr-auto'><strong>Deleted {movieTitle}</strong></h6>
          </Toast.Header>
          <Toast.Body>Successfully deleted {movieTitle} from your nominations</Toast.Body>
        </Toast> 
        </Col>
      </Row>
      {showBanner && (
        <Row style={{ width: '95%', margin: '30px auto auto' }}>
          <Card
            style={{ width: '95%', margin: '15px auto auto' }}
          >
            <Card.Body>
              <h3>You have nominated 5 movies!</h3>
            </Card.Body>
          </Card>
        </Row>
      )}
      <Row style={{ width: '95%', margin: '15px auto auto' }}>
        <Card
          style={{ width: '95%', margin: '15px auto auto' }}
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
                  onChange={(e) => {
                    setMovieTitle(e.target.value);
                    setResultsMovieTitle(e.target.value);
                  }}
                />
              </Form>
            </Form.Group> 
          </Card.Body>
        </Card>
      </Row>
      <Row style={{ width: '95%', margin: '40px auto auto' }}>
        <Col className='col-6'>
          <Card style={{ width: '95%', margin: 'auto' }}>
            <Card.Body>
              <h6><strong>Results for {resultsMovieTitle}</strong></h6>
              {showMovieData && (
                <ListGroup as='ul'>
                  <ListGroup.Item as='li'>
                    <Row>
                      <Col>
                        <Button
                          className='bg-transparent text-left'
                          onClick={() => onShowModal(movieData.Title, movieData.Plot)}
                          variant='transparent'
                        >
                          <h6>{movieData.Title} ({movieData.Year})</h6>
                        </Button>
                      </Col>
                      <Col>
                        {active && (
                          <Row>
                            <Col>
                              <Button 
                                onClick={onNominate}
                                variant='info' 
                                size='sm'
                              >
                                Nominate
                              </Button>
                            </Col>
                            <Col>
                              <Button 
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
                          <Col>
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
                          <Col>
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
          <Card style={{ width: '95%', margin: 'auto' }}>
            <Card.Body>
              <h6><strong>Nominations</strong></h6>
              <ListGroup as='ul'>
                  {nominations.map((entry) => (
                    <ListGroup.Item as='li' key={entry._id}>
                      <Row>
                        <Col md={6}>
                          <Button
                            className='bg-transparent text-left'
                            onClick={(e) => onShowModal(entry.title, entry.plot)}
                            variant='transparent'
                            style={{ textDecoration: 'none'}}
                          >
                            <h6>{entry.title} ({entry.year})<br/><br/>{entry.rating}</h6>
                          </Button>
                        </Col>
                        <Col md={{ span: 3, offset: 3 }}>
                          <Button 
                            className='float-right' 
                            onClick={(e) => onDelete(entry._id, entry.title)}
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
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          size='lg'
        >
          <Modal.Header closeButton>
            <Modal.Title>Plot of {movieTitle}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{plot}</Modal.Body>
        </Modal>
      </Row>
    </>
  )
};

export default Home;
