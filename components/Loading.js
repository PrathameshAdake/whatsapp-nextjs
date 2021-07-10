import WhatsAppIcon from '@material-ui/icons/WhatsApp';
import styled from "styled-components";
import { Circle } from 'better-react-spinkit';

function Loading() {
    return (
        <center style={{display: "grid", placeItems: "center", height: "100vh"}}>
            <div>
                <WhatsAppIcon style={{marginBottom: 10, height: 200, width: 200}}/>
                <Circle color="#3CBC28" size={60} />
            </div>
        </center>
    )
}

const WhatsApp = styled(WhatsAppIcon) `

`;

export default Loading
