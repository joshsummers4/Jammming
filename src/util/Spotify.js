let accessToken;

const clientId = "7c1782544d1744e38270ba83b1f62eaf";

const redirectUri = "http://josh_jammming.surge.sh";

const Spotify = {
  getAccessToken(){
    if(accessToken){
      return accessToken;
    }
      
    //check for access token match
    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);  
    const expiresInMatch = window.location.href.match(/expires_on=([^&]*)/); 
  
    if(accessTokenMatch && expiresInMatch){
      accessToken = accessTokenMatch[1];
      const expirationTime = Number(expiresInMatch[1]);
      // access token to expire and clear at the value for expiration time
      window.setTimeout(() => accessToken = '', expirationTime * 1000);
      //clear parameters from URL  
      window.history.pushState('Access Token', null, '/');
      return accessToken;
    } else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
      window.location = accessUrl;
    }
  },  
    //search method that returns a promise of the searched tracks
  search(term){
    const accessToken = Spotify.getAccessToken();
    return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      } 
    })
    //convert response to JSON
    .then(response => {
        return response.json()
    }) 
    //convert json to array
    .then(jsonResponse => {
        if(!jsonResponse.tracks){
            return [];
        } else {
            return jsonResponse.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artists: track.artists[0].name,
                album: track.album.name,
                preview: track.preview_url,
                uri: track.uri
            }));    
        }
     })  
  },

          
       
  savePlaylist(name, trackUris){
    if(!name || !trackUris.length){
      return;
    }
    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: `Bearer: ${accessToken}`};
    let userId;
    return fetch('https://api.spotify.com/v1/me', {headers: headers}
    ).then(response => response.json()
    ).then(jsonResponse => {
        userId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
            headers: headers,
            method: 'POST',
            body: JSON.stringify({name: name})
        }).then(response => response.json()
        ).then(jsonResponse => {
            const playlistId = jsonResponse.id;
            return fetch(`https://api.spotify.com//v1/users/${userId}/playlists/${playlistId}/tracks`, { 
                headers: headers, 
                method: 'POST',
                body: JSON.stringify({uris: trackUris})
            })
        })    
    })    
  } 
}
export default Spotify;
