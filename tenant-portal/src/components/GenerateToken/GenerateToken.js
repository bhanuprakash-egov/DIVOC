import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import GenTokenImg from "../../assets/img/generate_viewToken.png";
import CopyIcon from "../../assets/img/copyIcon.png"
import DownloadIcon from "../../assets/img/downloadIcon.png"
import AlertIcon from '../../assets/img/alertIcon.png';
import GenericButton from '../GenericButton/GenericButton';
import styles from './GenerateToken.module.css';
import {useKeycloak} from '@react-keycloak/web'
import {useTranslation} from "react-i18next";
import { Container, Card, Col, Row, Form } from 'react-bootstrap';
import InfoCard from '../InfoCard/InfoCard';
const axios = require('axios');

function GenerateToken() {
  const [token, setToken] = useState("");
  const { t } = useTranslation();
  const {keycloak} = useKeycloak();
  function copyToken() {
    var copyText = document.getElementById("token");
    copyText.select();
    copyText.setSelectionRange(0, 99999);
    navigator.clipboard.writeText(copyText.value);
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

  const getUserId = async () => {    
      const userInfo = await keycloak.loadUserInfo();
      return userInfo.email;
  }
  const getToken = async () => {
      const userId = await getUserId();
      return axios.get(`http://localhost/vc-management/v1/tenant/generatetoken/${userId}`).then(res =>
      res.data.access_token.access_token
  ).catch(error => {
      console.error(error);
      throw error;
  });
  }
  const outputToken = async () => {
      const access_token = await getToken();
      setToken(access_token)
  }

  return (
    <div className='row mx-5 px-5 my-5'>
        <div className='col-md-6 p-2'>
            <div className='title'>{t('genTokenPage.title')}</div>
            {token==='' && <div>
              <div className='text'>
              <div className='pb-3'>{t('genTokenPage.text')}</div>
              <div className='pb-3'>{t('genTokenPage.buttonClickInfo')}</div>
              </div>           
              <div onClick={() => outputToken()}><GenericButton img='' text={t('genTokenPage.buttonText')} type='primary' /></div>
            </div>}
            {token && <div>
              <div className='text'>
              <p className='mb-0'>{t('viewTokenPage.text1')}</p>
              <p className='mb-0'>{t('viewTokenPage.text2')}</p>
              </div>
              <Form.Control className='my-3' className={styles['token']} size="lg" type="text" readOnly id='token' defaultValue={token} />
              <Container fluid className='my-3'>
                <Row>
                  <div className='col-md-6 ps-0' onClick={() => copyToken()}>
                  <GenericButton img={CopyIcon} text='Copy' type='primary' />
                  </div>
                  <div className='col-md-6 pe-0' onClick={() =>  downloadToken()}>
                  <GenericButton img={DownloadIcon} text='Download' type='primary' />
                  </div>
                </Row>
              </Container>
              <InfoCard  icon={AlertIcon}
              title={t('viewTokenPage.alertCard.title')}
              text={t('viewTokenPage.alertCard.text')} 
              imptext={t('viewTokenPage.alertCard.imptext')} className='alertCard mt-4' />
            </div>}
        </div>
        <div className="col-md-6 px-3">
        <img src={GenTokenImg} alt="GenToken" />
        </div>
    </div>
  )
}

export default GenerateToken
