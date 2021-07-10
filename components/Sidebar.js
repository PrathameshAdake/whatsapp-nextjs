import { Avatar, Button, IconButton } from "@material-ui/core";
import styled from "styled-components";
import ChatIcon from "@material-ui/icons/Chat";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import * as EmailValidator  from 'email-validator';
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore"
import Chat from "./Chat";
import React, { useEffect, useState } from "react";

function Sidebar() {

    const [ searchChat, setSearchChat ] = useState("");
    const [ contactDetails, setContactDetails ] = useState([]);

    const [user] = useAuthState(auth);
    const userChatRef = db.collection("chats").where("users","array-contains",user.email);
    const [chatsSnapshot] = useCollection(userChatRef);
    
    const userReffff = db.collection("users");
    const [ userReffffSnapshot ] = useCollection(userReffff);
    
    const contactsReff = db.collection("users").doc(user.uid).collection("contacts");
    // const [ contactsReffSnapshot ] = useCollection(contactsReff);
                        

    useEffect(() => {
        contactsReff.onSnapshot((snapshot) => {
            setContactDetails(snapshot.docs.map(doc => doc.data()))
        })
    }, []);

    const createChat = () => {
        const input = prompt('Please enter email address of user you want to chat with');
        
        if(!input) return null;

        if(!userNotLoggedIn(input)){
            alert("User has not created an Account!");
            return null;
        }

        if(EmailValidator.validate(input) && !chatAlreadyExists(input) && input !== user.email){

            let recieverUID;
            let recieverNAME;

            userReffffSnapshot?.docs?.find((contact) => contact.data().email === input ? recieverUID = contact.data().uid : null);
            userReffffSnapshot?.docs?.find((contact) => contact.data().email === input ? recieverNAME = contact.data().name : null);
            

            // we add the chat into the DB 'chats' collection if it doesn't already exists and is valid
            db.collection("chats").add({
                users: [user.email, input],
            })
            .then(function(docRef){
                
                db.collection("users")
                .doc(user.uid)
                .collection("contacts")
                .doc(docRef.id)
                .set({
                    contactName: recieverNAME,
                    chatId: docRef.id,
                    email: input,
                    uid: recieverUID
                })
                //set doc.ref
    
                db.collection("users")
                .doc(recieverUID)
                .collection("contacts")
                .doc(docRef.id)
                .set({
                    contactName: user.displayName,
                    chatId: docRef.id,
                    email: user.email,
                    uid: user.uid
                })
            })


        }
    };

    //check if user has an account or not, if no account then chat wont be initiated
    const userNotLoggedIn = (recipientEmail) => {
        let VarPos;
        let VarFail;
        let returnVal;
        !!userReffffSnapshot?.docs?.find((doc) => {
            const found = doc.data().email === recipientEmail;
            found === true ? VarPos = true : VarFail = false;
        });
        VarPos === undefined ? returnVal = false : returnVal = true;
        return returnVal
    }

    const chatAlreadyExists = (recipientEmail) => {
        const res = !!chatsSnapshot?.docs.find((chat) => chat.data().users.find((user) => user === recipientEmail)?.length > 0);
        return res
    }

    

    return (
        <Container>
            <Header>
                <UserAvatar src={user.photoURL} onClick={() => auth.signOut() } />
                <IconsContainer>
                    <IconButton>
                        <ChatIcon style={{ color: "lightgrey"}} />
                    </IconButton>
                    <IconButton>
                        <MoreVertIcon style={{ color: "lightgrey"}} />
                    </IconButton>
                </IconsContainer>
            </Header>
            <Search>
                <SearchGreyBox>
                    <SearchIconBox>
                        </SearchIconBox>
                    <SearchIcon />
                    <SearchInputBox>
                        <SearchInput placeholder="Search in chats" onChange={
                            (e) => { setSearchChat(e.target.value)}
                        } />
                    </SearchInputBox>
                </SearchGreyBox>
            </Search>
            <SidebarButton onClick={createChat}>
                Start a new Chat
            </SidebarButton>

            {/*List of Chats */}
            {/* {chatsSnapshot?.docs.map(chat => (
                //console.log(chat.data().usernames)
                searchChat === "" 
                ? <Chat key={chat.id} id={chat.id} users={chat.data()} searchActive = {false}  /> 
                : chatsSnapshot?.docs.map(chat => (<Chat key={chat.id} id={chat.id} users={chat.data()} />)) 
            ))} */}

            { contactDetails.filter((contact) => {
                if(searchChat.length === 0){
                    return(chatsSnapshot?.docs?.map(chat => {
                        return(<Chat key={chat.id} id={chat.id} users={chat.data().users} searchActive={false} recipientUser={null} />)
                    }))
                }
                else if(contact.contactName.toLowerCase().includes(searchChat.toLowerCase())){
                    return contact;
                }
            })
            .map((snapshot) => (
                <Chat key={snapshot.chatId} id={snapshot.chatId} users={snapshot.email} recipientUser={snapshot.email} searchActive={true} />
            )) }

        </Container>
    )
}
export default Sidebar;

const Container = styled.div `
    flex: 0.29;
    border-right: 1px solid #343a40;
    height: 100vh;
    min-width: 300px;
    max-width: 350px;
    overflow-y: scroll;
    background-color: #212529;

    ::-webkit-scrollbar{
        display: none;
    }

    --ms-overflow-style: none;
    scrollbar-width: none;

`;

const Header = styled.div `
    display: flex;
    position:sticky;
    top:0;
    background-color: #2a2f32;
    z-index:1;
    justify-content:space-between;
    align-items:center;
    height:80px;
    padding:15px;
    border-bottom: 2px solid #343a40;
`;

const UserAvatar = styled(Avatar)`
    cursor: pointer;
    :hover{
        opacity: 0.8;
    }
`;

const Search = styled.div `
    display: flex;
    align-items: center;
    padding: 20px;
    border-radius: 2px;
    color: #dee2e6;
`;

const SearchGreyBox = styled.div `
    background-color: #6c757d;
    border-radius: 20px;
    padding-top: 10px;
    padding-right: 10px;
    padding-bottom: 10px;
    padding-left: -10px;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
`;

const SearchIconBox = styled.div `
    padding-left: -100px;
    /* padding-right: 10px; */
`;

const SearchInputBox = styled.div `
    padding-left: 20px;
`;

const SearchInput = styled.input `
    outline-width: 0;
    border: none;
    font-size: medium;
    flex: 1;
    background-color: #6c757d;
    align-items: center;
    color: #e9ecef;
    
    ::-webkit-input-placeholder{
        color: #dee2e6;
    }
`;

const IconsContainer = styled.div ``;

const SidebarButton = styled(Button) `
    width:100%;
    background-color: #2a2f32;

    &&&{
        border-top: 2px solid #343a40;
        border-bottom: 2px solid #343a40;
    }

    :hover{
        background-color: #495057;
    }

    >span{
        color: #dee2e6;
    }
`;