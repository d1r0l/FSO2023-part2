const Header = ({ text }) =>
  <h1>
    {text}
  </h1>

const Part = ({ name, exercises }) =>
  <p>
    {name} {exercises}
  </p>

const Total = ({ total }) =>
  <p>
    <strong>
      Total number of exercises: {total}
    </strong>
  </p>

const Content = ({ parts }) => <div>
  {parts.map(x =>
    <Part key={x.id} name={x.name} exercises={x.exercises} />
  )}
</div>

const Course = ({ course, parts, total }) =>
  <div>
    <Header text={course} />
    <Content parts={parts} />
    <Total total={total} />
  </div>

export default Course