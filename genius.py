from pygenius import artists
from pygenius import songs
from pygenius import wordsearch

name = str(raw_input("enter an artist's name: "))
print name
song_list = songs.findAllSongs(name)
print song_list
print len(song_list)
for song in song_list:
    print songs.searchSong(name, song, "lyrics")
    
