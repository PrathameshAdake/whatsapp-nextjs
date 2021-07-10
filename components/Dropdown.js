import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useCollection } from 'react-firebase-hooks/firestore';
import { auth, db } from '../firebase';
import router from 'next/router';
import { Snackbar } from '@material-ui/core';
import { useAuthState } from 'react-firebase-hooks/auth';

// Confirm box before deleting and profile route
//https://www.youtube.com/watch?v=KOryCvYE4_s Confirm box



function Dropdown() {

    const [user] = useAuthState(auth);
    const messageIndex = [];

    const [ userSnapShot] = useCollection(
        db.collection("users")
    )

    const [ contactSnapShot ] = useCollection(
        db.collection("users")
        .doc(user.uid)
        .collection("contacts")
    )

    const [ chatSnapShot ] = useCollection(
        db.collection("chats")
    )

    const messageSS = db.collection("chats")
                        .doc(router.query.id)
                        .collection("messages")
                        .orderBy("timestamp", "asc")
    const [ messageSnapShot ] = useCollection(messageSS);

    const clearChat = () => {

        // messageSnapShot?.docs?.map((message) => {
        //     messageIndex.push(message.id);
        // })

        // for(let i = 0; i<messageIndex.length ; i++){
        //     db.collection("chats")
        //     .doc(router.query.id)
        //     .collection("messages")
        //     .doc(messageIndex[i])
        //     .delete()
        // }

        messageSnapShot?.docs.map((message) => {
            db.collection("chats")
            .doc(router.query.id)
            .collection("messages")
            .doc(message.id)
            .delete()
        })
    }

    const exitChat = () => {
        let recipientUID;
        
        clearChat();

        chatSnapShot?.docs?.map((chat) => {
            db.collection("chats")
            .doc(router.query.id)
            .delete()
        })

        contactSnapShot?.docs?.map((contact) => {
            contact.data().chatId === router.query.id
            ? recipientUID = contact.data().uid
            : recipientUID = recipientUID
            
            db.collection("users")
            .doc(user.uid)
            .collection("contacts")
            .doc(router.query.id)
            .delete()
        })

        userSnapShot?.docs?.map((contact) => {
            db.collection("users")
            .doc(recipientUID)
            .collection("contacts")
            .doc(router.query.id)
            .delete()
        })

        router.replace('/');
    }

    return (
        <DropDownn>
            <DropDownContent>
                <DropDownItem onClick={clearChat}>Clear Chat</DropDownItem>
                <DropDownItem onClick={exitChat}>Exit Chat</DropDownItem>
                <DropDownItem>Profile</DropDownItem>
            </DropDownContent>
        </DropDownn>
    )
}

export default Dropdown;

const DropDownn = styled.div `
    position: relative;
    margin-bottom: -70px;
    margin-right: -10px;
    margin-left: -20px; 
`;

const DropDownContent = styled.div `
    position: relative;
    top: 110%;
    background-color: #2a2f32;
    box-shadow: 3px 3px 10px 6px rgba(0, 0, 0, 0.4);
    font-weight: normal;
    margin-right: 300px;
    color: lightgray;
    width: 29%;

`;

const DropDownItem = styled.div `
    margin-top: 5px;
    padding-top: 10px;
    padding-bottom: 10px;
    padding-left: 10px;

    :hover{
        background-color: #495057;
    }
`;