import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Shell } from "./components/layout/Shell";
import NotFound from "@/pages/not-found";

import Home from "./pages/Home";
import PlanetDetail from "./pages/PlanetDetail";
import Character from "./pages/Character";
import Collection from "./pages/Collection";
import Achievements from "./pages/Achievements";
import Clans from "./pages/Clans";
import MiniGames from "./pages/MiniGames";
import Structures from "./pages/Structures";
import Shop from "./pages/Shop";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000,
      retry: false
    },
  },
});

function Router() {
  return (
    <Shell>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/planet/:id" component={PlanetDetail} />
        <Route path="/structures" component={Structures} />
        <Route path="/character" component={Character} />
        <Route path="/collection" component={Collection} />
        <Route path="/achievements" component={Achievements} />
        <Route path="/clans" component={Clans} />
        <Route path="/minigames" component={MiniGames} />
        <Route path="/shop" component={Shop} />
        <Route component={NotFound} />
      </Switch>
    </Shell>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
