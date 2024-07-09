const Note = ({note, toggleImportance, onDelete}) => {
  const label = note.important ? "make not important" : "make important";

  return (
    <li className="note">
      {note.content}
      <button onClick={toggleImportance}>{label}</button>
      <button onClick={onDelete}>Delete</button>
    </li>
  );
};

export default Note;
