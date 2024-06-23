import { useMemo, useState } from "react";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  DndContext,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { restrictToHorizontalAxis } from "@dnd-kit/modifiers";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { mkConfig, generateCsv, download } from "export-to-csv"; //or use your library of choice here

import {
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import { DragIndicator as DragIndicatorIcon } from "@mui/icons-material";

const DraggableTableHeader = ({ header }) => {
  const { attributes, isDragging, listeners, setNodeRef, transform } =
    useSortable({
      id: header.column.id,
    });
  const style = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: (transform || "").toString(), // translate instead of transform to avoid squishing
    transition: "width transform 0.2s ease-in-out",
    whiteSpace: "nowrap",
    width: header.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <TableCell colSpan={header.colSpan} ref={setNodeRef} style={style}>
      {header.isPlaceholder
        ? null
        : flexRender(header.column.columnDef.header, header.getContext())}
      <IconButton
        aria-label="delete"
        {...attributes}
        {...listeners}
        sx={{ cursor: "move" }}>
        <DragIndicatorIcon />
      </IconButton>
    </TableCell>
  );
};
const makeData = () => {
  return [
    {
      firstName: "Jayda",
      lastName: "Zieme",
      age: 24,
      visits: 560,
      progress: 46,
      status: "relationship",
    },
    {
      firstName: "Elbert",
      lastName: "Jaskolski",
      age: 24,
      visits: 988,
      progress: 56,
      status: "relationship",
    },
    {
      firstName: "Sibyl",
      lastName: "Hilpert",
      age: 34,
      visits: 743,
      progress: 48,
      status: "single",
    },
    {
      firstName: "Lyla",
      lastName: "Gutmann",
      age: 13,
      visits: 104,
      progress: 32,
      status: "complicated",
    },
    {
      firstName: "Axel",
      lastName: "Senger",
      age: 28,
      visits: 23,
      progress: 53,
      status: "single",
    },
    {
      firstName: "Koby",
      lastName: "Satterfield",
      age: 3,
      visits: 890,
      progress: 66,
      status: "single",
    },
    {
      firstName: "Karlee",
      lastName: "Monahan",
      age: 11,
      visits: 777,
      progress: 32,
      status: "relationship",
    },
    {
      firstName: "Gennaro",
      lastName: "Dare",
      age: 39,
      visits: 737,
      progress: 44,
      status: "single",
    },
    {
      firstName: "Kaylie",
      lastName: "Schuppe",
      age: 37,
      visits: 120,
      progress: 78,
      status: "relationship",
    },
    {
      firstName: "Jordane",
      lastName: "Lockman-Bode",
      age: 27,
      visits: 560,
      progress: 2,
      status: "relationship",
    },
    {
      firstName: "Sherman",
      lastName: "Torphy",
      age: 11,
      visits: 766,
      progress: 7,
      status: "single",
    },
    {
      firstName: "Alden",
      lastName: "Mueller-Howe",
      age: 24,
      visits: 711,
      progress: 91,
      status: "complicated",
    },
    {
      firstName: "Milan",
      lastName: "Jacobi",
      age: 6,
      visits: 734,
      progress: 7,
      status: "single",
    },
    {
      firstName: "Juanita",
      lastName: "Barton",
      age: 22,
      visits: 798,
      progress: 68,
      status: "complicated",
    },
    {
      firstName: "Ubaldo",
      lastName: "Jaskolski",
      age: 4,
      visits: 45,
      progress: 70,
      status: "single",
    },
    {
      firstName: "Terence",
      lastName: "Wolff",
      age: 22,
      visits: 246,
      progress: 40,
      status: "single",
    },
    {
      firstName: "Guillermo",
      lastName: "Roob",
      age: 7,
      visits: 613,
      progress: 88,
      status: "single",
    },
    {
      firstName: "Frances",
      lastName: "Herman",
      age: 34,
      visits: 301,
      progress: 85,
      status: "complicated",
    },
    {
      firstName: "Brendan",
      lastName: "Hudson",
      age: 40,
      visits: 85,
      progress: 89,
      status: "single",
    },
    {
      firstName: "Myra",
      lastName: "Gislason",
      age: 21,
      visits: 677,
      progress: 72,
      status: "relationship",
    },
  ];
};

const DragAlongCell = (props) => {
  // eslint-disable-next-line react/prop-types
  const { cell } = props;
  const { isDragging, setNodeRef, transform } = useSortable({
    // eslint-disable-next-line react/prop-types
    id: cell.column.id,
  });

  const style = {
    opacity: isDragging ? 0.8 : 1,
    position: "relative",
    transform: (transform || "").toString(), // translate instead of transform to avoid squishing
    transition: "width transform 0.2s ease-in-out",
    // eslint-disable-next-line react/prop-types
    width: cell.column.getSize(),
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <TableCell style={style} ref={setNodeRef}>
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </TableCell>
  );
};

const csvConfig = mkConfig({
  fieldSeparator: ",",
  decimalSeparator: ".",
  useKeysAsHeaders: true,
});

const TableDndApp = () => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "firstName",
        cell: (info) => info.getValue(),
        id: "firstName",
        size: 150,
      },
      {
        accessorFn: (row) => row.lastName,
        cell: (info) => info.getValue(),
        header: () => <span>Last Name</span>,
        id: "lastName",
        size: 150,
      },
      {
        accessorKey: "age",
        header: () => "Age",
        id: "age",
        size: 120,
      },
      {
        accessorKey: "visits",
        header: () => <span>Visits</span>,
        id: "visits",
        size: 120,
      },
      {
        accessorKey: "status",
        header: "Status",
        id: "status",
        size: 150,
      },
      {
        accessorKey: "progress",
        header: "Profile Progress",
        id: "progress",
        size: 180,
      },
    ],
    [],
  );

  const [data, setData] = useState(() => makeData());
  const [columnOrder, setColumnOrder] = useState(() =>
    columns.map((column) => column.id),
  );

  const tableElement = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnOrder,
    },
    onColumnOrderChange: setColumnOrder,
  });

  // reorder columns after drag & drop
  function handleDragEnd(event) {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      setColumnOrder((columnOrder) => {
        const oldIndex = columnOrder.indexOf(active.id);
        const newIndex = columnOrder.indexOf(over.id);
        return arrayMove(columnOrder, oldIndex, newIndex); //this is just a splice util
      });
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {}),
    useSensor(TouchSensor, {}),
    useSensor(KeyboardSensor, {}),
  );

  const handleExportRows = (rows) => {
    const rowData = rows.map((row) => row.original);
    const csv = generateCsv(csvConfig)(rowData);
    download(csvConfig)(csv);
  };

  console.log({ row: tableElement });
  return (
    <TableContainer as={Paper} sx={{ width: "100%" }}>
      <Typography>Drag N Drop Column</Typography>
      <Button onClick={() => tableElement.reset()}>Reset Data</Button>
      <Button onClick={() => handleExportRows(tableElement.getRowModel().rows)}>
        Print Rows
      </Button>
      <DndContext
        collisionDetection={closestCenter}
        modifiers={[restrictToHorizontalAxis]}
        onDragEnd={handleDragEnd}
        sensors={sensors}>
        <Table>
          <TableHead>
            {tableElement.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                <SortableContext
                  items={columnOrder}
                  strategy={horizontalListSortingStrategy}>
                  {headerGroup.headers.map((header) => (
                    <DraggableTableHeader key={header.id} header={header} />
                  ))}
                </SortableContext>
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {tableElement.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <SortableContext
                    key={cell.id}
                    items={columnOrder}
                    strategy={horizontalListSortingStrategy}>
                    <DragAlongCell key={cell.id} cell={cell} />
                  </SortableContext>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <table>
          <thead>
            {tableElement.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                <SortableContext
                  items={columnOrder}
                  strategy={horizontalListSortingStrategy}>
                  {headerGroup.headers.map((header) => (
                    <DraggableTableHeader key={header.id} header={header} />
                  ))}
                </SortableContext>
              </tr>
            ))}
          </thead>
          <tbody>
            {tableElement.getRowModel().rows.map((row) => (
              <tr key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <SortableContext
                    key={cell.id}
                    items={columnOrder}
                    strategy={horizontalListSortingStrategy}>
                    <DragAlongCell key={cell.id} cell={cell} />
                  </SortableContext>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </DndContext>
    </TableContainer>
  );
};

export default TableDndApp;
