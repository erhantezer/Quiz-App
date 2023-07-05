# QUIZ-APP project

## context.jsx
```js
import axios from "axios";
import { useContext, useState } from "react";
import { createContext } from "react";

const AppContext = createContext();
export const useGlobalContext = () => {
    return useContext(AppContext)
}

const API_ENDPOINT = 'https://opentdb.com/api.php?';
const url = ''
const tempUrl = 'https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple';

export const AppProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState([]);
    const [error, setError] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [waiting, setWaiting] = useState(true);
    const [correct, setCorrect] = useState(0);
    const [index, setIndex] = useState(0);
    const [quiz, setQuiz] = useState({
        amount: 10,
        category: "sports",
        difficulty: "easy",
    });


    const fetchQuestions = async (url) => {
        setLoading(true)
        try {
            const response = await axios(url)
            if (response) {
                const data = response.data.results
                if (data.length > 0) {
                    setQuestions(data)
                    setLoading(false)
                    setError(false)
                    setWaiting(false)
                } else {
                    setError(true)
                    setWaiting(true)
                }
            } else {
                setWaiting(true)
            }


            
        } catch (error) {
            setError(true)
        }
    }


    const nextQuestion = () => {
        setIndex((oldIndex) => {
            const index = oldIndex + 1
            if (index > questions.length - 1) {
                openModal()
                return 0
            } else {
                return index
            }
        })
    }

    const checkAnswer = (value) => {
        if (value) {
            setCorrect((oldState) => oldState + 1)
        }
        nextQuestion()
    }

    const openModal = () => {
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setWaiting(true)
        setCorrect(0)
        setIsModalOpen(false)
    }

    const handleChange = (e) => {
        setQuiz({ ...quiz, [e.target.name]:e.target.value})
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const {amount, category, difficulty} = quiz
        const url = `${API_ENDPOINT}amount${amount}&difficulty${difficulty}&category${category}`
        fetchQuestions(url)
    }


    return (
        <AppContext.Provider value={{
            loading,
            error,
            questions,
            isModalOpen,
            quiz,
            waiting,
            handleChange,
            handleSubmit,
            openModal,
            closeModal,
            correct,
            setCorrect,
            index,
            setIndex,
            checkAnswer
        }}>
            {children}
        </AppContext.Provider>
    )
}

```

## App.jsx
```js
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

  // const answers = [...incorrect_answers, correct_answer]
  const { question, incorrect_answers, correct_answer } = questions[index];
  let answers = [...incorrect_answers]
  const tempIndex = Math.floor(Math.random() * 4)

  if (tempIndex === 3) {
    answers.push(correct_answer)
  } else {
    answers.push(answers[tempIndex])
    answers[tempIndex] = correct_answer
  }

  return (
    <main>
      <Modal />
      <section className="quiz">
        <p className="correct-answers">
          correct answers: {correct}/{index}
        </p>
        <article className="container">
          <h2 dangerouslySetInnerHTML={{ __html: question }} />
          <div className="btn-container">
            {answers.map((answer, index) => {
              return (
                <button
                  key={index}
                  className='answer-btn'
                  onClick={() => checkAnswer(correct_answer === answer)}
                  dangerouslySetInnerHTML={{ __html: answer }}
                />
              )
            })}
          </div>
        </article>
        <button className="next-question" onClick={nextQuestion}>
          next question
        </button>
      </section>
    </main>
  )
}

export default App

```

## Modal.jsx
```js
import { useGlobalContext } from "./context"

const Modal = () => {
    const { isModalOpen, closeModal, correct, questions } = useGlobalContext()
    
    return (
        <div className={`${isModalOpen ? 'modal-container isOpen' : 'modal-container'}`}>
            <div className='modal-content'>
                <h2>congrats!</h2>
                <p>
                    You answered {((correct / questions.length) * 100).toFixed(0)} % of
                    questions correctly
                </p>
                <button className='close-btn' onClick={closeModal}>
                    play again
                </button>
            </div>
        </div>
    )
}

export default Modal
```

## setupform.jsx
```js
import { useGlobalContext } from "./context"


const SetupForm = () => {
    const { error, handleSubmit, handleChange, quiz } = useGlobalContext();

    return (
        <main>
            <section className="quiz quiz-small">
                <form className="setup-form" >
                    <h2>setup quiz</h2>
                    {/* amount */}
                    <div className="form-control">
                        <label htmlFor="amount">number of questions</label>
                        <input
                            type="number"
                            name="amount"
                            id="amount"
                            value={quiz.amount}
                            className="form-input"
                            min={1}
                            max={50}
                            onChange={handleChange}
                        />
                    </div>
                    {/* category */}
                    <div className="form-control">
                        <label htmlFor="category">category</label>
                        <select
                            name="category"
                            id="category"
                            className="form-input"
                            value={quiz.category}
                            onChange={handleChange}
                        >
                            <option value="sports">sports</option>
                            <option value="history">history</option>
                            <option value="politics">politics</option>
                        </select>
                    </div>
                    {/* difficult */}
                    <div className="form-control">
                        <label htmlFor="difficult">category</label>
                        <select
                            name="difficult"
                            id="difficult"
                            className="form-input"
                            value={quiz.difficult}
                            onChange={handleChange}
                        >
                            <option value="easy">easy</option>
                            <option value="medium">medium</option>
                            <option value="hard">hard</option>
                        </select>
                    </div>
                    {error && (
                        <p className="error">
                            can't generate questions, please try diffirent options
                        </p>
                    )}
                    <button onClick={handleSubmit} type="submit" className="submit-btn">
                        start
                    </button>
                </form>
            </section>
        </main>
    )
}

export default SetupForm
```

## index.css
```css

/*! variables */

:root {
    /* dark shades of primary color*/
    --clr-primary-1: hsl(205, 86%, 17%);
    --clr-primary-2: hsl(205, 77%, 27%);
    --clr-primary-3: hsl(205, 72%, 37%);
    --clr-primary-4: hsl(205, 63%, 48%);
    /* primary/main color */
    --clr-primary-5: hsl(205, 78%, 60%);
    /* lighter shades of primary color */
    --clr-primary-6: hsl(205, 89%, 70%);
    --clr-primary-7: hsl(205, 90%, 76%);
    --clr-primary-8: hsl(205, 86%, 81%);
    --clr-primary-9: hsl(205, 90%, 88%);
    --clr-primary-10: hsl(205, 100%, 96%);
    /* darkest grey - used for headings */
    --clr-grey-1: hsl(209, 61%, 16%);
    --clr-grey-2: hsl(211, 39%, 23%);
    --clr-grey-3: hsl(209, 34%, 30%);
    --clr-grey-4: hsl(209, 28%, 39%);
    /* grey used for paragraphs */
    --clr-grey-5: hsl(210, 22%, 49%);
    --clr-grey-6: hsl(209, 23%, 60%);
    --clr-grey-7: hsl(211, 27%, 70%);
    --clr-grey-8: hsl(210, 31%, 80%);
    --clr-grey-9: hsl(212, 33%, 89%);
    --clr-grey-10: hsl(210, 36%, 96%);
    --clr-white: #fff;
    --clr-red-dark: hsl(360, 67%, 44%);
    --clr-red-light: hsl(360, 71%, 66%);
    --clr-green-dark: hsl(125, 67%, 44%);
    --clr-green-light: hsl(125, 71%, 66%);
    --clr-black: #222;
    --transition: all 0.3s linear;
    --spacing: 0.1rem;
    --radius: 0.25rem;
    --light-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
    --dark-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    --max-width: 1170px;
    --fixed-width: 620px;
}

/*!=============== Global Styles===============*/

*,
::after,
::before {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
        Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    background: var(--clr-grey-10);
    color: var(--clr-grey-1);
    line-height: 1.5;
    font-size: 0.875rem;
}

ul {
    list-style-type: none;
}

a {
    text-decoration: none;
}

h1,
h2,
h3,
h4 {
    letter-spacing: var(--spacing);
    text-transform: capitalize;
    line-height: 1.25;
    margin-bottom: 0.75rem;
}

h1 {
    font-size: 2.5rem;
}

h2 {
    font-size: 2rem;
}

h3 {
    font-size: 1.25rem;
}

h4 {
    font-size: 0.875rem;
}

p {
    margin-bottom: 1.25rem;
    color: var(--clr-grey-3);
}

@media screen and (min-width: 800px) {
    h1 {
        font-size: 3rem;
    }

    h2 {
        font-size: 2.5rem;
    }

    h3 {
        font-size: 1.75rem;
    }

    h4 {
        font-size: 1rem;
    }

    body {
        font-size: 1rem;
    }

    h1,
    h2,
    h3,
    h4 {
        line-height: 1;
    }
}



/*! section */
.section {
    width: 90vw;
    margin: 0 auto;
    max-width: var(--max-width);
}

@media screen and (min-width: 992px) {
    .section {
        width: 95vw;
    }
}

/*! loading */
@keyframes spinner {
    from {
        transform: rotate(0deg);
    }
    to {
        transform: rotate(360deg);
    }
}

.loading {
    margin: 0 auto;
    /* background-color: blue; */
    width: 6rem;
    height: 6rem;
    border-radius: 50%;
    border: 3px solid #ccc;
    margin-top: 15rem;
    border-top-color: var(--clr-primary-5);
    animation: spinner 1s linear infinite;
}

main {
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.quiz {
    width: 90vw;
    max-width: var(--max-width);
    margin: 4rem auto;
    background: var(--clr-white);
    border-radius: var(--radius);
    padding: 3rem;
}

.quiz-small {
    max-width: 500px;
}

.container h2 {
    margin-bottom: 2rem;
    text-align: center;
    line-height: 1.5;
    text-transform: none;
}

.answer-btn {
    display: block;
    width: 100%;
    margin: 0.75rem auto;
    background: var(--clr-primary-7);
    border-radius: var(--radius);
    border-color: transparent;
    color: var(--clr-black);
    letter-spacing: var(--spacing);
    font-size: 1rem;
    cursor: pointer;
    padding: 0.5rem 0;
    transition: var(--transition);
}

@media screen and (min-width: 576px) {
    .answer-btn {
        max-width: 60%;
    }
}

.answer-btn:hover {
    background: var(--clr-primary-5);
    color: var(--clr-white);
}

.correct-answers {
    font-size: 1rem;
    margin-bottom: 2rem;
    text-align: right;
    text-transform: capitalize;
    letter-spacing: var(--spacing);
    color: var(--clr-green-dark);
}

.next-question,
.close-btn,
.submit-btn {
    border-radius: var(--radius);
    border-color: transparent;
    padding: 0.25rem 0.5rem;
    display: block;
    width: 35%;
    margin-left: auto;
    margin-top: 2rem;
    text-transform: capitalize;
    font-weight: 700;
    letter-spacing: var(--spacing);
    font-size: 1rem;
    background: #ffb100;
    color: var(--clr-black);
    transition: var(--transition);
    cursor: pointer;
}

.next-question:hover {
    background: #805900;
    color: #ffb100;
}

/*!=============== Form ===============*/

.setup-form h2 {
    margin-bottom: 2rem;
}

.form-control {
    margin-bottom: 2rem;
}

.form-control label {
    display: block;
    text-transform: capitalize;
    font-weight: 500;
    color: var(--clr-grey-3);
    margin-bottom: 0.5rem;
}

.form-input {
    border: none;
    background: var(--clr-grey-10);
    font-size: 1rem;
    padding: 0.25rem 0.5rem;
    width: 100%;
    border-radius: var(--radius);
}

.error {
    color: var(--clr-red-dark);
    text-transform: capitalize;
}

.submit-btn {
    width: 100%;
    margin-top: 3rem;
}

.modal-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: var(--transition);
    z-index: -1;
}

.isOpen {
    opacity: 1;
    z-index: 999;
}

.modal-content {
    background: var(--clr-white);
    width: 90vw;
    max-width: var(--fixed-width);
    padding: 3rem;
    border-radius: var(--radius);
    text-align: center;
    position: relative;
}

.modal-content p {
    font-size: 1.5rem;
    text-transform: none;
}

.close-btn {
    margin-right: auto;
}

```
