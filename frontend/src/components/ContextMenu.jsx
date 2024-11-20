import PropTypes from "prop-types";

const ContextMenu = ({ visible, position, handleEdit, handleDelete, item }) => {
  if (!visible) return null;

  return (
    <div
      className="flex flex-col w-36 rounded-md shadow-lg bg-white border border-gray-300"
      style={{
        position: "absolute",
        top: position.y,
        left: position.x,
        zIndex: 999,
      }}
    >
      <button className="border-b border-gray-200 text-left px-4 py-2 hover:bg-green-100 transition duration-200">
        Create
      </button>
      <button
        className="border-b border-gray-200 text-left px-4 py-2 hover:bg-blue-100 transition duration-200"
        onClick={() => handleEdit(item)}
      >
        Edit
      </button>
      <button
        className="text-left px-4 py-2 hover:bg-red-100 transition duration-200"
        onClick={() => handleDelete(item)}
      >
        Delete
      </button>
    </div>
  );
};

// Prop validation
ContextMenu.propTypes = {
  visible: PropTypes.bool,
  position: PropTypes.shape({
    x: PropTypes.number,
    y: PropTypes.number,
  }),
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
  item: PropTypes.shape({
    id: PropTypes.number,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string,
    phone: PropTypes.string,
    dob: PropTypes.string,
    address: PropTypes.string,
    gender: PropTypes.string,
    role_type: PropTypes.string,
  }),
};

export default ContextMenu;
