import { useState } from "react";
import { addUser } from "../services/loanService";

const AddUserModal = ({ onClose }) => {
  const [name, setName] = useState("");
  const [dni, setDni] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addUser(name, dni, age, gender);
    setName("");
    setDni("");
    setAge("");
    setGender("");
    onClose();
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del usuario"
          required
        />
        <input
          type="text"
          value={dni}
          onChange={(e) => setDni(e.target.value)}
          placeholder="Código del usuario"
          required
        />
        <select value={age} onChange={(e) => setAge(e.target.value)} required>
          <option value="" disabled>
            Selecciona una franja de edad
          </option>
          <option value="13-17">13 a 17</option>
          <option value="18-25">18 a 25</option>
          <option value="26-35">26 a 35</option>
          <option value="36-45">36 a 45</option>
          <option value="46-55">46 a 55</option>
          <option value="56-65">56 a 65</option>
          <option value="66-75">66 a 75</option>
          <option value="76-85">76 a 85</option>
          <option value="86-95">86 a 95</option>
          <option value="96-105">96 a 105</option>
        </select>
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          required
        >
          <option value="" disabled>
            Selecciona un género
          </option>
          <option value="muy macho!!">Muy macho!!</option>
          <option value="masculino">Masculino</option>
          <option value="femenino">Femenino</option>
          <option value="otro">Otro</option>
          <option value="prefiero_no_decirlo">Prefiero no decirlo</option>
        </select>
        <button type="submit">Agregar Usuario</button>
        <button type="button" onClick={onClose}>
          Cerrar
        </button>
      </form>
    </div>
  );
};

export default AddUserModal;
