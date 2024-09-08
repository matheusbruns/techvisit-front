import AppRoutes from './router/Router';
import { BrowserRouter } from 'react-router-dom';
import "./util/styles/global.scss";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

function App() {
	return (
		<BrowserRouter>
			<AppRoutes />
			<ToastContainer
				position='top-right'
				style={{ marginTop: 50 }}
				autoClose={3000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
			/>
		</BrowserRouter>
	);
}

export default App;
