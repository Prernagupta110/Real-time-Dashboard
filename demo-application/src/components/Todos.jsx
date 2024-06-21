import { useState } from "react";
import { Table } from "./Table";
import { Modal } from "./Modal";
import { useQuery, useQueryClient } from "../cross-window-query-library";

export const Todos = ({ showAdd }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { isLoading, isError, error, data } = useQuery({ queryKey: ['todos'], queryScript: 'getTodos' })
  const [rowToEdit, setRowToEdit] = useState(null);

  const queryClient = useQueryClient()
  const handleDeleteRow = async (targetIndex) => {
    await fetch(`/api/todos/${targetIndex}`, { method: "DELETE" })
    queryClient.invalidateQuery(['todos'])
  };

  const handleEditRow = (idx) => {
    setRowToEdit(idx);

    setModalOpen(true);
  };

  const handleSubmit = async (newRow) => {
    const requestBody = JSON.stringify({ description: newRow.description, status: newRow.status })
    if (rowToEdit === null) {
      await fetch('api/todos', { method: "POST", headers: { "Content-Type": "application/json" }, body: requestBody })
    } else {
      await fetch(`api/todos/${rowToEdit}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: requestBody })
    }
    queryClient.invalidateQuery(['todos'])
  };

  if (isLoading) return (<p>Loading</p>)
  if (isError) return <p>{error}</p>

  return (
    <div className="Todos">
      <div className="container">
        <h1>Todos</h1>
      </div>

      <Table data={data} editRow={handleEditRow} deleteRow={handleDeleteRow} />
      {showAdd && <button onClick={() => setModalOpen(true)} className="btn">
        Add
      </button>}
      {modalOpen && (
        <Modal
          closeModal={() => {
            setModalOpen(false);
            setRowToEdit(null);
          }}
          onSubmit={handleSubmit}
          defaultValue={rowToEdit !== null && data.find((todo) => todo.id === rowToEdit)}
        />
      )}
    </div>
  );
}