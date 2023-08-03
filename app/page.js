'use client'

import { useState } from 'react';


var ws;

if (typeof window !== 'undefined') {
    ws = new WebSocket("ws://localhost:47782");

    ws.onopen = function() {
        console.log("Web Socket is connected");
    }
}


export default function BaggageStorage() {
    const [state, setState] = useState('enter password');
    const [password, setPassword] = useState('');

    function handleNextClick() {
        (state == 'wrong password') ? setState('enter password') : setState('wrong password');
    }

    if (typeof window !== 'undefined') {
        ws.onmessage = function (evt) { 
            console.log(evt.data);
            setState(evt.data);
        };

        ws.onclose = function() { 
            console.log("Connection is closed..."); 
        }
    }


    function sendCommand(type, value='') {
        const event = {type: type, value: value};

        ws.send(JSON.stringify(event));
    }


    function openTheDoor() {
        sendCommand('provide_password', password);
        setPassword('');
    }


    function closeTheDoor() {
        sendCommand('close');
    }


    function CloseButton() {
        return (
            <button onClick={closeTheDoor}>
                Закрыть
            </button>
        );
    }


    function enterPasswordState() {
        return (
            <div>
                Введите пароль
                <input
                    type='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
                <button onClick={openTheDoor}>
                    Открыть
                </button>
            </div>
        );
    }
    
    
    function wrongPasswordState() {
        return (
            <div>
                Неверный пароль
            </div>
        );
    }
    
    
    function doorOpenedState() {
        return (
            <div>
                Дверь открыта
                <CloseButton />
            </div>
        );
    }
    
    
    function closeTheDoorState() {
        return (
            <div>
                Закройте дверь!
                <CloseButton />
            </div>
        );
    }
    
    
    function errorState() {
        return (
            <div>
                Ошибка
            </div>
        );
    }
    
    
    switch (state) {
        case 'enter password':
            return enterPasswordState();
        case 'wrong password':
            return wrongPasswordState();
        case 'door opened':
            return doorOpenedState();
        case 'close the door':
            return closeTheDoorState();
        default:
            return errorState();
    }
}
