import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ViewTokenImg from "../../assets/images/generate_viewToken.png";
import AlertIcon from "../../assets/images/alertIcon.png";
import CopyIcon from "../../assets/images/copyIcon.png";
import DownloadIcon from "../../assets/images/downloadIcon.png";
import GenericButton from '../GenericButton/GenericButton';
import { Container, Card, Col, Row} from 'react-bootstrap';
import styles from "./ViewToken.module.css";

function viewToken() {
  const bstyles = {
    style1: {
      color: 'red',
    },
    style2: {
      background: 'linear-gradient(270deg, #5367CA 0%, #73BAF4 100%)',
      margin: '20px',
      padding: '20px',
      width: '100%'
    }
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
                  <GenericButton img={CopyIcon} text='Copy' type='primary' styles={bstyles.style2} />
                </Col>
                <Col>
                  <GenericButton img={DownloadIcon} text='Download' type='primary' styles={bstyles.style2} />
                </Col>
            </Row>
          </Container>
          <Card className='p-3'>
            <Card.Title className={styles['card-title']}><span><img src={AlertIcon} alt="Alert Icon"/></span> Alert!</Card.Title>
            <Card.Text className={styles['card-text']}>
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