import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import ViewTokenImg from "../../assets/images/generate_viewToken.png";
import AlertIcon from "../../assets/images/alertIcon.png";
import CopyIcon from "../../assets/images/copyIcon.png";
import DownloadIcon from "../../assets/images/downloadIcon.png";
import GenericButton from '../GenericButton/GenericButton';
import { Container, Card, Col, Row, Form} from 'react-bootstrap';
import styles from "./ViewToken.module.css";
import InfoCard from '../InfoCard/InfoCard';


function viewToken() {
  function copyToken() {
    var copyText = document.getElementById("token");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
    alert("Copied the token: " + copyText.value);
  }

  function downloadToken() {
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
          <div className='mt-3'>Please find the token generated below.</div> 
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
          <InfoCard icon={AlertIcon} className='alertCard' title="Alert!" text="something somthing" impText=" something important" />
          </div>
        <img src={ViewTokenImg} alt="View Token Image" className="col-md-6"/>
        </div>
    </>
  )
}

export default viewToken