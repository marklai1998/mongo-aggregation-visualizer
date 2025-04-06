import './App.css';
import { Provider } from '@/components/ui/provider';
import { Button, HStack } from '@chakra-ui/react';

function App() {
  return (
    <Provider>
      <HStack>
        <Button>Click me</Button>
        <Button>Click me</Button>
      </HStack>
    </Provider>
  );
}

export default App;
