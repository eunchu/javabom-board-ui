import React from "react";
import { Column, Table as TableComp, Cell } from "@blueprintjs/table";
import "./index.css";

const Table = () => {
  return (
    <TableComp numRows={3}>
      <Column
        name="1"
        cellRenderer={rowIndex => {
          console.log(rowIndex);
          return <Cell>{rowIndex}</Cell>;
        }}
      />
    </TableComp>
  );
};

export default Table;
