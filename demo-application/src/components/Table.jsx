import React from "react";
import { BsFillTrashFill, BsFillPencilFill } from "react-icons/bs";

import "./Table.css";

export const Table = ({ data, deleteRow, editRow }) => {

  return (
    <div className="table-wrapper">
      <table className="table">
        <thead>
          <tr>
            <th>Serial No.</th>
            <th className="expand">Your Todo List</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((todo, idx) => {
            const statusText = todo.status.charAt(0).toUpperCase() + todo.status.slice(1);

            return (
              <tr key={idx}>
                <td>{todo.id}</td>
                <td className="expand">{todo.description}</td>
                <td>
                  <span className={`label label-${todo.status}`}>
                    {statusText}
                  </span>
                </td>
                <td className="fit">
                  <span className="actions">
                    <BsFillTrashFill
                      className="delete-btn"
                      onClick={() => deleteRow(todo.id)}
                    />
                    <BsFillPencilFill
                      className="edit-btn"
                      onClick={() => editRow(todo.id)}
                    />
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};