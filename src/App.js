import './App.css';
import LineChart from './LineChart';

function App() {
  return (
    <div className="App">
      <div className="content">
      <LineChart table={'temperature'} />
      <LineChart table={'gas'} />
      <LineChart table={'pressure'} />
      <LineChart table={'humidity'} />
      </div>
    </div>
  );
}

export default App;
