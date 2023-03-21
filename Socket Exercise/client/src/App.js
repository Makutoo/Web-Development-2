import React, { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

function App() {
  const [state, setState] = useState({ message: '', name: '' });
  const [room, setRoom] = useState('');
  const [chat, setChat] = useState([]);

  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io('/');
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const myRoom = room
    socketRef.current.on('message', (data) => {
      const name = data.name
      const message = data.message
      const roomThatTheMessageComeFrom = data.room
      console.log('The server has sent some data to all clients');
      console.log('This message come from Room#: ' + roomThatTheMessageComeFrom)
      console.log('myRoom:' + myRoom)
      if (roomThatTheMessageComeFrom === myRoom) {
        setChat([...chat, { name, message }]);
      }
    });
    socketRef.current.on('user_join', function (someUser) {
      const myRoom = room
      const someUserName = someUser.name
      const someUserRoom = someUser.room
      if (myRoom === someUserRoom) {
        setChat([
          ...chat,
          { name: 'ChatBot', message: `${someUserName} has joined the chat at Room ${myRoom}` },
        ]);
      }
    });

    return () => {
      socketRef.current.off('message');
      socketRef.current.off('user-join');
    };
  }, [chat, room]);

  const userjoin = (name, room) => {
    //console.log(`inside userjoin function, the name is ${name}, the room is ${room}`)
    const user = { name: name, room: room }
    socketRef.current.emit('user_join', user);
  };

  const onMessageSubmit = (e) => {
    let msgEle = document.getElementById('message');
    // console.log([msgEle.name], msgEle.value);
    // console.log(room);
    setChat([
      ...chat,
      { name: 'You', message: msgEle.value },
    ]);
    setState({ ...state, [msgEle.name]: msgEle.value });

    socketRef.current.emit('message', {
      name: state.name,
      message: msgEle.value,
      room: room
    });
    e.preventDefault();
    setState({ message: '', name: state.name });
    msgEle.value = '';
    msgEle.focus();
  };

  const renderChat = () => {
    return chat.map(({ name, message }, index) => (
      <div key={index}>
        <h3>
          {name}: <span>{message}</span>
        </h3>
      </div>
    ));
  };

  return (
    <div>
      {state.name && (
        <div className='card'>
          <div className='render-chat'>
            <h1>Chat Log</h1>
            <h1>Room#: {room}</h1>
            {renderChat()}
          </div>
          <form onSubmit={onMessageSubmit}>
            <h1>Messenger</h1>
            <div>
              <input
                name='message'
                id='message'
                variant='outlined'
                label='Message'
              />
            </div>
            <button>Send Message</button>
          </form>
        </div>
      )}

      {!state.name && (
        <form
          className='form'
          onSubmit={(e) => {
            e.preventDefault();
            setState({ name: document.getElementById('username_input').value });
            setRoom(document.getElementById('room_number').value);
            userjoin(document.getElementById('username_input').value, document.getElementById('room_number').value);
            setChat([
              ...chat,
              { name: 'ChatBot', message: `You has joined the chat` },
            ]);
          }}
        >
          <div className='form-group'>
            <label>
              User Name:
              <br />
              <input id='username_input' />
              <br />
              <br />
              Room Number
              <br />
              <select id="room_number" name="room_number">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>

            </label>
          </div>
          <br />

          <br />
          <br />
          <button type='submit'> Click to join</button>
        </form>
      )}
    </div>
  );
}

export default App;
