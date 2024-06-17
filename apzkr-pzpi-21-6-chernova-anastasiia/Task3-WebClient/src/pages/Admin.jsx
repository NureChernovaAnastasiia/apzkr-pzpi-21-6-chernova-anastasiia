import React, { useState } from "react";
import { Container, Button } from "react-bootstrap";
import CreateMenu from "../components/modals/CreateMenu";
import CreateMovie from "../components/modals/CreateMovie";
import CreateSchedule from "../components/modals/CreateSchedule";

// Компонент адміністративної панелі
const Admin = () => {
  // Стан для контролю видимості модальних вікон
  const [movieVisible, setMovieVisible] = useState(false);
  const [ScheduleVisible, setScheduleVisible] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);

  return (
    <Container className="d-flex flex-column">
      <Button
        variant={"outline-dark"}
        className="mt-2"
        onClick={() => setMovieVisible(true)}
      >
        Create Movie
      </Button>
      <Button
        variant={"outline-dark"}
        className="mt-2"
        onClick={() => setScheduleVisible(true)}
      >
        Create Schedule
      </Button>
      <Button
        variant={"outline-dark"}
        className="mt-2"
        onClick={() => setMenuVisible(true)}
      >
        Create Menu
      </Button>
      <CreateMenu show={menuVisible} onHide={() => setMenuVisible(false)} />
      <CreateMovie show={movieVisible} onHide={() => setMovieVisible(false)} />
      <CreateSchedule
        show={ScheduleVisible}
        onHide={() => setScheduleVisible(false)}
      />
    </Container>
  );
};

export default Admin;
