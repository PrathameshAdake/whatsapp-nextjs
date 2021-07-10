import Head from 'next/head';
import Sidebar from '../components/Sidebar';
import styled from 'styled-components';
import AppInfo from '../components/AppInfo';

export default function Home() {
  return (
    <MainContainer>
      <Head>
        <title>WhatsAppp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Sidebar />
      <AppInfo />
    </MainContainer>
  )
}

const MainContainer = styled.div `
    /* background-color: #212529; */
    display: flex;
`;