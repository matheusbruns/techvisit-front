import AppRoutes from './router/Router';
import { BrowserRouter } from 'react-router-dom';
import "./util/styles/global.scss";

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
