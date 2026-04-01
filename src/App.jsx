import { useState } from 'react'
import './App.css'
import FormScreen from './components/FormScreen.jsx'
import ResultsScreen from './components/ResultsScreen.jsx'

export default function App() {
  const [screen, setScreen] = useState('form')
  const [resultData, setResultData] = useState(null)

  return (
    <div className="shell">
      {screen === 'form' ? (
        <FormScreen
          onSubmit={(data) => {
            setResultData(data)
            setScreen('results')
          }}
        />
      ) : (
        <ResultsScreen data={resultData} onBack={() => setScreen('form')} />
      )}
    </div>
  )
}
