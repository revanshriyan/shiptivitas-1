import React from 'react';
import './Card.css';

export default class Card extends React.Component {
  render() {
    let colorClass = 'Card-grey';
    if (this.props.status === 'in-progress') {
      colorClass = 'Card-blue';
    } else if (this.props.status === 'complete') {
      colorClass = 'Card-green';
    }

    return (
      <div className={`Card ${colorClass}`} data-id={this.props.id}>
        <div className="Card-title">{this.props.name}</div>
        <div className="Card-description">{this.props.description}</div>
      </div>
    );
  }
}