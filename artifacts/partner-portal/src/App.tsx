import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { StoreProvider } from "@/context/StoreContext";
import Dashboard from "@/pages/Dashboard";
import Leads from "@/pages/Leads";
import Trends from "@/pages/Trends";
import CustomerProfiles from "@/pages/CustomerProfiles";
import Appointments from "@/pages/Appointments";

const queryClient = new QueryClient();

function Router() {
  return (
    <Layout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/leads" component={Leads} />
        <Route path="/appointments" component={Appointments} />
        <Route path="/customers" component={CustomerProfiles} />
        <Route path="/trends" component={Trends} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
      </StoreProvider>
    </QueryClientProvider>
  );
}

export default App;
