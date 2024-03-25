import React from 'react'
import {decode} from 'html-entities'
import arrayShuffle from 'array-shuffle';
import Question from './components/Question';
import './App.css'

function App() {
  const [QuizStart,setQuizStart] = React.useState(false)
  const [QuestionsArr,setQuestions] = React.useState([])
  const [formData,setFormData] = React.useState({})
  const [answersArr,setAnswersArr] = React.useState({})
  const [submitted,setSubmit] = React.useState(false)
  const [count,SetCount] = React.useState(0)

  function startQuiz(){
    setQuizStart(true)
  }
  async function getQuestions(){
    const req = await fetch("https://opentdb.com/api.php?amount=5&difficulty=easy&type=multiple")
    const data = await req.json()
    return data.results
  }
  async function dataFetch(){
    if(QuizStart){
    const tempArr = await getQuestions()
    if(tempArr && Array.isArray(tempArr)){
    SetCount(0)
    setQuestions(tempArr.map(Question => {
      return {
        Question:decode(Question.question),
        shuffledAnswerArr:arrayShuffle(
          [decode(Question.correct_answer),
          ...Question.incorrect_answers.map(answer => decode(answer))]),
        correctAnswer:decode(Question.correct_answer)
      }
    }))
    setFormData(tempArr.reduce((acc,question)=>{
      acc[decode(question.question)] = ""
      return acc
    },{}))
    setAnswersArr(tempArr.reduce((acc,question)=>{
      acc[decode(question.question)] = decode(question.correct_answer)
      return acc
    },{}))}
  }}
  React.useEffect(()=>{
    if(!submitted)dataFetch();
    
  },[QuizStart,submitted])
  

  let questionsComponents = QuestionsArr.map(question =>{
    return(
      <Question
        Question={question.Question}
        shuffledAnswerArr={question.shuffledAnswerArr}
        handleChange={handleChange}
        key={question.Question}
        correctAnswer={question.correctAnswer}
        checkAnswer={submitted} 
      />
    )
  })


  function handleChange(event){
    const {name,value} = event.target
    setFormData(prevFormData => {return{
      ...prevFormData,
      [name]:value
    }})
  }
  

  function handleSubmit(event){
    event.preventDefault()
    setSubmit(!submitted)
    for(let key of Object.keys(answersArr)){
      if(answersArr[key] === formData[key]){
        SetCount(prevCount => prevCount + 1)
      }
    }
    
  }

  return (
    <main>
      {
        !QuizStart ?
        <div className='initial-page'>
          <h1>Quizzical</h1>
          <button className='start' onClick={startQuiz}>Start Quiz</button>
        </div> 
        :
        <form onSubmit={handleSubmit}>
          {QuestionsArr.length > 0 && questionsComponents}
          <div className="submission">

          {submitted ? <h3>You answered {count}/5 questions correctly</h3> : null}
          <button className='submission-btn'>{submitted ? "Play Again" : "Check Answers"}</button>

          </div>
        </form>
      }
    </main>
  )
}

export default App
