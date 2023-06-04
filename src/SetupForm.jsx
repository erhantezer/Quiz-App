import { useGlobalContext } from "./context"


const SetupForm = () => {
    const {error, handleSubmit, handleChange, quiz} = useGlobalContext();
    
    return (
        <main>
            <section className="quiz quiz-small">
                <form className="setup-form" onSubmit={handleSubmit}>
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
                        <button onClick={null} type="submit" className="submit-btn">
                            start
                        </button>
                </form>
            </section>
        </main>
    )
}

export default SetupForm