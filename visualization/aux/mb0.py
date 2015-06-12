import musicbrainzngs
import time
import json

with open("artists.txt") as f:
  rappers = f.read().splitlines()

musicbrainzngs.set_useragent("Example music app", "0.1", "http://example.com/music")

rapper_ids = {}

for name in rappers:
    result = musicbrainzngs.search_artists(artist=name)
    time.sleep(1.3)
    if result['artist-count'] > 0:
      id = result['artist-list'][0]['id']
    rapper_ids[name] = id

json.dump(rapper_ids, open('artist_ids.json', 'w'), indent=2, separators=(',', ': '), sort_keys=True)

# ids to change manually after running
# Danny Brown: 960afc67-9c21-46dd-9c7f-ff2b509e3150