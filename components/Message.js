import moment from "moment";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components"
import { auth } from "../firebase";


function Message({user, message }) {
    const [ userLoggedIn ] = useAuthState(auth);

    const TypeOfMessage = user === userLoggedIn.email ? Sender : Receiver;
    const TypeOfMessageTimeStamp = user === userLoggedIn.email ? SenderTimeStamp : ReceiverTimeStamp;
    const TypeOfMessageColor = user === userLoggedIn.email ? SenderMsgColor : ReceiverMsgColor;

    return (
        <Container>
            <TypeOfMessage>
                <TypeOfMessageColor>{message.message}</TypeOfMessageColor>
                <TypeOfMessageTimeStamp>
                    {message.timestamp ? moment(message.timestamp).format('LT') : '...'}
                </TypeOfMessageTimeStamp>
            </TypeOfMessage>
        </Container>
    )
}

export default Message

const Container = styled.div ``;

const MessageElement = styled.p `
    width: fit-content;
    padding: 15px;
    border-radius: 8px;
    margin: 10px;
    min-width: 60px;
    padding-bottom: 26px;
    position: relative;
    text-align: right;
`;

const Sender = styled(MessageElement) `
    margin-left: auto;
    background-color: #dcf8c6;
`;

const Receiver = styled(MessageElement) `
    background-color: #495057;
    text-align: left;
`;

const TimeStamp = styled.span `
    padding: 10px;
    font-size: 9px;
    position: absolute;
    bottom: 0;
    text-align: right;
    right: 0;
`;

const SenderTimeStamp = styled(TimeStamp) `
    color: black;
`;


const ReceiverTimeStamp = styled(TimeStamp) `
    color: whitesmoke;
`;

const MsgColor = styled.span `
    
`;

const SenderMsgColor = styled(MsgColor) `
    color: black;
`;


const ReceiverMsgColor = styled(MsgColor) `
    color: whitesmoke;
`;