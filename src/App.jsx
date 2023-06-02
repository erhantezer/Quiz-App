import Loading from "./Loading"
import SetupForm from "./SetupForm"
import { useGlobalContext } from "./context"


function App() {
  const { loading } = useGlobalContext()

  if (loading) {
    return <Loading />
  }
  if ("waiting") {
    return <SetupForm/>
  }

  return (
    <>

    </>
  )
}

export default App
