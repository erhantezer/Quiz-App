import Loading from "./Loading"
import Modal from "./Modal"
import SetupForm from "./SetupForm"
import { useGlobalContext } from "./context"


function App() {
  const { 
    waiting,
    loading,
    questions,
    index,
    correct,
    nextQuestion,
    checkAnswer,
    
  } = useGlobalContext();

  if (loading) {
    return <Loading />
  }
  
  if (waiting) {
    return <SetupForm />
  }

  const { question, incorrect_answers, correct_answer } = questions[index]

  return (
    <main>
      <Modal />
      <section className="quiz">
        <p className="correct-answers">correct answers</p>
        <article className="container">
          <h2 />
          <div className="btn-container">

          </div>
        </article>
        <button className="next-question">
          next question
        </button>
      </section>
    </main>
  )
}

export default App
