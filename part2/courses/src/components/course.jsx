/* eslint-disable react/prop-types */
const Header = (props) => {
    return (
    <div>
    <h1>{props.course}</h1>
    </div>
    )
  }
  
  const Content = (props) => {
    
    const parts = props.props.map(element => { return <Part key={element.id} props={element} /> } )
    
    return (
    <div>
     {parts}
    </div>
    )
  }
  
  const Part = (props) => {
    return (
    <div>
    <p>{props.props.name} {props.props.exercises}</p>
    </div>
    )
  }
  
  const Total = (props) => {
  
    const totalExercises = props.props.reduce((sum,order) => sum + order.exercises, 0)
  
    return (
      <div>
        <p>Number of exercise {totalExercises}</p>
      </div>
    )
  }
  
  const Course = (props) => {
    return (
      <div>
        <Header course = {props.course.name}/>
        <Content props = {props.course.parts}/>
        <Total props = {props.course.parts}/>
      </div>
    )
  } 

export default Course;