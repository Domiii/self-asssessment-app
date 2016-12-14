
// TODO!

export function nextQuestion() {
  this.gotoQuestion(this.state.i+1);
}
  
export function previousQuestion() {
  this.gotoQuestion(this.state.i-1 + this.props.questions.length);
}
  
export function gotoQuestion(i) {
  console.assert(!isNaN(i));
  
  const questions = this.props.questions;
  const wrappedI = i % questions.length;
  this.setState({
    i: wrappedI,
    currentQuestion: questions[wrappedI]
  });
}