import './App.css';
import "bootstrap/dist/css/bootstrap.css";
import Navbar from "./components/navbar/Navbar";
import Todo from "./components/todo/Todo";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Todo />
    </div>
  );
}

export default App;
