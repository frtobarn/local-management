import { useState } from "react";
import { addItem, getItems } from "../services/loanService";
import { useData } from "../context/DataContext";

const AddItemModal = ({ onClose }) => {
  const { updateItems } = useData();
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");

  const clasificaciones = [
    "Juegos de azar y apuestas literarias",
    "Juegos de cartas y de mesa clásicos",
    "Juegos de cultura general",
    "Juegos inclusivos",
    "Juegos de estrategia y construcción",
    "Juegos de habilidad y destreza física",
    "Juegos de lógica y habilidad mental",
    "Juegos de misterio e investigación",
    "Juegos narrativos y de rol",
    "Mesa de Billar Poll",
    "Mesa de Hockey de aire",
    "Zona Gamer",
    "Zona Audiovisuales",
  ];

  const statusOptions = [
    "disponible",
    "prestado",
    "en reparación",
    "en mantenimiento",
    "en revisión",
    "en espera",
    "en inventario",
    "en exhibición",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addItem(name, code, status, type);
    const updatedItems = await getItems();
    updateItems(updatedItems);
    setName("");
    setCode("");
    setStatus("");
    setType("");
    onClose();
  };

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nombre del elemento"
          required
        />
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Placa del elemento"
          required
        />
        <select value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="">Seleccionar grupo</option>
          {clasificaciones.map((clasificacion) => (
            <option key={clasificacion} value={clasificacion}>
              {clasificacion}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          required
        >
          <option value="">Seleccionar estado</option>
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>

        <button type="submit">Agregar Elemento</button>
        {/* <button type="button" onClick={onClose}>Cerrar</button> */}
      </form>
    </div>
  );
};

export default AddItemModal;
