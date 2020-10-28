import React from 'react';

class SearchBar extends React.Component{
  constructor(props){
    super(props)
      
    this.state = {
      term: ''
    }
        
    this.search = this.search.bind(this); 
    this.handleTermChange = this.handleTermChange.bind(this);
  }
    
  //search method
  search(){
    this.props.onSearch(this.state.term); 
  }
    
  //handle term change method
  handleTermChange(event){
    this.setState({term: event.target.value});
  }    
  
      
  render(){
    return(
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange} />
        <button className="SearchButton">SEARCH</button>
      </div>
    )
  }
}

export default SearchBar;