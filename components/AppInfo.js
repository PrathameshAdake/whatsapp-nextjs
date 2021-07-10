import React from 'react';
import styled from 'styled-components';

function AppInfo() {
    return (
        <Container>
            <h1>WhatsAppp</h1>
        </Container>
    )
}

export default AppInfo;

const Container = styled.div `
    background-color: #212529;
    display: flex;
    flex:1;
    padding-left: 20px;
    flex-direction: column;

    >h1{
        color: #dee2e6;
        padding-left: 20px;
        padding-bottom: 15px;
        border-bottom: 2px solid #343a40; 
    }
`;
