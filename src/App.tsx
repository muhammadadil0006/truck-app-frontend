import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { store } from "./app/store";
import { PlanTripPage } from "./features/trips/pages/PlanTripPage";
import { TripHistoryPage } from "./features/trips/pages/TripHistoryPage";
import { TripDetailPage } from "./features/trips/pages/TripDetailPage";

export function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PlanTripPage />} />
          <Route path="/history" element={<TripHistoryPage />} />
          <Route path="/trips/:id" element={<TripDetailPage />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
