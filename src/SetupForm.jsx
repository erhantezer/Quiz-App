import { useGlobalContext } from "./context"


const SetupForm = () => {
    const {error} = useGlobalContext()
    return (
        <main>
            <section className="quiz quiz-small">
                <form className="setup-form">
                    <h2>setup quiz</h2>
                    {/* amount */}
                    <div className="form-control">
                        <label htmlFor="amount">number of questions</label>
                        <input 
                        type="number"
                        name="amount"
                        id="amount"
                        value={null}
                        className="form-input"
                        min={1}
                        max={50}
                        onChange={null}
                        />
                    </div>
                    {/* category */}
                    <div className="form-control">
                        <label htmlFor="category">category</label>
                        <select 
                        name="category" 
                        id="category"
                        className="form-input"
                        value={null}
                        onChange={null}
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
                            value={null}
                            onChange={null}
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