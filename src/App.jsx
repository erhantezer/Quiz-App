import Loading from "./Loading"
import { useGlobalContext } from "./context"


function App() {
  const { loading } = useGlobalContext()

  if (loading) {
    return <Loading />
  }

  return (
    <>

    </>
  )
}

export default App
