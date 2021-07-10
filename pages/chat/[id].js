import Head from 'next/head'
import styled from 'styled-components';
import Sidebar from '../../components/Sidebar';
import ChatScreen from '../../components/ChatScreen';
import { auth, db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import getRecipientEmail from '../../utils/getRecipientEmail';
import { useCollection } from 'react-firebase-hooks/firestore';

function Chat({ chat, messages }) {
    
    const [user] = useAuthState(auth)

    // console.log(messages);

    const [ recipientSnapshot ] = useCollection(
        db.collection("users").where("email", "==", getRecipientEmail(chat.users, user))
    )
    const recipient = recipientSnapshot?.docs?.[0]?.data();

    return (
        <Container>
            <Head>
                <title>Chat with {recipient?.name ? recipient?.name : getRecipientEmail(chat.users, user)}</title>
            </Head>
            <Sidebar />
            <ChatContainer>
                <ChatScreen chat={chat} messages={messages} />
            </ChatContainer>
        </Container>
    )
}

export default Chat

export async function getServerSideProps(context){
    // console.log(context)
    const ref = db.collection("chats").doc(context.query.id);

    //prepare msgs on the server
    const messageRes = await 
        ref.collection("messages")
        .orderBy("timestamp","asc")
        .get();

    // console.log(messageRes)

    const messages = messageRes.docs
        .map((doc) => ({
            id:doc.id,
            ...doc.data(),
        }))
        .map((messages) => ({
            ...messages,
            timestamp: messages.timestamp.toDate().getTime(),
        }));

    //prepare the chats
    const chatRes = await ref.get();
    const chat = {
        id : chatRes.id,
        ...chatRes.data(),
    }

    // console.log(chat, messages);

    return{
        props: {
            messages: JSON.stringify(messages),
            chat: chat,
        },
    };
}


const Container = styled.div`
    display:flex
`;

const ChatContainer = styled.div`
    flex:1;
    overflow:scroll;
    height:100vh;

    ::-webkit-scrollbar{
        display : none;
    }

    --ms-overflow-style:none;
    scrollbar-width: none;
`;