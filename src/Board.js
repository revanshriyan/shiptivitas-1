import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

const API_URL = 'http://localhost:3001/api/v1';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clients: {
        backlog: [],
        inProgress: [],
        complete: [],
      }
    }
  }

  componentDidMount() {
    // Fetch clients from backend on mount
    this.fetchClients();

    // Initialize Dragula after a short delay to ensure DOM is ready
    setTimeout(() => {
      this.initDragula();
    }, 100);
  }

  fetchClients = () => {
    fetch(`${API_URL}/clients`)
      .then(res => res.json())
      .then(clients => {
        this.setState({
          clients: {
            backlog: clients.filter(c => c.status === 'backlog').sort((a, b) => a.priority - b.priority),
            inProgress: clients.filter(c => c.status === 'in-progress').sort((a, b) => a.priority - b.priority),
            complete: clients.filter(c => c.status === 'complete').sort((a, b) => a.priority - b.priority),
          }
        });
      })
      .catch(err => console.error('Error fetching clients:', err));
  }

  initDragula = () => {
    const containers = [
      document.querySelector('[data-status="backlog"]'),
      document.querySelector('[data-status="in-progress"]'),
      document.querySelector('[data-status="complete"]')
    ].filter(el => el !== null);

    if (containers.length !== 3) {
      console.error('Could not find all swimlane containers');
      return;
    }

    this.drake = Dragula(containers);

    this.drake.on('drop', (el, target, source, sibling) => {
      // Cancel Dragula's DOM manipulation - let React handle it
      this.drake.cancel(true);

      const newStatus = target.getAttribute('data-status');
      const cardId = el.getAttribute('data-id');

      // Calculate new priority based on position in target swimlane
      const targetCards = Array.from(target.children);
      const newPriority = targetCards.indexOf(el) + 1;

      // Call API to update backend
      fetch(`${API_URL}/clients/${cardId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, priority: newPriority })
      })
      .then(res => res.json())
      .then(() => {
        // Re-fetch all clients from server to get updated state
        this.fetchClients();
      })
      .catch(err => console.error('Error updating client:', err));
    });
  }

  componentWillUnmount() {
    if (this.drake) {
      this.drake.destroy();
    }
  }

  renderSwimlane(name, clients, status) {
    return (
      <Swimlane 
        name={name} 
        clients={clients} 
        status={status}
      />
    );
  }

  render() {
    return (
      <div className="Board">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-4">
              {this.renderSwimlane('Backlog', this.state.clients.backlog, 'backlog')}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('In Progress', this.state.clients.inProgress, 'in-progress')}
            </div>
            <div className="col-md-4">
              {this.renderSwimlane('Complete', this.state.clients.complete, 'complete')}
            </div>
          </div>
        </div>
      </div>
    );
  }
}