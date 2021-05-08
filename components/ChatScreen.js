import { useRef, useState } from "react";
import firebase from "firebase";
import { Avatar, IconButton, jssPreset } from "@material-ui/core";
import {
  MoreVert,
  AttachFile,
  InsertEmoticon,
  Mic,
  SportsMotorsportsSharp,
} from "@material-ui/icons";
import styled from "styled-components";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { useRouter } from "next/router";
import { auth, db } from "../firebase";
import Message from "../components/Message";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";

export default function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const [input, setInput] = useState("");

  const endOfMessagesRef = useRef(null);
  const [messageSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timeStamp", "asc")
  );

  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.users, user))
  );

  const showMessages = () => {
    if (messageSnapshot)
      return messageSnapshot?.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timeStamp: message.data().timeStamp?.toDate().getTime(),
          }}
        />
      ));
    else {
      return JSON.parse(messages).map((message) => (
        <Message
          key={message.id}
          user={message.user}
          message={message}
          server
        />
      ));
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      {
        merge: true,
      }
    );

    db.collection("chats").doc(router.query.id).collection("messages").add({
      timeStamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    setInput(() => "");

    scrollToBottom();
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(chat.users, user);

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behaiviour: "smooth",
      block: "start",
    });
  };

  return (
    <Container>
      <Header>
        {recipient ? (
          <Avatar src={recipient.photoUrl} />
        ) : (
          <Avatar>{recipientEmail[0]}</Avatar>
        )}

        <HeaderInformation>
          <h3>{recipientEmail}</h3>

          {recipientSnapshot ? (
            <p>
              Last seen{" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p> Loading</p>
          )}
        </HeaderInformation>
        <HeaderIcons>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </HeaderIcons>
      </Header>
      <MessageContainer>
        {showMessages()}
        <EndOfMessage ref={endOfMessagesRef} />
      </MessageContainer>
      <InputContainer>
        <InsertEmoticon />
        <Input value={input} onChange={(e) => setInput(e.target.value)} />
        <button
          hidden
          disabled={!input}
          type="submit"
          onClick={sendMessage}
        ></button>

        <Mic />
      </InputContainer>
    </Container>
  );
}

const Container = styled.div`
  border-bottom: 1px solid whitesmoke;
`;

const MessageContainer = styled.div`
  padding: 30px;
  background-color: #e5ded8;
  min-height: 90vh;
`;

const InputContainer = styled.form`
  display: flex;
  position: sticky;
  align-items: center;
  padding: 10px;
  bottom: 0;
  background-color: white;
  z-index: 100;
`;
const Input = styled.input`
  flex: 1;
  outline: 0;
  border: none;
  border-radius: 10px;

  padding: 20px;
  margin: 0 15px;
  background-color: whitesmoke;
`;

const EndOfMessage = styled.div`
  margin-bottom: 50px;
`;

const Header = styled.div`
  position: sticky;
  background-color: white;
  z-index: 100;
  top: 0;
  display: flex;
  padding: 11px;
  height: 80px;
  align-items: center;
  border-bottom: 1px solid whitesmoke;
`;

const HeaderInformation = styled.div`
  margin-left: 15px;
  flex: 1;

  > h3 {
    margin-bottom: 1px;
  }

  > p {
    font-size: 14px;
    color: grey;
  }
`;

const HeaderIcons = styled.div``;
