import React from "react";

export default function Question(props){
    function handleClick(event){
        event.target.style.outline = "1px solid black"
    }
    const shuffledAnswerArr = props.shuffledAnswerArr
    const [highLighted,setHighlight] = React.useState(false)
    const answerInput = shuffledAnswerArr.map(answer =>{
        return(
            <>
            <input
            type="radio"
            id={answer}
            value={answer}
            name={props.Question}
            onChange={props.handleChange}
            key={props.Question}
            />
            <label onClick={handleClick} className={props.checkAnswer ? (props.correctAnswer == answer ? "correctAnswer" : "incorrectAnswer"):"mainLabelClass"} key={answer} htmlFor={answer}>
                {answer}
            </label>
            </>
        )
    })
    return(
        <fieldset>
            <legend>{props.Question}</legend>
            <div className="answers-container">
                {answerInput}
            </div>
        </fieldset>
    )
}