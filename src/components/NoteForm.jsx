import React, {useState} from "react";

const NoteForm = ({createNote, user}) => {
  const [newNote, setNewNote] = useState("");

  const handleNoteChange = event => {
    setNewNote(event.target.value);
  };

  const addNote = async event => {
    try {
      event.preventDefault();
      createNote({
        content: newNote,
        important: true,
        userId: user.id,
      });

      setNewNote("");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h2>Create a new note</h2>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange}
          placeholder="write note content here"
        />
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default NoteForm;
