import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router";
import { Layout } from "./components/Layout";
import { NotFound } from "./components/NotFound";
import * as users from "./features/users";

const queryClient = new QueryClient();

export const App = () => {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Layout>
          <Routes>
            <Route path="/" element={<users.UsersList />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
