import React from 'react';
import logo from './logo.jpg';
import './App.css';
import SearchBar from '../SearchBar/SearchBar.js';
import SearchResults from '../SearchResults/SearchResults.js';
import Playlist from '../Playlist/Playlist.js';
import Spotify from '../../util/Spotify.js';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      searchResults: [],
      playlistName: 'My Playlist',
      playlistTracks: []
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }
    
  //adding track method
  addTrack(track){
    let tracks = this.state.playlistTracks;
    if(tracks.find(savedTracks => savedTracks.id === track.id)){
      return;
    } else{ 
      tracks.push(track);
      this.setState ({playlistTracks: tracks});
    }
  }
    
  //removing track method
  removeTrack(track){
    let tracks = this.state.playlistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
    this.setState ({playlistTracks: tracks});   
  }
    
  //update playlist name method
  updatePlaylistName(name){
    this.setState ({playlistName: name});
  }
    
  //save playlist method
  savePlaylist(){
    const trackUris = this.state.playlistTracks.map(track => track.uri);  
    Spotify.savePlaylist(this.state.playlistName, trackUris)
      .then(() => { 
        this.setState({
          playlistName: 'New Playlist',
          playlistTracks: []
        })
      })  
  }   
    
  //search method
  search(term){
    Spotify.search(term).then(searchResults => {
      this.setState({searchResults: searchResults}); 
    })
  }
    
  render() {
    return(
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistName={this.state.playlistName} 
                      playlistTracks={this.state.playlistTracks}
                      onRemove={this.removeTrack}
                      onNameChange={this.updatePlaylistName} 
                      onSave={this.savePlaylist}  />
          </div>
        </div>
      </div>
    )
  }
}
export default App;
