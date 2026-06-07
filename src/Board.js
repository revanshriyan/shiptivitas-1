import React from 'react';
import Dragula from 'dragula';
import 'dragula/dist/dragula.css';
import Swimlane from './Swimlane';
import './Board.css';

export default class Board extends React.Component {
  constructor(props) {
    super(props);
    const clients = this.getClients();
    this.state = {
      clients: {
        backlog: clients.filter(client => !client.status || client.status === 'backlog'),
        inProgress: clients.filter(client => client.status && client.status === 'in-progress'),
        complete: clients.filter(client => client.status && client.status === 'complete'),
      }
    }
  }

  getClients() {
    return [
      ['1','Stark, White and Abbott','Cloned Optimal Architecture', 'in-progress'],
      ['2','Wiza LLC','Exclusive Bandwidth-Monitored Implementation', 'complete'],
      ['3','Nolan LLC','Vision-Oriented 4Thgeneration Graphicaluserinterface', 'backlog'],
      ['4','Thompson PLC','Streamlined Regional Knowledgeuser', 'in-progress'],
      ['5','Walker-Williamson','Team-Oriented 6Thgeneration Matrix', 'in-progress'],
      ['6','Boehm and Sons','Automated Systematic Paradigm', 'backlog'],
      ['7','Runolfsson, Hegmann and Block','Integrated Transitional Strategy', 'backlog'],
      ['8','Schumm-Labadie','Operative Heuristic Challenge', 'backlog'],
      ['9','Kohler Group','Re-Contextualized Multi-Tasking Attitude', 'backlog'],
      ['10','Romaguera Inc','Managed Foreground Toolset', 'backlog'],
      ['11','Reilly-King','Future-Proofed Interactive Toolset', 'complete'],
      ['12','Emard, Champlin and Runolfsdottir','Devolved Needs-Based Capability', 'backlog'],
      ['13','Fritsch, Cronin and Wolff','Open-Source 3Rdgeneration Website', 'complete'],
      ['14','Borer LLC','Profit-Focused Incremental Orchestration', 'backlog'],
      ['15','Emmerich-Ankunding','User-Centric Stable Extranet', 'in-progress'],
      ['16','Willms-Abbott','Progressive Bandwidth-Monitored Access', 'in-progress'],
      ['17','Brekke PLC','Intuitive User-Facing Customerloyalty', 'complete'],
      ['18','Bins, Toy and Klocko','Integrated Assymetric Software', 'backlog'],
      ['19','Hodkiewicz-Hayes','Programmable Systematic Securedline', 'backlog'],
      ['20','Murphy, Lang and Ferry','Organized Explicit Access', 'backlog'],
    ].map(companyDetails => ({
      id: companyDetails[0],
      name: companyDetails[1],
      description: companyDetails[2],
      status: companyDetails[3],
    }));
  }

  componentDidMount() {
    const containers = [
      document.querySelector('[data-status="backlog"]'),
      document.querySelector('[data-status="in-progress"]'),
      document.querySelector('[data-status="complete"]')
    ].filter(el => el !== null);

    if (containers.length === 3) {
      this.drake = Dragula(containers);

      this.drake.on('drop', (el, target, source, sibling) => {
        // CRITICAL FIX: Cancel the DOM manipulation so React can handle it
        this.drake.cancel(true);
        
        const newStatus = target.getAttribute('data-status');
        const cardId = el.getAttribute('data-id');

        this.setState(prevState => {
          const allClients = [
            ...prevState.clients.backlog,
            ...prevState.clients.inProgress,
            ...prevState.clients.complete
          ];

          const updatedClients = allClients.map(client => {
            if (client.id === cardId) {
              return { ...client, status: newStatus };
            }
            return client;
          });

          return {
            clients: {
              backlog: updatedClients.filter(client => !client.status || client.status === 'backlog'),
              inProgress: updatedClients.filter(client => client.status === 'in-progress'),
              complete: updatedClients.filter(client => client.status === 'complete'),
            }
          };
        });
      });
    }
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