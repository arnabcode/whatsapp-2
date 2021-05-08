import styled from "styled-components";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import moment from "moment";

export default function Message({ user, message }) {
  const [userLoggedIn] = useAuthState(auth);
  const Type = user === userLoggedIn.email ? Sender : Reciever;
  console.log(message);
  return (
    <Container>
      <Type>
        {message.message}

        <Timestamp>
          {message.timeStamp
            ? moment(new Date(message.timeStamp)).format("LT")
            : "..."}
        </Timestamp>
      </Type>
    </Container>
  );
}

const Container = styled.div``;

const MessageElement = styled.p`
  width: fit-content;

  border-radius: 8px;
  margin: 10px;
  min-width: 60px;
  padding: 8px 8px 25px 8px;
  position: relative;
  text-align: right;
`;

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #dcf8c6;
`;

const Reciever = styled(MessageElement)`
  text-align: left;
  background-color: whitesmoke;
`;

const Timestamp = styled.span`
  font-size: 12px;
  color: grey;

  padding: 10px 10px 4px 10px;
  position: absolute;
  bottom: 0;
  right: 0;
  text-align: right;
`;
