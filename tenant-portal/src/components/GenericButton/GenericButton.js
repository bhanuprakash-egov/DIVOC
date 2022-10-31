import React from 'react';
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';

const GenericButton = (props) => {
  return (
        <Button variant={props.type} style={props.styles} className='w-50'>
            <img src={props.img} alt="" className={(props.img ? 'me-3': '')}/><strong>{props.text}</strong>
        </Button>
  )
}

export default GenericButton
