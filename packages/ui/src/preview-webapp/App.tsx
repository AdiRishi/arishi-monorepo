import { Button } from '@arishi/ui/components/button';
import { useState } from 'react';
import './index.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="flex flex-col items-center justify-center p-10">
      <div>
        <Button>Click me!</Button>
      </div>
    </div>
  );
}

export default App;
