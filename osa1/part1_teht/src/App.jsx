/* eslint-disable react/prop-types */
const Header = (props) => {
  return (
  <div>
  <h1>{props.course}</h1>
  </div>
  )
}

const Content = (props) => {
  return (
  <div>
  <Part props = {props.props[0]}/>
  <Part props = {props.props[1]}/>
  <Part props = {props.props[2]}/>
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
  return (
  <div>
  <p>Number of exercises {props.props[0].exercises + props.props[1].exercises + props.props[2].exercises}</p>
  </div>
  )
}

const App = () => {
    const course = {
      name: 'Half Stack application development',
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10
        },
        {
          name: 'Using props to pass data',
          exercises: 7
        },
        {
          name: 'State of a component',
          exercises: 14
        }
      ]
    }

  return (
    <div>
      <Header course = {course.name}/>
      <Content props = {course.parts}/>
      <Total props = {course.parts}/>
    </div>
  )
}

export default App