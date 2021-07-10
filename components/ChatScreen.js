import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import styled from 'styled-components';
import { Avatar } from '@material-ui/core';
import { auth, db } from '../firebase';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import { useCollection } from 'react-firebase-hooks/firestore';
import InsertEmoticonIcon from '@material-ui/icons/InsertEmoticon';
import MicIcon from '@material-ui/icons/Mic';
import Message from './Message';
import { useRef, useState } from 'react';
import firebase from 'firebase';
import getRecipientEmail from '../utils/getRecipientEmail';
import TimeAgo from 'timeago-react';
import Dropdown from './Dropdown';


function ChatScreen({ chat, messages }) {

    const [user] = useAuthState(auth);
    
    const [input, setInput] = useState("");
    const [ dropDownToggle, setDropDownToggle ] = useState(false);

    const router = useRouter();
    const endOfMessageRef = useRef(null);

    const [ messageSnapShot ] = useCollection(
        db.collection("chats")
        .doc(router.query.id)
        .collection("messages")
        .orderBy("timestamp", "asc")
    );
        
    const [ recipientSnapshot ] = useCollection(
        db.collection("users").where("email", "==", getRecipientEmail(chat.users, user))
    )
    const recipient = recipientSnapshot?.docs?.[0]?.data();
    const recipientEmailInitial = getRecipientEmail(chat.users, user);

    const showMessages = () => {
        if(messageSnapShot){
            return messageSnapShot?.docs?.map( (message) => (
                // console.log(message.id, " => ", message.data())
                <Message 
                    key={message.id}
                    user={message.data().user}
                    message={{
                        ...message.data(),
                        timestamp: message.data().timestamp?.toDate().getTime(),
                    }}
                />
            ))
        } else {
            return JSON.parse(messages).map(message => (
                <Message 
                    key={message.id}
                    user={message.user}
                    message={message}
                />
            ))
        }
    }

    
    const sendMessage = (e) => {
        e.preventDefault();
        
        //Update Last Seen
        if(input === ""){
            alert("Message can't be empty!");
            setInput('');
        }
        else{
            db.collection("users").doc(user.uid).set({
                lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
            }, {merge: true});
            
            db.collection("chats").doc(router.query.id).collection("messages").add({
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                message: input,
                user: user.email,
                photoURL: user.photoURL,
            });
            setInput('');
            scrollToBottom();
        }
    }

    
    
    const scrollToBottom = () => {
        endOfMessageRef.current.scrollIntoView({
            behaviour: "smooth",
            block: "start"
        })
    }

    const dropDownToggleFunction = (e) => {
        e.preventDefault();
        setDropDownToggle(!dropDownToggle);
    }

    return (
        <Container>
            <Header>
                {recipient ? (
                  
                    <Avatar src={recipient?.photoURL} /> 
                    ) : (
                    <Avatar>{recipientEmailInitial[0]}</Avatar>
                    )
                }

                <HeaderInformation>
                    <h3>{recipient?.name ? recipient?.name : getRecipientEmail(chat.users, user)}</h3>
                    {recipientSnapshot ? (
                        <p>Last Active: {''}
                        {recipient?.lastSeen?.toDate() ? (
                            <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                        ) : "Unavailable"}
                        </p>
                    ) :(
                        <p>Loading Last Active...</p>
                    ) }
                </HeaderInformation>
                <HeaderIcons>
                    <IconButton>
                        <AttachFileIcon style={{ color: "lightgrey"}} />
                    </IconButton>                    
                </HeaderIcons>
                <HeaderIcons>
                    <IconButton onClick={dropDownToggleFunction}>
                        <MoreVertIcon style={{ color: "lightgrey"}} />
                        {dropDownToggle ? <Dropdown /> : null}
                    </IconButton>
                </HeaderIcons>
            </Header>
            <MessageContainer>
                {showMessages()}
                <EndOfMessage ref={endOfMessageRef} />
            </MessageContainer>
            <InputContainer>
                <InsertEmoticonIcon style={{ color: "lightgrey"}} />
                <Input value={input} placeholder="Enter Your Message Here" onChange={e => setInput(e.target.value)} />
                <button hidden disabled={!input} type="submit" onClick={sendMessage} >Send Message</button>
                <MicIcon style={{ color: "lightgrey"}} />
            </InputContainer>
        </Container>
    )
}

export default ChatScreen

const Container = styled.div`
    background-color: #212529;
`;


const Header = styled.div`
    background-color: #2a2f32;
    z-index: 100;
    position: sticky;
    top: 0;
    display: flex;
    padding: 11px;
    height: 80px;
    align-items: center;
    border-bottom: 2px solid #343a40;
`;

const HeaderInformation = styled.div `
    margin-left: 15px;
    flex: 1;

    >h3{
        margin-bottom: -5px;
        color: #dee2e6;
    }

    >p{
        font-size: 14px;
        color: lightgray;
    }
`;

const HeaderIcons = styled.div `
    margin-right: 80px;
`;

const IconButton= styled.ul `
    position: fixed;
    margin-top: -14px;
    padding: 5px;
`;

const  MessageContainer = styled.div `
    padding: 30px;
    background-color: #161a1d;
    min-height: 90vh;
`;

const EndOfMessage = styled.div `
    margin-bottom: 50px;
`;

const InputContainer = styled.form `
    display: flex;
    align-items: center;
    position: sticky;
    padding: 10px;
    bottom: 0;
    background-color: #212529;
    z-index: 100;
`;

const Input = styled.input `
    flex: 1;
    padding: 15px;
    background-color: #495057;
    outline: 0;
    border: none;
    font-size: 17px;
    color: #e9ecef;
    border-radius: 50px;
    margin-left: 15px;
    margin-right: 15px;

    ::-webkit-input-placeholder{
        color: #dee2e6;
    }
`;