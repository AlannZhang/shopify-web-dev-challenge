import { React, useEffect, useState } from 'react';
import { Row, Col, Card, Form } from 'react-bootstrap';

const Home = () => {
  

  return (
    <>
      <Row>
        <h1>The Shoppies</h1>
      </Row>
      <Row>
        <Card>
          <Card.Body>
            <h6>Movie title</h6>
            <Form>
              <input
                type='text'
                required
                placeholder='Search using a movie title...'
              />
            </Form>
          </Card.Body>
        </Card>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <h6><strong>Results for</strong></h6>
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