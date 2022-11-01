import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ViewTokenImg from "../../assets/images/generate_viewToken.png";
import AlertIcon from "../../assets/images/alertIcon.png";
import CopyIcon from "../../assets/images/copyIcon.png";
import DownloadIcon from "../../assets/images/downloadIcon.png";
import GenericButton from '../GenericButton/GenericButton';
import { Container, Card, Col, Row, Form} from 'react-bootstrap';
import styles from "./ViewToken.module.css";


function viewToken() {
  function copyToken() {
    var copyText = document.getElementById("token");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
    alert("Copied the token: " + copyText.value);
  }

  const downloadToken = () => {
    const element = document.createElement("a");
    const file = new Blob([document.getElementById('token').value],    
                {type: 'text/plain;charset=utf-8'});
    element.href = URL.createObjectURL(file);
    element.download = "myToken.txt";
    document.body.appendChild(element);
    element.click();
  }
  
  const bstyles = {
    style2: {
      background: 'linear-gradient(270deg, #5367CA 0%, #73BAF4 100%)',
      width: ''
    }
  }
  
  return (
    <>
    <div className='row mx-5 px-5'>
        <div className='col-md-6'>
          <h2 className='my-3'>Connect your system with the DIVOC Platform</h2>
          <div className='my-3'>Please find the token generated below.</div> 
          <div >You can copy it to the clipboard or download the same</div>
          <Form.Control className='my-3' size="lg" type="text" readOnly id='token' defaultValue="@sample*generated#token^" />
          <Container fluid className='my-3'>
            <Row gutterX='3'>
                <Col>
                  <GenericButton img={CopyIcon} text='Copy' type='primary' onClick={copyToken} />
                </Col>
                <Col>
                  <GenericButton img={DownloadIcon} text='Download' type='primary' onClick={downloadToken} />
                </Col>
            </Row>
          </Container>
          <Card className='p-3 my-3 text-info'>
            <Card.Title ><span><img src={AlertIcon} alt="Alert Icon"/></span> Alert!</Card.Title>
            <Card.Text >
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