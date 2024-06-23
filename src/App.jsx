import { Container } from "@mui/material";

import ErrorBoundary from "./components/ErrorBoundary";
import MyTable from "./components/TableDnD";

export default function App() {
  return (
    <ErrorBoundary>
      <Container maxWidth="md">
        <MyTable />
      </Container>
    </ErrorBoundary>
  );
}
