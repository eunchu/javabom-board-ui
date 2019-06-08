import React from "react";
import PropTypes from "prop-types";

import { Column, Table as TableComp, Cell } from "@blueprintjs/table";
// import { Icon } from "@blueprintjs/core";

/* ======= Constants ======= */

const ROW_NUM = 10;

/* ======= Components ======= */

/* === main === */

const Table = ({ articles, onClickDelete }) => {
  return (
    <TableComp numRows={ROW_NUM}>
      <Column
        name="Name"
        cellRenderer={rowIndex => <Cell>user {rowIndex + 1}</Cell>}
      />
      <Column
        name="Title"
        cellRenderer={rowIndex => {
          return (
            <Cell>
              article {rowIndex + 1}
              {/* <Icon
                icon="comment"
                style={{ marginLeft: "0.4rem", color: "#BFCCD6" }}
              /> */}
            </Cell>
          );
        }}
      />
      <Column name="Date" cellRenderer={rowIndex => <Cell>...</Cell>} />
      <Column
        name=""
        cellRenderer={() => <Cell style={{ color: "#FF6E4A" }}>Delete</Cell>}
      />
    </TableComp>
  );
};

Table.defaultProps = {
  articles: [],
  onClickDelete: () => {}
};

Table.propTypes = {
  articles: PropTypes.array,
  onClickDelete: PropTypes.func
};

export default Table;
