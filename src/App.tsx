import './App.css';

function LoadingPage() {
  return (
    <div>
      Loading...
    </div>
  )
}

interface IProps {
  response: string
}

const App: React.FC<IProps> = (props: IProps) => {
  return (
    <div>
      <header>
        {props.response}
      </header>
    </div>
  );
}

export default App;
