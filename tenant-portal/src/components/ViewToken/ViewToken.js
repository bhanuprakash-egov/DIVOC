import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ViewTokenImg from "../../assets/images/generate_viewToken.png";
import AlertIcon from "../../assets/images/alertIcon.png";
import CopyIcon from "../../assets/images/copyIcon.png";
import DownloadIcon from "../../assets/images/downloadIcon.png";
import GenericButton from '../GenericButton/GenericButton';
import { Container, Card, Col, Row} from 'react-bootstrap';
import "./ViewToken.css";

function viewToken() {
  const styles = {
    style1: {
      color: 'red',
    },
    style2: {
      background: 'linear-gradient(270deg, #5367CA 0%, #73BAF4 100%)'
    }
  }
  const classNames = {
    className1: 'm-1 w-100',
    className2: 'm-1 w-50'
  }

  return (
    <>
    <div className='row m-4'>
        <div className='col-md-6'>
          <h2>Connect your system with the DIVOC Platform</h2>
          <p>Please find the token generated below.</p> 
          <p>You can copy it to the clipboard or download the same</p>
          <div>***Generated token will be here***</div>
          <Container fluid>
            <Row gutterX='3'>
                <Col>
                  <GenericButton img={CopyIcon} text='Copy' type='primary' styles={styles.style2} className={classNames.className1}/>
                </Col>
                <Col>
                  <GenericButton img={DownloadIcon} text='Download' type='primary' styles={styles.style2} className={classNames.className1}/>
                </Col>
            </Row>
            <Row gutterX='3'>
                <Col>
                  <GenericButton img={CopyIcon} text='Copy'  styles={styles.style2} />
                </Col>
                <Col>
                  <GenericButton img={DownloadIcon} text='Download' type='' styles={styles.style2} />
                </Col>
            </Row>
            <Row gutterX='3'>
                <Col>
                  <GenericButton img='' text='Copy' type='outline-primary' styles={styles.style1} />
                </Col>
                <Col>
                  <GenericButton text='Download' type='outline-success'  />
                </Col>
            </Row>
          </Container>
          <Card >
            <Card.Title><span><img src={AlertIcon} alt="Alert Icon"/></span> Alert!</Card.Title>
            <Card.Text className='card-text'>
            Make sure to store this safely. Once you leave this page, you will not be able to access this token again.
            <br /><strong>This token is valid for 1 year.</strong>
            </Card.Text>
          </Card>
          </div>
        <img src={ViewTokenImg} alt="View Token Image" className="col-md-6"/>
        </div>
    </>
  )
}

export default viewToken