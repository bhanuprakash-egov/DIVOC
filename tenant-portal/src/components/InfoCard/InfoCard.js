import React from 'react'
import { Card } from 'react-bootstrap'

const InfoCard = (props) => {
  return (
    <Card className='p-3 my-3'>
      <Card.Title ><span><img src={props.icon} alt="Alert Icon"/></span> {props.title}</Card.Title>
        <Card.Text >{props.text}
        <br /><strong>{props.impText}</strong>
        </Card.Text>    
    </Card>
  )
}

export default InfoCard