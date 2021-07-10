import styled from "styled-components";
import Head from 'next/head';
import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import { Button } from "@material-ui/core";
import { auth, provider } from "../firebase";

function Login() {

    const signIn = () => {
        auth.signInWithPopup(provider).catch(alert);
    }

    return (
        <Container>
            <Head>
                <title>Login</title>
            </Head>
            <LoginContainer>
                <Whatsapp />
                <Buttonn onClick={ signIn }>
                    <img src="https://img.icons8.com/color/48/000000/google-logo.png"/>
                    <p>Sign in with Google</p>
                </Buttonn>
                {/* <Button onClick={ signIn } variant="outlined">Sign in with Google</Button> */}
            </LoginContainer>
        </Container>
    )
}

const Container = styled.div `
    display: grid;
    place-items: center;
    height: 100vh;
    background-color: #161a1d;
`;

const LoginContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 100px;
    align-items: center;
    background-color: #2a2f32;
    box-shadow: 0px 4px 14px -3px rgba(0, 0, 0, 0.7)
`;

const Buttonn = styled.div `
    background-color: #161a1d;
    border: solid #adb5bd;
    border-width: 0.5px;
    padding: 5px;
    padding-left: 20px;
    padding-right: 20px;
    transition: 0.4s ease all;
    display: flex;

    :hover{
        background-color: #495057;
        cursor: pointer;
    }

    >img{
        height: 30px;
        padding-right: 20px;
    }

    >p{
        margin: 0px;
        color: #adb5bd;
    }
`;

const Whatsapp = styled(WhatsAppIcon)`
    &&&{
        height: 200px;
        width: 200px;
    }
    margin-bottom: 50px;
`;

export default Login
