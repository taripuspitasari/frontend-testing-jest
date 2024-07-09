import {useState, useEffect, useRef} from "react";
import Note from "./components/Note";
import Notification from "./components/Notification";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm";
import NoteForm from "./components/NoteForm";
import noteService from "./services/notes";
import loginService from "./services/login";
import Togglable from "./components/Togglable";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [showAll, setShowAll] = useState(true);
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [user, setUser] = useState(null);
  const [loginVisible, setLoginVisible] = useState(false);
  const noteFormRef = useRef();

  useEffect(() => {
    if (user) {
      noteService.getAll().then(initialNotes => {
        setNotes(initialNotes);
      });
    } else {
      setNotes([]);
    }
  }, [user]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      noteService.setToken(user.token);
    }
  }, []);

  const addNote = async noteObject => {
    try {
      noteFormRef.current.toggleVisibility();
      const returnedNote = await noteService.create(noteObject);
      setNotes(notes.concat(returnedNote));
      setSuccessMessage("Note is added!");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (error) {
      setErrorMessage("Failed to add note");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const toggleImportanceOf = async id => {
    const note = notes.find(n => n.id === id);
    const changedNote = {...note, important: !note.important};

    try {
      const returnedNote = await noteService.update(id, changedNote);
      setNotes(notes.map(note => (note.id !== id ? note : returnedNote)));
      setSuccessMessage(
        `Note '${note.content}' was already update from server`
      );
      setTimeout(() => {
        setSuccessMessage(null);
      }, 5000);
    } catch (error) {
      setErrorMessage(error);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleDelete = async id => {
    const deletedNote = notes.find(note => note.id === id);
    if (window.confirm(`Delete note: ${deletedNote.content}?`)) {
      try {
        await noteService.remove(id);
        setNotes(notes.filter(note => note.id !== id));
        setSuccessMessage(`Deleted note with ID ${id}`);
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      } catch (error) {
        setErrorMessage(error);
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      }
    }
  };

  const handleLogin = async userObject => {
    try {
      const user = await loginService.login(userObject);
      window.localStorage.setItem("loggedNoteappUser", JSON.stringify(user));
      noteService.setToken(user.token);
      setUser(user);
    } catch (error) {
      setErrorMessage("Wrong credentials");
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem("loggedNoteappUser");
    setUser(null);
  };

  const notesToShow = showAll ? notes : notes.filter(note => note.important);

  const loginForm = () => {
    const hideWhenVisible = {display: loginVisible ? "none" : ""};
    const showWhenVisible = {display: loginVisible ? "" : "none"};

    return (
      <div>
        <div style={hideWhenVisible}>
          <button onClick={() => setLoginVisible(true)}>login</button>
        </div>
        <div style={showWhenVisible}>
          <LoginForm createLogin={handleLogin} />
          <button onClick={() => setLoginVisible(false)}>cancel</button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <h1>Notes</h1>
      <Notification
        successMessage={successMessage}
        errorMessage={errorMessage}
      />
      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p>Hello {user.name}</p>
          <Togglable buttonLabel="new note" ref={noteFormRef}>
            <NoteForm createNote={addNote} user={user} />
          </Togglable>
          <div>
            <button onClick={() => setShowAll(!showAll)}>
              show {showAll ? "important" : "all"}
            </button>
          </div>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}

      <ul>
        {notesToShow.map(note => (
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
            onDelete={() => handleDelete(note.id)}
          />
        ))}
      </ul>

      <Footer />
    </div>
  );
};

export default App;
