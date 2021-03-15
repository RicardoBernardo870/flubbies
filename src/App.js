import React, { Component } from 'react';
import Modal from './Components/PopUp/Modal'
import firebase, { auth, provider } from './firebase'
import { formatDistanceToNow, fromUnixTime } from 'date-fns'
import Accordion from 'react-bootstrap/Accordion'
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';


import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      nome: '',
      morada: '',
      quantidade: '',
      tamanho:'',
      descricao: '',
      preco: '',
      created_at: '',
      items: [],
      user: null,
      activeId: false,
      activeId2: false,
      editing: false,
   
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this);
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
}

handleChange(e) {
   

    this.setState({
      [e.target.name]: e.target.value
    });
  }

logout() {
  auth.signOut()
    .then(() => {
      this.setState({
        user: null
      });
    });
}


login() {
  auth.signInWithPopup(provider) 
    .then((result) => {
      const user = result.user;
      this.setState({
        user
      });
    });
}

modalOpen() {
    this.setState({
      nome: '',
      morada: '',
      quantidade: '',
      tamanho: '',
      descricao: '',
      preco:'',
      completed: false,
      
     
      modal: true });
  }

modalClose() {
    this.setState({
      nome: '',
      morada: '',
      quantidade: '',
      tamanho: '',
      descricao: '',
      preco:'',
      completed: false,
      
     
      modal: false
    });
  }

handleSubmit(e) {
  e.preventDefault();
  const now = new Date();
  const itemsRef = firebase.database().ref('clients');
  const itemsList = firebase.database().ref('clientList');
  const item = {
    nome: this.state.nome,
    morada: this.state.morada,
    quantidade: this.state.quantidade,
    tamanho: this.state.tamanho,
    descricao: this.state.descricao,
    activeId: this.state.activeId,
    activeId2: this.state.activeId2,
    preco: this.state.preco,
    created_at: firebase.firestore.Timestamp.fromDate(now).seconds
  }
  itemsRef.push(item);
  itemsList.push(item);
  this.setState({
      nome: '',
      morada: '',
      quantidade: '',
      tamanho:'',
      descricao: '',
      activeId: false,
      activeId2: false,
      preco:'',
      created_at:'',
      
      modal: false
  });
}

removeItem(itemId) {
    const itemRef = firebase.database().ref(`/clients/${itemId}`);
    itemRef.remove();
  }

completed(itemid, itemact) {
  const itemRef = firebase.database().ref(`/clients/${itemid}`);
  itemRef.update({activeId: !itemact})
}

paidWell(itemid, itemact) {
  const itemRef = firebase.database().ref(`/clients/${itemid}`);
  itemRef.update({activeId2: !itemact})
}

handleEditing (itemid) {
  const itemRef = firebase.database().ref(`/clients/${itemid}`);
 itemRef.on('value', (snapshot) => {
    let items2 = snapshot.val()
    
 
this.setState({
    nome: items2.nome,
    morada: items2.morada,
    descricao: items2.descricao,
    preco: items2.preco,
    tamanho: items2.tamanho,
    quantidade: items2.quantidade,
    activeId2: false,
    activeId: false,
    editing: !this.state.editing
  })
})

}

handleEditingDone (itemid) {
   const itemRef = firebase.database().ref(`/clients/${itemid}`);
   itemRef.update({
    nome: this.state.nome,
    morada: this.state.morada,
    quantidade: this.state.quantidade,
    tamanho: this.state.tamanho,
    descricao: this.state.descricao,
    preco: this.state.preco
  })
   this.setState({
      nome: '',
      morada: '',
      quantidade: '',
      tamanho:'',
      descricao: '',
      activeId: false,
      activeId2: false,
      preco:'',
      created_at:'',
      editing: false,
      modal: false
  });
}

componentDidMount() {

   auth.onAuthStateChanged(user => {
    if (user) {
      this.setState({ user: user });
    }
    ;
  });


  const clientsRef = firebase.database().ref('clients');
  clientsRef.on('value', (snapshot) => {
   
    let items = snapshot.val();
   
    let newState = [];
    for (let item in items) {
      newState.push({
        id: item,
        nome: items[item].nome,
        morada: items[item].morada,
        quantidade: items[item].quantidade,
        tamanho: items[item].tamanho,
        descricao: items[item].descricao,
        activeId: items[item].activeId,
        activeId2: items[item].activeId2,
        preco: items[item].preco,
        created_at: items[item].created_at
      });
    }
    
 this.setState({
   items: newState
   
   
 })
      });


    }

render() {
 
   return (
<div className="App">
   <header>
      <div className="wrapper">
  
  {this.state.user ?
    <button className='btn btn-success' onClick={this.logout}><i className="fas fa-arrow-left"></i></button>                
    :
    <button className='btn btn-success' onClick={this.login}>Log In</button>              
  }
      </div>
   </header>
{this.state.user ?
    <div>
      <div className='user-profile'>
        <img src={this.state.user.photoURL} alt='user' />
      </div>
      <div className='nav'><button className='add' onClick={e => this.modalOpen(e)}>
          <i className="fas fa-plus"></i>
        </button></div>
        <Modal show={this.state.modal} handleClose={e => this.modalClose(e)}>
         
          <div className="form-group">
            <label >Nome:</label>
            <input
              autoComplete='off'
              type="text"
              value={this.state.nome}
              name="nome"
              onChange={this.handleChange}
              className="form-control"
            />
            <label>Morada:</label>
            <input
              autoComplete='off'
              type="text"
              value={this.state.morada}
              name="morada"
              onChange={this.handleChange}
              className="form-control"
            />
            <label>Quantidade:</label>
            <input
              autoComplete='off'
              type="text"
              value={this.state.quantidade}
              name="quantidade"
              onChange={this.handleChange}
              className="form-control"
            />
            <label>Tamanho:</label>
            <input
              autoComplete='off'
              type="text"
              value={this.state.tamanho}
              name="tamanho"
              onChange={this.handleChange}
              className="form-control"
            />
            <label>Descrição:</label>
            <textarea className="form-control" id="exampleFormControlTextarea1" rows="3"
              type="text"
              autoComplete='off'
              value={this.state.descricao}
              name="descricao"
              onChange={this.handleChange}
              
             />
            
            <label>Preço:</label>
            <input
              autoComplete='off'
              type="text"
              value={this.state.preco}
              name="preco"
              onChange={this.handleChange}
              className="form-control"
            />
           
            <button className='add1' onClick={this.handleSubmit} type="button">
              Save
            </button>
          
          
          
          </div>
        </Modal>
        
      {this.state.items.map((item) => {

 let boxClass = [""];
 let pagoClass = ['']
    if(item.activeId2) {
      
      pagoClass.push('span2');
      
    } else {
      pagoClass.push('span1')
    }
    if(item.activeId) {
      boxClass.push('checked')
    }

let viewStyle = {};
let editStyle = {};
if (this.state.editing) {
  viewStyle.display = 'none'
} else {
  editStyle.display = 'none'
}

const when = fromUnixTime(item.created_at)


return (
      <div key={item.id} className='accor'>
      <Accordion >
          <Card >
          <Card.Header>
          <div className='head'>
          <div className='titles'>
          <h3 id={item.id} className={boxClass.join(' ')}>{item.nome}</h3> <h5><span className={pagoClass.join(' ')}>Pago</span></h5>
          </div>
          <span>{formatDistanceToNow(
           when,
            { addSuffix: true}
        )}</span>
        <div className='inlinebutton'>
      <Accordion.Toggle as={Button} variant="link" className='text shadow-none' eventKey={item.id}>
        Open
      </Accordion.Toggle>
      <div className='check'>
           <button className='text' onClick={() => this.completed(item.id, item.activeId)}>
              <i className="fas fa-check"></i>
           </button>
           <button className='text' onClick={() => this.paidWell(item.id, item.activeId2)}>
              <i className="fas fa-funnel-dollar"></i>
           </button>
           <button className='text' onClick={() => this.removeItem(item.id)}>
              <i className="fas fa-trash"></i>
           </button>
     </div>
       </div>
          </div>
  </Card.Header>
    <Accordion.Collapse eventKey={item.id}>
      <Card.Body >
        <ul >
            <li>NOME:
               <div style={viewStyle}>
                   <span>{item.nome}</span>
               </div>
                <input type='text'
                      autoComplete='nope'
                      value={this.state.nome}
                      name='nome'
                      style={editStyle} 
                      className='editing'
                      onChange={this.handleChange}
                      />
            </li>
            <li>MORADA:
               <div style={viewStyle}>
                   <span>{item.morada}</span>
               </div>
                <input type='text'
                      autoComplete='nope'
                      value={this.state.morada}
                      name='morada'
                      style={editStyle} 
                      className='editing'
                      onChange={this.handleChange}
                      />
                
            </li>
            <li>QUANTIDADE:
               <div style={viewStyle}>
                   <span>{item.quantidade}</span>
               </div>
                <input type='text'
                      autoComplete='nope'
                      value={this.state.quantidade}
                      name='quantidade'
                      style={editStyle} 
                      className='editing'
                      onChange={this.handleChange}
                      />
                
            </li>
            <li>TAMANHO:
               <div style={viewStyle}>
                   <span>{item.tamanho}</span>
               </div>
                <input type='text'
                      autoComplete='nope'
                      value={this.state.tamanho}
                      name='tamanho'
                      style={editStyle} 
                      className='editing'
                      onChange={this.handleChange}
                      />
                
            </li>
            <li>DESCRIÇÃO:
               <div style={viewStyle}>
                   <span>{item.descricao}</span>
               </div>
                <textarea type='text'
                      value={this.state.descricao}
                      name='descricao'
                      
                      style={editStyle} 
                      className='editing'
                      onChange={this.handleChange}
                      />
                
            </li>
            <li>PREÇO:
               <div style={viewStyle}>
                   <span>{new Intl.NumberFormat("pt-PT", {
    style: "currency",
    currency: "EUR"
  }).format(parseInt(item.preco, 10))}</span>
               </div>
                <input type='text'
                      value={this.state.preco}
                      name='preco'
                      autoComplete='nope'
                      style={editStyle} 
                      className='editing'
                      onChange={this.handleChange}
                      />
                
            </li>
        </ul>
        <div className='inlinebutton'>
        <button className='text' onClick={() => this.handleEditing(item.id)}>Edit</button>
        <button className='text' style={editStyle} onClick={() => this.handleEditingDone(item.id)}>Done</button>
        </div>
      </Card.Body>
    </Accordion.Collapse>
  </Card>
  </Accordion>
  </div>
        )
      })}
    </div>
    :
    <div className='wrapper'>
      <p>Login to see Flubbers</p>
    </div>
  }
</div>
     
    );
  }
}

export default App;
