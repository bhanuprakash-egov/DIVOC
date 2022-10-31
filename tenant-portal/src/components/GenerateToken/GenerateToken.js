import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import GenTokenImg from "../../assets/images/generate_viewToken.png";
import GenericButton from '../GenericButton/GenericButton';
import styles from './GenerateToken.module.css';

function generateToken() {
  const bstyles = {
    style1: {
      background: 'linear-gradient(270deg, #5367CA 0%, #73BAF4 100%)',
      width: '200%'
    }
  }

  return (
    <div className='row mx-5 px-5 my-5'>
        <div className='col-md-6 px-5'>
            <div className={styles['title']}>Connect your system with the DIVOC Platform</div>
            <div className={styles['text']}>
                <p>You need to connect to your system with the DIVOC platform to start issuing verifiable credentials.</p>
                <p>Click on the button below to generate the token to connect your system with DIVOC</p>
            </div>            
            <GenericButton img='' text='Generate Token' type='primary' styles=''/>
        </div>
        <img src={GenTokenImg} alt="Generate Token Image" className="col-md-6"/>
    </div>
  )
}

export default generateToken