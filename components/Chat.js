import { Avatar } from "@material-ui/core";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import styled from "styled-components";
import { auth, db } from "../firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import { useRouter } from 'next/router';

function Chat({ id, users, searchActive, recipientUser }) {

    const router = useRouter();
    const [user] = useAuthState(auth);
    
    const [ recipientSnapshotSearchActive ] = useCollection(
        db.collection("users").where("email", "==", recipientUser)
    )
    
    let recipient;
    let recipientEmail;
    if(searchActive === true){
        recipient = recipientSnapshotSearchActive?.docs?.[0]?.data();
        recipientEmail = recipientUser;
        // console.log(recipientSnapshot)
    }
    else{
        const [ recipientSnapshot ] = useCollection(
            db.collection("users").where("email", "==", getRecipientEmail(users, user))
        )
        recipient = recipientSnapshot?.docs?.[0]?.data();
        recipientEmail = getRecipientEmail(users,user);
    }
    const enterChat = () => {
        router.replace(`/chat/${id}`);
    }

    return (
        <Container onClick={enterChat}>
            {   
                recipient ? (
                    <UserAvatar src={recipient?.photoURL} />
                ) : (
                    <UserAvatar> {recipientEmail[0]} </UserAvatar>
                ) 
            }
            <p>{recipient?.name ? recipient?.name : recipientEmail}</p>
        </Container>
    )
}

export default Chat

const Container = styled.div `
    display: flex;
    align-items: center;
    cursor: pointer;
    padding-top: 20px;
    padding-right: 15px;
    padding-left: 15px;
    word-break: break-word;
    background-color: #131c21;

    :hover{
        background-color: #495057;
    }

    >p{
        color: #dee2e6;
        margin-top: 10px;
        margin-bottom: 0px;
        padding-bottom: 25px;
        border-bottom: 0.1px solid #343a40;
        flex: 1;
    }
`;

const UserAvatar = styled(Avatar) `
    margin: 5px;
    margin-right: 15px;
`;
